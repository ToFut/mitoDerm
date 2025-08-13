import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  DocumentData,
  Timestamp
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth } from '../firebase';

// Import enhanced User type from main types file
import { User, UserProfile, UserPreferences, UserStats, PartnerStatus } from '@/types';

export interface UserSignupData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  clinic?: string;
  profession?: string;
  address?: string;
  bio?: string;
  website?: string;
  membershipTier?: 'basic' | 'premium' | 'vip';
}

// Helper function to check if Firebase is initialized
const checkFirebase = () => {
  if (!db || !auth) {
    throw new Error('Firebase is not initialized');
  }
  return { db, auth };
};

class UserService {
  private firebaseAuth = getAuth();

  // Create new user account
  async createUser(userData: UserSignupData): Promise<string | null> {
    try {
      const { db } = checkFirebase();
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        this.firebaseAuth,
        userData.email,
        userData.password
      );

      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: userData.name
      });

      // Create enhanced user document in Firestore
      const userDoc = {
        email: userData.email,
        name: userData.name,
        role: 'user' as const,
        status: 'active' as const,
        membershipTier: userData.membershipTier || 'basic' as const,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        profile: {
          phone: userData.phone || '',
          clinic: userData.clinic || '',
          profession: userData.profession || '',
          address: userData.address || '',
          bio: userData.bio || '',
          website: userData.website || '',
          certificationStatus: 'none' as const,
          preferences: {
            language: 'en' as const,
            notifications: {
              email: true,
              sms: false,
              push: true,
              orderUpdates: true,
              eventInvites: true,
              educationContent: true
            },
            privacy: {
              profileVisible: true,
              certificateVisible: true,
              contactInfoVisible: false
            }
          },
          stats: {
            totalOrders: 0,
            totalSpent: 0,
            coursesCompleted: 0,
            certificatesEarned: 0,
            eventsAttended: 0,
            joinedDate: new Date().toISOString()
          }
        }
      };

      const docRef = await addDoc(collection(db, 'users'), userDoc);
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  // Get all users with real-time updates
  async getUsers(callback: (users: User[]) => void): Promise<() => void> {
    try {
      const { db } = checkFirebase();
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        callback(users);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUser(userId: string): Promise<User | null> {
    try {
      const { db } = checkFirebase();
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return {
          id: userSnap.id,
          ...userSnap.data()
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Update user
  async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  // Update user last login
  async updateLastLogin(userId: string): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        lastLogin: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating last login:', error);
      return false;
    }
  }

  // Delete user
  async deleteUser(userId: string): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Get users by role
  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const { db } = checkFirebase();
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', role), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Error getting users by role:', error);
      return [];
    }
  }

  // Get users by status
  async getUsersByStatus(status: string): Promise<User[]> {
    try {
      const { db } = checkFirebase();
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('status', '==', status), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Error getting users by status:', error);
      return [];
    }
  }

  // Search users
  async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const { db } = checkFirebase();
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      
      return users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Get user statistics
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    usersByRole: { [key: string]: number };
  }> {
    try {
      const { db } = checkFirebase();
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        newUsersThisMonth: users.filter(u => 
          u.createdAt && new Date(u.createdAt) >= thisMonth
        ).length,
        usersByRole: users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number })
      };

      return stats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
        usersByRole: {}
      };
    }
  }

  // Update user certification status with level
  async updateUserCertificationStatus(
    userId: string, 
    status: 'none' | 'pending' | 'approved' | 'rejected',
    level?: 'basic' | 'advanced' | 'expert'
  ): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const userRef = doc(db, 'users', userId);
      const updateData: any = {
        'profile.certificationStatus': status,
        updatedAt: serverTimestamp()
      };
      
      if (level) {
        updateData['profile.certificationLevel'] = level;
      }
      
      // If approved, increment certificates earned
      if (status === 'approved') {
        const user = await this.getUser(userId);
        if (user) {
          updateData['profile.stats.certificatesEarned'] = (user.profile.stats?.certificatesEarned || 0) + 1;
        }
      }
      
      await updateDoc(userRef, updateData);
      return true;
    } catch (error) {
      console.error('Error updating user certification status:', error);
      return false;
    }
  }

  // Check if user is certified
  async isUserCertified(userId: string): Promise<boolean> {
    try {
      const user = await this.getUser(userId);
      return user?.profile?.certificationStatus === 'approved';
    } catch (error) {
      console.error('Error checking user certification:', error);
      return false;
    }
  }

  // Get certified users
  async getCertifiedUsers(): Promise<User[]> {
    try {
      const { db } = checkFirebase();
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef, 
        where('profile.certificationStatus', '==', 'approved'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Error getting certified users:', error);
      return [];
    }
  }

  // Get users by certification status
  async getUsersByCertificationStatus(status: 'none' | 'pending' | 'approved' | 'rejected'): Promise<User[]> {
    try {
      const { db } = checkFirebase();
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef, 
        where('profile.certificationStatus', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Error getting users by certification status:', error);
      return [];
    }
  }

  // Partner System Methods
  async makeUserPartner(
    userId: string, 
    partnerLevel: 'bronze' | 'silver' | 'gold' | 'platinum',
    discountRate: number,
    minimumOrder: number,
    specialAccess: string[] = [],
    approvedBy: string
  ): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: 'partner',
        'profile.partnerStatus': {
          isPartner: true,
          partnerLevel,
          discountRate,
          minimumOrder,
          specialAccess,
          approvedBy,
          approvedDate: new Date().toISOString()
        },
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error making user partner:', error);
      return false;
    }
  }

  async removePartnerStatus(userId: string): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: 'user',
        'profile.partnerStatus': {
          isPartner: false,
          partnerLevel: 'bronze',
          discountRate: 0,
          minimumOrder: 0,
          specialAccess: []
        },
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error removing partner status:', error);
      return false;
    }
  }

  async getPartners(): Promise<User[]> {
    try {
      const { db } = checkFirebase();
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('role', '==', 'partner'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Error getting partners:', error);
      return [];
    }
  }

  // User Preferences Methods
  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'profile.preferences': preferences,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return false;
    }
  }

  // User Stats Methods
  async updateUserStats(userId: string, statsUpdate: Partial<UserStats>): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const userRef = doc(db, 'users', userId);
      const user = await this.getUser(userId);
      if (!user) return false;

      const currentStats = user.profile.stats || {
        totalOrders: 0,
        totalSpent: 0,
        coursesCompleted: 0,
        certificatesEarned: 0,
        eventsAttended: 0,
        joinedDate: user.createdAt
      };

      const updatedStats = { ...currentStats, ...statsUpdate };
      
      await updateDoc(userRef, {
        'profile.stats': updatedStats,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating user stats:', error);
      return false;
    }
  }

  async incrementUserStat(userId: string, statField: keyof UserStats, amount: number = 1): Promise<boolean> {
    try {
      const user = await this.getUser(userId);
      if (!user) return false;

      const currentValue = user.profile.stats?.[statField] as number || 0;
      const updateData = { [statField]: currentValue + amount };
      
      return await this.updateUserStats(userId, updateData);
    } catch (error) {
      console.error('Error incrementing user stat:', error);
      return false;
    }
  }

  // Membership Tier Methods
  async updateMembershipTier(userId: string, tier: 'basic' | 'premium' | 'vip'): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        membershipTier: tier,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating membership tier:', error);
      return false;
    }
  }

  // Enhanced Search
  async searchUsersAdvanced(filters: {
    searchTerm?: string;
    role?: string;
    status?: string;
    membershipTier?: string;
    certificationStatus?: string;
    isPartner?: boolean;
  }): Promise<User[]> {
    try {
      const { db } = checkFirebase();
      const usersRef = collection(db, 'users');
      let q = query(usersRef, orderBy('createdAt', 'desc'));
      
      // Apply filters
      if (filters.role) {
        q = query(q, where('role', '==', filters.role));
      }
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.membershipTier) {
        q = query(q, where('membershipTier', '==', filters.membershipTier));
      }
      if (filters.certificationStatus) {
        q = query(q, where('profile.certificationStatus', '==', filters.certificationStatus));
      }
      if (filters.isPartner !== undefined) {
        q = query(q, where('profile.partnerStatus.isPartner', '==', filters.isPartner));
      }
      
      const querySnapshot = await getDocs(q);
      let users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      
      // Client-side text search if provided
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        users = users.filter(user => 
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.profile?.profession?.toLowerCase().includes(term) ||
          user.profile?.clinic?.toLowerCase().includes(term)
        );
      }
      
      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Lead creation function for form submissions
  async createLead(leadData: {
    name: string;
    email: string;
    phone: string;
    profession?: string;
    source: string;
    status: string;
    createdAt: string;
  }) {
    try {
      const { db } = checkFirebase();
      
      // Create a basic user record as a lead
      const leadUser = {
        ...leadData,
        role: 'user' as const,
        membershipTier: 'basic' as const,
        isLead: true,
        emailVerified: false,
        phoneVerified: false,
        createdAt: serverTimestamp(),
        profile: {
          phone: leadData.phone,
          profession: leadData.profession || '',
          clinic: '',
          address: '',
          bio: '',
          website: '',
          certificationStatus: 'none' as const,
          preferences: {
            language: 'en' as const,
            notifications: {
              email: true,
              sms: false,
              push: true,
              orderUpdates: true,
              eventInvites: true,
              educationContent: true
            },
            privacy: {
              profileVisible: true,
              certificateVisible: true,
              contactInfoVisible: false
            }
          },
          stats: {
            totalOrders: 0,
            totalSpent: 0,
            coursesCompleted: 0,
            certificatesEarned: 0,
            eventsAttended: 0,
            joinedDate: leadData.createdAt
          }
        }
      };

      const docRef = await addDoc(collection(db, 'leads'), leadUser);
      return { id: docRef.id, ...leadUser };
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  }
}

export const userService = new UserService();

// Export additional helper functions
export const isPartner = (user: User): boolean => {
  return user.role === 'partner' && user.profile?.partnerStatus?.isPartner === true;
};

export const isCertified = (user: User): boolean => {
  return user.profile?.certificationStatus === 'approved';
};

export const getDiscountRate = (user: User): number => {
  return user.profile?.partnerStatus?.discountRate || 0;
};

export const canAccessProduct = (user: User, productRequiresPartner: boolean, productRequiresCertification: boolean): boolean => {
  if (productRequiresPartner && !isPartner(user)) {
    return false;
  }
  if (productRequiresCertification && !isCertified(user)) {
    return false;
  }
  return true;
}; 