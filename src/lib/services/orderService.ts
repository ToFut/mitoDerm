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
import { Order, OrderItem, OrderStatus, PaymentStatus, Address, User } from '@/types';
import { userService } from './userService';

// Helper function to check if Firebase is initialized
const checkFirebase = () => {
  if (!db) {
    throw new Error('Firebase is not initialized');
  }
  return { db };
};

class OrderService {
  // Create new order
  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'updatedAt'>): Promise<string | null> {
    try {
      const { db } = checkFirebase();
      
      // Generate order number
      const orderNumber = `MTD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      const orderDoc = {
        ...orderData,
        orderNumber,
        orderDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderDoc);
      
      // Update user stats
      await userService.incrementUserStat(orderData.userId, 'totalOrders');
      await userService.incrementUserStat(orderData.userId, 'totalSpent', orderData.total);
      await userService.updateUserStats(orderData.userId, { 
        lastOrderDate: new Date().toISOString() 
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  // Get order by ID
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const { db } = checkFirebase();
      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (orderSnap.exists()) {
        return {
          id: orderSnap.id,
          ...orderSnap.data()
        } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }

  // Get orders by user
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const { db } = checkFirebase();
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('userId', '==', userId),
        orderBy('orderDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }

  // Get all orders (admin)
  async getAllOrders(): Promise<Order[]> {
    try {
      const { db } = checkFirebase();
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('orderDate', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error('Error getting all orders:', error);
      return [];
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus, notes?: string): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date().toISOString(),
        ...(notes && { notes })
      });
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  // Update payment status
  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus, paymentId?: string): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        paymentStatus,
        updatedAt: new Date().toISOString(),
        ...(paymentId && { paymentId })
      });
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return false;
    }
  }

  // Add tracking number
  async addTrackingNumber(orderId: string, trackingNumber: string): Promise<boolean> {
    try {
      const { db } = checkFirebase();
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        trackingNumber,
        status: 'shipped',
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error adding tracking number:', error);
      return false;
    }
  }

  // Get orders by status
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    try {
      const { db } = checkFirebase();
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef,
        where('status', '==', status),
        orderBy('orderDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error('Error getting orders by status:', error);
      return [];
    }
  }

  // Search orders
  async searchOrders(searchTerm: string): Promise<Order[]> {
    try {
      const { db } = checkFirebase();
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('orderDate', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      // Client-side search
      return orders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } catch (error) {
      console.error('Error searching orders:', error);
      return [];
    }
  }

  // Get order statistics
  async getOrderStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Record<OrderStatus, number>;
    recentOrders: Order[];
    topProducts: { productId: string; productName: string; quantity: number; revenue: number }[];
  }> {
    try {
      const orders = await this.getAllOrders();
      
      const stats = {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
        averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
        ordersByStatus: {} as Record<OrderStatus, number>,
        recentOrders: orders.slice(0, 10),
        topProducts: [] as { productId: string; productName: string; quantity: number; revenue: number }[]
      };

      // Count orders by status
      const statusCounts: Record<string, number> = {};
      orders.forEach(order => {
        statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      });
      stats.ordersByStatus = statusCounts as Record<OrderStatus, number>;

      // Calculate top products
      const productStats: Record<string, { name: string; quantity: number; revenue: number }> = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          if (!productStats[item.productId]) {
            productStats[item.productId] = {
              name: item.productName,
              quantity: 0,
              revenue: 0
            };
          }
          productStats[item.productId].quantity += item.quantity;
          productStats[item.productId].revenue += item.totalPrice;
        });
      });

      stats.topProducts = Object.entries(productStats)
        .map(([productId, data]) => ({
          productId,
          productName: data.name,
          quantity: data.quantity,
          revenue: data.revenue
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);

      return stats;
    } catch (error) {
      console.error('Error getting order stats:', error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        ordersByStatus: {} as Record<OrderStatus, number>,
        recentOrders: [],
        topProducts: []
      };
    }
  }

  // Real-time orders listener
  subscribeToOrders(
    callback: (orders: Order[]) => void,
    filters?: {
      userId?: string;
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
    }
  ): () => void {
    try {
      const { db } = checkFirebase();
      const ordersRef = collection(db, 'orders');
      let q = query(ordersRef, orderBy('orderDate', 'desc'));

      // Apply filters
      if (filters?.userId) {
        q = query(q, where('userId', '==', filters.userId));
      }
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.paymentStatus) {
        q = query(q, where('paymentStatus', '==', filters.paymentStatus));
      }

      return onSnapshot(q, (querySnapshot) => {
        const orders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        callback(orders);
      });
    } catch (error) {
      console.error('Error setting up orders listener:', error);
      return () => {};
    }
  }

  // Calculate shipping cost
  calculateShipping(items: OrderItem[], address: Address): number {
    const totalWeight = items.reduce((weight, item) => weight + (item.quantity * 0.5), 0); // Assume 0.5kg per item
    const baseShipping = 15;
    const weightCharge = Math.max(0, (totalWeight - 1) * 5); // $5 per kg over 1kg
    
    // International shipping
    if (address.country !== 'IL') {
      return baseShipping + weightCharge + 25;
    }
    
    return baseShipping + weightCharge;
  }

  // Calculate tax
  calculateTax(subtotal: number, address: Address): number {
    // Israeli VAT is 17%
    if (address.country === 'IL') {
      return subtotal * 0.17;
    }
    
    // Default tax rate for other countries
    return subtotal * 0.1;
  }

  // Validate order before creation
  validateOrder(orderData: Partial<Order>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!orderData.userId) {
      errors.push('User ID is required');
    }

    if (!orderData.items || orderData.items.length === 0) {
      errors.push('Order must contain at least one item');
    }

    if (!orderData.shippingAddress) {
      errors.push('Shipping address is required');
    } else {
      const addr = orderData.shippingAddress;
      if (!addr.firstName || !addr.lastName || !addr.address1 || !addr.city || !addr.zipCode) {
        errors.push('Complete shipping address is required');
      }
    }

    if (!orderData.total || orderData.total <= 0) {
      errors.push('Order total must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const orderService = new OrderService();

// Helper functions
export const getOrderStatusColor = (status: OrderStatus): string => {
  const colors = {
    pending: '#f59e0b',
    confirmed: '#3b82f6', 
    processing: '#8b5cf6',
    shipped: '#06b6d4',
    delivered: '#10b981',
    cancelled: '#ef4444',
    refunded: '#6b7280'
  };
  return colors[status] || '#6b7280';
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
  const colors = {
    pending: '#f59e0b',
    paid: '#10b981',
    failed: '#ef4444',
    refunded: '#6b7280',
    partially_refunded: '#f97316'
  };
  return colors[status] || '#6b7280';
};

export const formatOrderNumber = (orderNumber: string): string => {
  return orderNumber.replace('MTD-', 'MTD #');
};

export const getEstimatedDelivery = (orderDate: string, shippingMethod: string = 'standard'): string => {
  const order = new Date(orderDate);
  const deliveryDays = shippingMethod === 'express' ? 2 : 5;
  const delivery = new Date(order.getTime() + (deliveryDays * 24 * 60 * 60 * 1000));
  return delivery.toISOString();
};