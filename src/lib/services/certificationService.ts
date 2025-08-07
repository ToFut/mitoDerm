import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CertificationRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userProfile: {
    phone?: string;
    clinic?: string;
    profession?: string;
    address?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'meeting_scheduled' | 'meeting_completed';
  requestDate: Timestamp;
  reviewDate?: Timestamp;
  reviewedBy?: string;
  reviewerName?: string;
  reviewNotes?: string;
  meetingDate?: Timestamp;
  meetingNotes?: string;
  certificationLevel: 'basic' | 'advanced' | 'expert';
  documents?: {
    id: string;
    name: string;
    url: string;
    uploadedAt: Timestamp;
  }[];
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CertificationMeeting {
  id: string;
  certificationId: string;
  userId: string;
  userEmail: string;
  userName: string;
  meetingDate: Timestamp;
  meetingType: 'video_call' | 'in_person' | 'phone';
  meetingLink?: string;
  meetingLocation?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  adminNotes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Helper function to check if Firebase is initialized
const checkFirebase = () => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }
  return { db };
};

class CertificationService {
  // Create certification request
  async createCertificationRequest(
    userId: string,
    userEmail: string,
    userName: string,
    userProfile: any,
    certificationLevel: 'basic' | 'advanced' | 'expert' = 'basic',
    documents?: { name: string; url: string }[]
  ): Promise<string | null> {
    try {
      const { db } = checkFirebase();
      const certificationDoc = {
        userId,
        userEmail,
        userName,
        userProfile,
        status: 'pending',
        requestDate: serverTimestamp(),
        certificationLevel,
        documents: documents?.map((doc, index) => ({
          id: `doc_${Date.now()}_${index}`,
          name: doc.name,
          url: doc.url,
          uploadedAt: serverTimestamp()
        })) || [],
        tags: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'certifications'), certificationDoc);
      return docRef.id;
    } catch (error) {
      console.error('Error creating certification request:', error);
      return null;
    }
  }

  // Get all certifications with real-time updates
  async getCertifications(callback: (certifications: CertificationRequest[]) => void): Promise<() => void> {
    try {
      const { db } = checkFirebase();
      const certificationsRef = collection(db, 'certifications');
      const q = query(certificationsRef, orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const certifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CertificationRequest[];
        callback(certifications);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error getting certifications:', error);
      throw error;
    }
  }

  // Get certifications by user
  async getCertificationsByUser(userId: string): Promise<CertificationRequest[]> {
    try {
      const { db } = checkFirebase();
      const certificationsRef = collection(db, 'certifications');
      const q = query(
        certificationsRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CertificationRequest[];
    } catch (error) {
      console.error('Error getting user certifications:', error);
      return [];
    }
  }

  // Get certification by ID
  async getCertification(certificationId: string): Promise<CertificationRequest | null> {
    try {
      const { db } = checkFirebase();
      const certificationRef = doc(db, 'certifications', certificationId);
      const certificationSnap = await getDoc(certificationRef);
      
      if (certificationSnap.exists()) {
        return {
          id: certificationSnap.id,
          ...certificationSnap.data()
        } as CertificationRequest;
      }
      return null;
    } catch (error) {
      console.error('Error getting certification:', error);
      return null;
    }
  }

  // Review certification (approve/reject)
  async reviewCertification(
    certificationId: string,
    status: 'approved' | 'rejected',
    reviewerId: string,
    reviewerName: string,
    reviewNotes: string
  ): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const certificationRef = doc(db, 'certifications', certificationId);
      await updateDoc(certificationRef, {
        status,
        reviewDate: serverTimestamp(),
        reviewedBy: reviewerId,
        reviewerName,
        reviewNotes,
        updatedAt: serverTimestamp()
      });

      // If approved, update user's certification status
      if (status === 'approved') {
        const certification = await this.getCertification(certificationId);
        if (certification) {
          await this.updateUserCertificationStatus(certification.userId, 'approved');
        }
      }

      return true;
    } catch (error) {
      console.error('Error reviewing certification:', error);
      return false;
    }
  }

  // Schedule meeting
  async scheduleMeeting(
    certificationId: string,
    meetingDate: Date,
    meetingType: 'video_call' | 'in_person' | 'phone',
    meetingLink?: string,
    meetingLocation?: string,
    notes?: string
  ): Promise<string | null> {
    try {
      const { db } = checkFirebase();
      const certification = await this.getCertification(certificationId);
      if (!certification) return null;

      // Create meeting document
      const meetingDoc = {
        certificationId,
        userId: certification.userId,
        userEmail: certification.userEmail,
        userName: certification.userName,
        meetingDate: Timestamp.fromDate(meetingDate),
        meetingType,
        meetingLink,
        meetingLocation,
        status: 'scheduled',
        notes,
        adminNotes: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const meetingRef = await addDoc(collection(db, 'certification_meetings'), meetingDoc);

      // Update certification status
      const certificationRef = doc(db, 'certifications', certificationId);
      await updateDoc(certificationRef, {
        status: 'meeting_scheduled',
        meetingDate: Timestamp.fromDate(meetingDate),
        updatedAt: serverTimestamp()
      });

      return meetingRef.id;
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      return null;
    }
  }

  // Complete meeting
  async completeMeeting(
    meetingId: string,
    adminNotes: string,
    certificationStatus: 'approved' | 'rejected'
  ): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const meetingRef = doc(db, 'certification_meetings', meetingId);
      await updateDoc(meetingRef, {
        status: 'completed',
        adminNotes,
        updatedAt: serverTimestamp()
      });

      // Get meeting to find certification
      const meetingSnap = await getDoc(meetingRef);
      if (meetingSnap.exists()) {
        const meeting = meetingSnap.data() as CertificationMeeting;
        
        // Update certification status
        const certificationRef = doc(db, 'certifications', meeting.certificationId);
        await updateDoc(certificationRef, {
          status: certificationStatus,
          reviewDate: serverTimestamp(),
          reviewNotes: adminNotes,
          updatedAt: serverTimestamp()
        });

        // If approved, update user certification status
        if (certificationStatus === 'approved') {
          await this.updateUserCertificationStatus(meeting.userId, 'approved');
        }
      }

      return true;
    } catch (error) {
      console.error('Error completing meeting:', error);
      return false;
    }
  }

  // Update user certification status
  async updateUserCertificationStatus(userId: string, status: 'none' | 'pending' | 'approved' | 'rejected'): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'profile.certificationStatus': status,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating user certification status:', error);
      return false;
    }
  }

  // Get meetings
  async getMeetings(callback: (meetings: CertificationMeeting[]) => void): Promise<() => void> {
    try {
      const { db } = checkFirebase();
      const meetingsRef = collection(db, 'certification_meetings');
      const q = query(meetingsRef, orderBy('meetingDate', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const meetings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CertificationMeeting[];
        callback(meetings);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error getting meetings:', error);
      throw error;
    }
  }

  // Get certification statistics
  async getCertificationStats(): Promise<{
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    meetingsScheduled: number;
    requestsByLevel: { [key: string]: number };
  }> {
    try {
      const { db } = checkFirebase();
      const certificationsRef = collection(db, 'certifications');
      const q = query(certificationsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const certifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CertificationRequest[];

      const stats = {
        totalRequests: certifications.length,
        pendingRequests: certifications.filter(c => c.status === 'pending').length,
        approvedRequests: certifications.filter(c => c.status === 'approved').length,
        rejectedRequests: certifications.filter(c => c.status === 'rejected').length,
        meetingsScheduled: certifications.filter(c => c.status === 'meeting_scheduled').length,
        requestsByLevel: certifications.reduce((acc, cert) => {
          acc[cert.certificationLevel] = (acc[cert.certificationLevel] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number })
      };

      return stats;
    } catch (error) {
      console.error('Error getting certification stats:', error);
      return {
        totalRequests: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        rejectedRequests: 0,
        meetingsScheduled: 0,
        requestsByLevel: {}
      };
    }
  }

  // Add tags to certification
  async addCertificationTags(certificationId: string, tags: string[]): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const certificationRef = doc(db, 'certifications', certificationId);
      await updateDoc(certificationRef, {
        tags,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error adding certification tags:', error);
      return false;
    }
  }

  // Certificate management methods
  
  // Subscribe to certificates (for issued certificates)
  subscribeToCertificates(callback: (certificates: any[]) => void): () => void {
    try {
      const { db } = checkFirebase();
      const certificatesRef = collection(db, 'issued_certificates');
      const q = query(certificatesRef, orderBy('issuedDate', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const certificates = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(certificates);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up certificates listener:', error);
      return () => {};
    }
  }

  // Revoke certificate
  async revokeCertificate(certificateId: string): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const certificateRef = doc(db, 'issued_certificates', certificateId);
      await updateDoc(certificateRef, {
        status: 'revoked',
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error revoking certificate:', error);
      return false;
    }
  }

  // Reissue certificate
  async reissueCertificate(certificateId: string): Promise<string | null> {
    try {
      const { db } = checkFirebase();
      const originalCertRef = doc(db, 'issued_certificates', certificateId);
      const originalCert = await getDoc(originalCertRef);
      
      if (!originalCert.exists()) return null;
      
      const certData = originalCert.data();
      const newCertificate = {
        ...certData,
        issuedDate: new Date().toISOString(),
        credentialId: `${certData.credentialId}-reissued-${Date.now()}`,
        status: 'active',
        metadata: {
          ...certData.metadata,
          originalCertificateId: certificateId,
          reissued: true
        }
      };
      
      // Remove the original id and timestamps
      delete newCertificate.id;
      delete newCertificate.createdAt;
      delete newCertificate.updatedAt;
      
      const newCertRef = await addDoc(collection(db, 'issued_certificates'), newCertificate);
      return newCertRef.id;
    } catch (error) {
      console.error('Error reissuing certificate:', error);
      return null;
    }
  }

  // Send renewal reminder
  async sendRenewalReminder(certificateId: string): Promise<boolean> {
    try {
      // This would integrate with email service
      // For now, just log the action
      console.log('Sending renewal reminder for certificate:', certificateId);
      return true;
    } catch (error) {
      console.error('Error sending renewal reminder:', error);
      return false;
    }
  }
}

// Get certification requests (alias for getCertifications)
export const getCertificationRequests = async (callback: (certifications: CertificationRequest[]) => void): Promise<() => void> => {
  const service = new CertificationService();
  return service.getCertifications(callback);
};

// Export the service instance
export const certificationService = new CertificationService();

// Helper functions for certificate status
export const getCertificateStatusColor = (status: string): string => {
  const colors = {
    active: '#10b981',
    expired: '#ef4444',
    revoked: '#6b7280'
  };
  return colors[status as keyof typeof colors] || '#10b981';
};

export const formatCertificateDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const isCertificateExpired = (expiryDate?: string): boolean => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

export const getCertificateExpiryWarning = (expiryDate?: string): { warning: boolean; daysUntilExpiry: number } => {
  if (!expiryDate) return { warning: false, daysUntilExpiry: Infinity };
  
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    warning: daysUntilExpiry <= 30 && daysUntilExpiry > 0,
    daysUntilExpiry
  };
}; 