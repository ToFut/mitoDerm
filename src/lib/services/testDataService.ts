import { Timestamp } from 'firebase/firestore';

export interface TestUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'clinic';
  createdAt: Timestamp;
  lastLogin: Timestamp;
  isActive: boolean;
  profile?: {
    phone?: string;
    clinic?: string;
    profession?: string;
  };
}

export interface TestProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  images: string[];
  stock: number;
  featured: boolean;
}

export interface TestOrder {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  shippingAddress?: {
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
}

export interface TestCertification {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewerId?: string;
  reviewerName?: string;
  documents: string[];
  notes?: string;
}

export interface TestMediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedAt: Timestamp;
  uploadedBy: string;
  category?: string;
}

class TestDataService {
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateTimestamp(): Timestamp {
    return Timestamp.fromDate(new Date());
  }

  generateTestUsers(count: number = 10): TestUser[] {
    const users: TestUser[] = [];
    const names = [
      'דוד לוי', 'רחל גרין', 'שרה כהן', 'מיכאל רוזן', 'אנה ברגמן',
      'יוסי שפירא', 'מירי כהן', 'דניאל לוי', 'נועה גולדברג', 'אלכס רוזנברג'
    ];
    const emails = [
      'david@clinic.co.il', 'rachel@clinic.co.il', 'sarah@clinic.co.il',
      'michael@clinic.co.il', 'anna@clinic.co.il', 'yossi@clinic.co.il',
      'miri@clinic.co.il', 'daniel@clinic.co.il', 'noa@clinic.co.il', 'alex@clinic.co.il'
    ];
    const roles: ('admin' | 'user' | 'clinic')[] = ['clinic', 'clinic', 'user', 'clinic', 'user', 'clinic', 'user', 'clinic', 'user', 'clinic'];

    for (let i = 0; i < count; i++) {
      users.push({
        id: this.generateId(),
        email: emails[i] || `user${i + 1}@test.com`,
        name: names[i] || `User ${i + 1}`,
        role: roles[i] || 'user',
        createdAt: this.generateTimestamp(),
        lastLogin: this.generateTimestamp(),
        isActive: Math.random() > 0.2,
        profile: {
          phone: `05${Math.floor(Math.random() * 90000000) + 10000000}`,
          clinic: i % 2 === 0 ? `Clinic ${i + 1}` : undefined,
          profession: i % 2 === 0 ? 'Dermatologist' : 'Cosmetologist'
        }
      });
    }

    return users;
  }

  generateTestProducts(count: number = 8): TestProduct[] {
    const products: TestProduct[] = [];
    const productData = [
      {
        name: 'V-Tech System',
        description: 'אקסוזומים לפנים לקליניקה - 20 מיליארד אקסוזומים',
        price: 2999,
        category: 'clinic',
        images: ['/images/products/kit.jpg'],
        stock: 50,
        featured: true
      },
      {
        name: 'ExoSignal Hair',
        description: 'טיפול נשירת שיער מתקדם',
        price: 1899,
        category: 'clinic',
        images: ['/images/products/serum.jpg'],
        stock: 30,
        featured: true
      },
      {
        name: 'EXOTECH Gel',
        description: 'קרם פנים מתקדם עם טכנולוגיית אקסוזומים',
        price: 899,
        category: 'home',
        images: ['/images/products/mask.jpg'],
        stock: 100,
        featured: false
      },
      {
        name: 'ExoSignal Spray',
        description: 'ספריי שיער יומיומי עם אקסוזומים',
        price: 599,
        category: 'home',
        images: ['/images/products/serum.jpg'],
        stock: 75,
        featured: false
      },
      {
        name: 'PDRN Serum',
        description: 'סרום PDRN לחידוש תאי העור',
        price: 1499,
        category: 'clinic',
        images: ['/images/products/kit.jpg'],
        stock: 25,
        featured: true
      },
      {
        name: 'Peptide Complex',
        description: 'קומפלקס פפטידים ביומימטיים',
        price: 1299,
        category: 'clinic',
        images: ['/images/products/mask.jpg'],
        stock: 40,
        featured: false
      },
      {
        name: 'Stem Cell Activator',
        description: 'מפעיל תאי גזע טבעי',
        price: 2499,
        category: 'clinic',
        images: ['/images/products/kit.jpg'],
        stock: 20,
        featured: true
      },
      {
        name: 'Anti-Aging Cream',
        description: 'קרם אנטי אייג\'ינג מתקדם',
        price: 799,
        category: 'home',
        images: ['/images/products/serum.jpg'],
        stock: 60,
        featured: false
      }
    ];

    for (let i = 0; i < count; i++) {
      const data = productData[i] || productData[0];
      products.push({
        id: this.generateId(),
        ...data,
        isActive: Math.random() > 0.1,
        createdAt: this.generateTimestamp(),
        updatedAt: this.generateTimestamp()
      });
    }

    return products;
  }

  generateTestOrders(count: number = 15): TestOrder[] {
    const orders: TestOrder[] = [];
    const statuses: TestOrder['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const cities = ['תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'אשדוד', 'נתניה', 'רמת גן', 'פתח תקווה'];

    for (let i = 0; i < count; i++) {
      const productCount = Math.floor(Math.random() * 3) + 1;
      const products = [];
      let totalAmount = 0;

      for (let j = 0; j < productCount; j++) {
        const price = Math.floor(Math.random() * 2000) + 500;
        const quantity = Math.floor(Math.random() * 3) + 1;
        products.push({
          productId: this.generateId(),
          productName: `Product ${j + 1}`,
          quantity,
          price
        });
        totalAmount += price * quantity;
      }

      orders.push({
        id: this.generateId(),
        userId: this.generateId(),
        userEmail: `customer${i + 1}@test.com`,
        userName: `Customer ${i + 1}`,
        products,
        totalAmount,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: this.generateTimestamp(),
        updatedAt: this.generateTimestamp(),
        shippingAddress: {
          address: `רחוב ${Math.floor(Math.random() * 100) + 1}`,
          city: cities[Math.floor(Math.random() * cities.length)],
          country: 'ישראל',
          zipCode: `${Math.floor(Math.random() * 90000) + 10000}`
        }
      });
    }

    return orders;
  }

  generateTestCertifications(count: number = 12): TestCertification[] {
    const certifications: TestCertification[] = [];
    const statuses: TestCertification['status'][] = ['pending', 'approved', 'rejected'];
    const reviewers = ['admin@mitoderm.com', 'shiri@mitoderm.com', 'segev@futurixs.com'];

    for (let i = 0; i < count; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const submittedAt = this.generateTimestamp();
      const reviewedAt = status !== 'pending' ? this.generateTimestamp() : undefined;

      certifications.push({
        id: this.generateId(),
        userId: this.generateId(),
        userEmail: `applicant${i + 1}@test.com`,
        userName: `Applicant ${i + 1}`,
        status,
        submittedAt,
        reviewedAt,
        reviewerId: status !== 'pending' ? this.generateId() : undefined,
        reviewerName: status !== 'pending' ? reviewers[Math.floor(Math.random() * reviewers.length)] : undefined,
        documents: [
          '/documents/certification/cert1.pdf',
          '/documents/certification/cert2.pdf'
        ],
        notes: status !== 'pending' ? 'Certification reviewed and processed' : undefined
      });
    }

    return certifications;
  }

  generateTestMediaFiles(count: number = 20): TestMediaFile[] {
    const mediaFiles: TestMediaFile[] = [];
    const categories = ['products', 'gallery', 'education', 'team', 'beforeAfter'];
    const types: ('image' | 'video' | 'document')[] = ['image', 'video', 'document'];
    const fileNames = [
      'product1.jpg', 'product2.jpg', 'gallery1.jpg', 'gallery2.jpg',
      'education1.jpg', 'education2.jpg', 'team1.jpg', 'team2.jpg',
      'beforeAfter1.jpg', 'beforeAfter2.jpg', 'video1.mp4', 'video2.mp4',
      'document1.pdf', 'document2.pdf', 'certification1.pdf', 'certification2.pdf'
    ];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const fileName = fileNames[i] || `file${i + 1}.${type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'pdf'}`;

      mediaFiles.push({
        id: this.generateId(),
        name: fileName,
        url: `/media/${category}/${fileName}`,
        type,
        size: Math.floor(Math.random() * 10000000) + 1000000, // 1MB to 10MB
        uploadedAt: this.generateTimestamp(),
        uploadedBy: 'admin@mitoderm.com',
        category
      });
    }

    return mediaFiles;
  }

  generateTestStats() {
    return {
      totalUsers: 156,
      activeUsers: 142,
      totalProducts: 24,
      activeProducts: 22,
      totalOrders: 89,
      totalRevenue: 245000,
      totalCertifications: 34,
      pendingCertifications: 8,
      totalVideos: 12,
      totalImages: 156
    };
  }

  generateTestActivity(count: number = 20) {
    const activities = [];
    const actions = [
      'User registered',
      'Product created',
      'Order placed',
      'Certification submitted',
      'Media uploaded',
      'User logged in',
      'Product updated',
      'Order shipped',
      'Certification approved',
      'Media deleted'
    ];
    const types = ['user', 'product', 'order', 'certification', 'video', 'image'];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      activities.push({
        id: this.generateId(),
        type,
        action,
        message: `${action} by user ${Math.floor(Math.random() * 100) + 1}`,
        timestamp: this.generateTimestamp(),
        userId: this.generateId(),
        userName: `User ${Math.floor(Math.random() * 100) + 1}`,
        metadata: {
          ip: `192.168.1.${Math.floor(Math.random() * 255) + 1}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
    }

    return activities.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
  }

  // Utility methods for testing
  createMockFile(name: string, type: string, size: number = 1024 * 1024): File {
    const blob = new Blob(['mock file content'], { type });
    return new File([blob], name, { type });
  }

  async createTestImageFile(): Promise<File> {
    // Create a simple test image using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#667eea';
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px Arial';
      ctx.fillText('Test Image', 50, 100);
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], 'test-image.jpg', { type: 'image/jpeg' }));
        }
      }, 'image/jpeg');
    });
  }

  async createTestVideoFile(): Promise<File> {
    // Create a simple test video (mock)
    const blob = new Blob(['mock video content'], { type: 'video/mp4' });
    return new File([blob], 'test-video.mp4', { type: 'video/mp4' });
  }

  async createTestDocumentFile(): Promise<File> {
    // Create a simple test document (mock)
    const content = 'This is a test document content for testing purposes.';
    const blob = new Blob([content], { type: 'application/pdf' });
    return new File([blob], 'test-document.pdf', { type: 'application/pdf' });
  }

  // Validation helpers
  validateUser(user: TestUser): boolean {
    return !!(
      user.id &&
      user.email &&
      user.name &&
      user.role &&
      user.createdAt &&
      user.lastLogin &&
      typeof user.isActive === 'boolean'
    );
  }

  validateProduct(product: TestProduct): boolean {
    return !!(
      product.id &&
      product.name &&
      product.description &&
      typeof product.price === 'number' &&
      product.category &&
      typeof product.isActive === 'boolean' &&
      product.createdAt &&
      product.updatedAt &&
      Array.isArray(product.images) &&
      typeof product.stock === 'number' &&
      typeof product.featured === 'boolean'
    );
  }

  validateOrder(order: TestOrder): boolean {
    return !!(
      order.id &&
      order.userId &&
      order.userEmail &&
      order.userName &&
      Array.isArray(order.products) &&
      order.products.length > 0 &&
      typeof order.totalAmount === 'number' &&
      order.status &&
      order.createdAt &&
      order.updatedAt
    );
  }

  validateCertification(certification: TestCertification): boolean {
    return !!(
      certification.id &&
      certification.userId &&
      certification.userEmail &&
      certification.userName &&
      certification.status &&
      certification.submittedAt &&
      Array.isArray(certification.documents)
    );
  }

  validateMediaFile(mediaFile: TestMediaFile): boolean {
    return !!(
      mediaFile.id &&
      mediaFile.name &&
      mediaFile.url &&
      mediaFile.type &&
      typeof mediaFile.size === 'number' &&
      mediaFile.uploadedAt &&
      mediaFile.uploadedBy
    );
  }
}

export default new TestDataService(); 