import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course, Lesson, CourseEnrollment, Certificate, Instructor } from '@/types';
import { userService } from './userService';

// Helper function to check if Firebase is initialized
const checkFirebase = () => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }
  return { db };
};

class EducationService {
  // Course Management
  async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const { db } = checkFirebase();
      
      const courseDoc = {
        ...courseData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        enrollmentCount: 0,
        completionRate: 0,
        averageRating: 0,
        reviewCount: 0
      };

      const docRef = await addDoc(collection(db, 'courses'), courseDoc);
      return docRef.id;
    } catch (error) {
      console.error('Error creating course:', error);
      return null;
    }
  }

  async getCourse(courseId: string): Promise<Course | null> {
    try {
      const { db } = checkFirebase();
      const courseRef = doc(db, 'courses', courseId);
      const courseSnap = await getDoc(courseRef);
      
      if (courseSnap.exists()) {
        return {
          id: courseSnap.id,
          ...courseSnap.data()
        } as Course;
      }
      return null;
    } catch (error) {
      console.error('Error getting course:', error);
      return null;
    }
  }

  async getCourses(filters?: {
    category?: string;
    level?: string;
    isFree?: boolean;
    status?: 'draft' | 'published' | 'archived';
  }): Promise<Course[]> {
    try {
      const { db } = checkFirebase();
      const coursesRef = collection(db, 'courses');
      let q = query(coursesRef, orderBy('createdAt', 'desc'));

      // Apply filters
      if (filters?.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters?.level) {
        q = query(q, where('level', '==', filters.level));
      }
      if (filters?.isFree !== undefined) {
        q = query(q, where('isFree', '==', filters.isFree));
      }
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
    } catch (error) {
      console.error('Error getting courses:', error);
      return [];
    }
  }

  async updateCourse(courseId: string, updates: Partial<Course>): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const courseRef = doc(db, 'courses', courseId);
      await updateDoc(courseRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating course:', error);
      return false;
    }
  }

  async deleteCourse(courseId: string): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const courseRef = doc(db, 'courses', courseId);
      await deleteDoc(courseRef);
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      return false;
    }
  }

  // Enrollment Management
  async enrollInCourse(courseId: string, userId: string): Promise<string | null> {
    try {
      const { db } = checkFirebase();
      
      // Check if user is already enrolled
      const existingEnrollment = await this.getUserCourseEnrollment(courseId, userId);
      if (existingEnrollment) {
        throw new Error('User already enrolled in this course');
      }

      const enrollmentDoc = {
        courseId,
        userId,
        enrollmentDate: new Date().toISOString(),
        progress: 0,
        completedLessons: [],
        timeSpent: 0,
        lastAccessDate: new Date().toISOString(),
        certificateIssued: false
      };

      const docRef = await addDoc(collection(db, 'course_enrollments'), enrollmentDoc);

      // Update course enrollment count
      const course = await this.getCourse(courseId);
      if (course) {
        await this.updateCourse(courseId, {
          enrollmentCount: course.enrollmentCount + 1
        });
      }

      return docRef.id;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      return null;
    }
  }

  async getUserCourseEnrollment(courseId: string, userId: string): Promise<CourseEnrollment | null> {
    try {
      const { db } = checkFirebase();
      const enrollmentsRef = collection(db, 'course_enrollments');
      const q = query(
        enrollmentsRef,
        where('courseId', '==', courseId),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as CourseEnrollment;
      }
      return null;
    } catch (error) {
      console.error('Error getting user course enrollment:', error);
      return null;
    }
  }

  async getUserEnrollments(userId: string): Promise<CourseEnrollment[]> {
    try {
      const { db } = checkFirebase();
      const enrollmentsRef = collection(db, 'course_enrollments');
      const q = query(
        enrollmentsRef,
        where('userId', '==', userId),
        orderBy('enrollmentDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CourseEnrollment[];
    } catch (error) {
      console.error('Error getting user enrollments:', error);
      return [];
    }
  }

  async getCourseEnrollments(courseId: string): Promise<CourseEnrollment[]> {
    try {
      const { db } = checkFirebase();
      const enrollmentsRef = collection(db, 'course_enrollments');
      const q = query(
        enrollmentsRef,
        where('courseId', '==', courseId),
        orderBy('enrollmentDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CourseEnrollment[];
    } catch (error) {
      console.error('Error getting course enrollments:', error);
      return [];
    }
  }

  // Progress Tracking
  async updateLessonProgress(
    enrollmentId: string,
    lessonId: string,
    timeSpent: number = 0
  ): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const enrollmentRef = doc(db, 'course_enrollments', enrollmentId);
      const enrollment = await getDoc(enrollmentRef);
      
      if (!enrollment.exists()) {
        return false;
      }

      const enrollmentData = enrollment.data() as CourseEnrollment;
      const completedLessons = [...enrollmentData.completedLessons];
      
      // Add lesson to completed if not already there
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }

      // Get course to calculate progress
      const course = await this.getCourse(enrollmentData.courseId);
      if (!course) return false;

      const progress = (completedLessons.length / course.lessons.length) * 100;
      const isCompleted = progress >= 100;

      const updateData: any = {
        completedLessons,
        progress,
        timeSpent: enrollmentData.timeSpent + timeSpent,
        lastAccessDate: new Date().toISOString()
      };

      // If course is completed, set completion date and issue certificate
      if (isCompleted && !enrollmentData.completionDate) {
        updateData.completionDate = new Date().toISOString();
        
        // Issue certificate if course has one
        if (course.certificateTemplate) {
          const certificateId = await this.issueCertificate(
            enrollmentData.userId,
            'course',
            course.title,
            `Certificate of completion for ${course.title}`,
            course.certificateTemplate
          );
          if (certificateId) {
            updateData.certificateIssued = true;
            updateData.certificateId = certificateId;
          }
        }

        // Update user stats
        await userService.incrementUserStat(enrollmentData.userId, 'coursesCompleted');
      }

      await updateDoc(enrollmentRef, updateData);

      // Update course completion rate
      await this.updateCourseStats(enrollmentData.courseId);

      return true;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      return false;
    }
  }

  async updateCourseStats(courseId: string): Promise<boolean> {
    try {
      const enrollments = await this.getCourseEnrollments(courseId);
      const completedEnrollments = enrollments.filter(e => e.completionDate);
      const completionRate = enrollments.length > 0 
        ? (completedEnrollments.length / enrollments.length) * 100 
        : 0;

      await this.updateCourse(courseId, { completionRate });
      return true;
    } catch (error) {
      console.error('Error updating course stats:', error);
      return false;
    }
  }

  // Certificate Management
  async issueCertificate(
    userId: string,
    type: 'course' | 'event' | 'certification',
    title: string,
    description: string,
    templateId: string,
    metadata: Record<string, any> = {}
  ): Promise<string | null> {
    try {
      const { db } = checkFirebase();
      
      const credentialId = `MTD-${type.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const certificateDoc = {
        userId,
        type,
        title,
        description,
        issuedDate: new Date().toISOString(),
        credentialId,
        verificationUrl: `https://mitoderm.com/verify/${credentialId}`,
        issuerName: 'Mitoderm',
        issuerLogo: '/images/logo.svg',
        templateId,
        metadata,
        status: 'active'
      };

      const docRef = await addDoc(collection(db, 'certificates'), certificateDoc);
      
      // Update user stats
      await userService.incrementUserStat(userId, 'certificatesEarned');
      
      return docRef.id;
    } catch (error) {
      console.error('Error issuing certificate:', error);
      return null;
    }
  }

  async getUserCertificates(userId: string): Promise<Certificate[]> {
    try {
      const { db } = checkFirebase();
      const certificatesRef = collection(db, 'certificates');
      const q = query(
        certificatesRef,
        where('userId', '==', userId),
        where('status', '==', 'active'),
        orderBy('issuedDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Certificate[];
    } catch (error) {
      console.error('Error getting user certificates:', error);
      return [];
    }
  }

  async verifyCertificate(credentialId: string): Promise<Certificate | null> {
    try {
      const { db } = checkFirebase();
      const certificatesRef = collection(db, 'certificates');
      const q = query(
        certificatesRef,
        where('credentialId', '==', credentialId),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as Certificate;
      }
      return null;
    } catch (error) {
      console.error('Error verifying certificate:', error);
      return null;
    }
  }

  // Instructor Management
  async createInstructor(instructorData: Omit<Instructor, 'id'>): Promise<string | null> {
    try {
      const { db } = checkFirebase();
      const docRef = await addDoc(collection(db, 'instructors'), instructorData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating instructor:', error);
      return null;
    }
  }

  async getInstructors(): Promise<Instructor[]> {
    try {
      const { db } = checkFirebase();
      const instructorsRef = collection(db, 'instructors');
      const q = query(instructorsRef, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Instructor[];
    } catch (error) {
      console.error('Error getting instructors:', error);
      return [];
    }
  }

  // Search and Discovery
  async searchCourses(searchTerm: string, filters?: {
    category?: string;
    level?: string;
    isFree?: boolean;
  }): Promise<Course[]> {
    try {
      const courses = await this.getCourses({ ...filters, status: 'published' });
      
      if (!searchTerm) return courses;

      const term = searchTerm.toLowerCase();
      return courses.filter(course =>
        course.title.toLowerCase().includes(term) ||
        course.description.toLowerCase().includes(term) ||
        course.category.toLowerCase().includes(term) ||
        course.tags.some(tag => tag.toLowerCase().includes(term)) ||
        course.instructor.name.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error searching courses:', error);
      return [];
    }
  }

  async getRecommendedCourses(userId: string, limit: number = 5): Promise<Course[]> {
    try {
      // Simple recommendation based on user's completed courses and interests
      const userEnrollments = await this.getUserEnrollments(userId);
      const completedCourseIds = userEnrollments
        .filter(e => e.completionDate)
        .map(e => e.courseId);
      
      // Get user's preferred categories from completed courses
      const completedCourses = await Promise.all(
        completedCourseIds.map(id => this.getCourse(id))
      );
      const preferredCategories = [...new Set(
        completedCourses
          .filter(Boolean)
          .map(course => course!.category)
      )];

      // Get courses from preferred categories that user hasn't enrolled in
      const allCourses = await this.getCourses({ status: 'published' });
      const enrolledCourseIds = userEnrollments.map(e => e.courseId);
      
      const recommendations = allCourses
        .filter(course => !enrolledCourseIds.includes(course.id!))
        .filter(course => 
          preferredCategories.length === 0 || 
          preferredCategories.includes(course.category)
        )
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, limit);

      return recommendations;
    } catch (error) {
      console.error('Error getting recommended courses:', error);
      return [];
    }
  }

  // Analytics and Statistics
  async getEducationStats(): Promise<{
    totalCourses: number;
    totalEnrollments: number;
    totalCertificatesIssued: number;
    averageCompletionRate: number;
    coursesByCategory: Record<string, number>;
    coursesByLevel: Record<string, number>;
    topInstructors: { instructor: Instructor; courseCount: number; averageRating: number }[];
  }> {
    try {
      const courses = await this.getCourses();
      const enrollments = await this.getAllEnrollments();
      const certificates = await this.getAllCertificates();
      const instructors = await this.getInstructors();

      const stats = {
        totalCourses: courses.length,
        totalEnrollments: enrollments.length,
        totalCertificatesIssued: certificates.length,
        averageCompletionRate: courses.length > 0 
          ? courses.reduce((sum, c) => sum + c.completionRate, 0) / courses.length
          : 0,
        coursesByCategory: {} as Record<string, number>,
        coursesByLevel: {} as Record<string, number>,
        topInstructors: [] as { instructor: Instructor; courseCount: number; averageRating: number }[]
      };

      // Count by category and level
      courses.forEach(course => {
        stats.coursesByCategory[course.category] = (stats.coursesByCategory[course.category] || 0) + 1;
        stats.coursesByLevel[course.level] = (stats.coursesByLevel[course.level] || 0) + 1;
      });

      // Calculate top instructors
      const instructorStats = instructors.map(instructor => {
        const instructorCourses = courses.filter(c => c.instructor.id === instructor.id);
        const averageRating = instructorCourses.length > 0
          ? instructorCourses.reduce((sum, c) => sum + c.averageRating, 0) / instructorCourses.length
          : 0;
        
        return {
          instructor,
          courseCount: instructorCourses.length,
          averageRating
        };
      });

      stats.topInstructors = instructorStats
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 10);

      return stats;
    } catch (error) {
      console.error('Error getting education stats:', error);
      return {
        totalCourses: 0,
        totalEnrollments: 0,
        totalCertificatesIssued: 0,
        averageCompletionRate: 0,
        coursesByCategory: {},
        coursesByLevel: {},
        topInstructors: []
      };
    }
  }

  private async getAllEnrollments(): Promise<CourseEnrollment[]> {
    try {
      const { db } = checkFirebase();
      const enrollmentsRef = collection(db, 'course_enrollments');
      const querySnapshot = await getDocs(enrollmentsRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CourseEnrollment[];
    } catch (error) {
      console.error('Error getting all enrollments:', error);
      return [];
    }
  }

  private async getAllCertificates(): Promise<Certificate[]> {
    try {
      const { db } = checkFirebase();
      const certificatesRef = collection(db, 'certificates');
      const querySnapshot = await getDocs(certificatesRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Certificate[];
    } catch (error) {
      console.error('Error getting all certificates:', error);
      return [];
    }
  }
}

export const educationService = new EducationService();

// Helper functions
export const getCourseProgressColor = (progress: number): string => {
  if (progress < 25) return '#ef4444';
  if (progress < 50) return '#f59e0b';
  if (progress < 75) return '#3b82f6';
  return '#10b981';
};

export const formatCourseDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
};

export const getCertificationBadge = (type: 'course' | 'event' | 'certification'): string => {
  const badges = {
    course: '🎓',
    event: '📅',
    certification: '🏆'
  };
  return badges[type] || '📜';
};

export const canAccessCourse = (course: Course, user: any): boolean => {
  if (course.requiresCertification && user?.profile?.certificationStatus !== 'approved') {
    return false;
  }
  
  if (course.certificationLevel) {
    const userLevel = user?.profile?.certificationLevel;
    const levelOrder = ['basic', 'advanced', 'expert'];
    const requiredIndex = levelOrder.indexOf(course.certificationLevel);
    const userIndex = userLevel ? levelOrder.indexOf(userLevel) : -1;
    
    if (userIndex < requiredIndex) {
      return false;
    }
  }
  
  return true;
};