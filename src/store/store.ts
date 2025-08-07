import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  ModalType, 
  DiscountModifier, 
  User, 
  Cart, 
  CartItem, 
  Product,
  Event,
  Course,
  Order
} from '@/types';

interface AppState {
  // UI State
  modalIsOpen: boolean;
  toggleModal: (value: boolean) => void;
  isScrolled: boolean;
  setIsScrolled: (value: boolean) => void;
  galleryPage: number;
  setGalleryPage: (page: number) => void;
  introPage: number;
  setIntroPage: (page: number) => void;
  reviewPage: number;
  setReviewPage: (page: number) => void;
  modalContent: ModalType;
  setModalContent: (arg: ModalType) => void;
  
  // Event State
  numberOfTickets: number;
  setNumberOfTickets: (arg: number) => void;
  discountModifier: DiscountModifier;
  setDiscountModifier: (arg: DiscountModifier) => void;
  
  // Authentication State
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  
  // Cart State
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: (code: string) => void;
  
  // Wishlist State
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  
  // Recently Viewed
  recentlyViewed: string[];
  addToRecentlyViewed: (productId: string) => void;
  
  // Search State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

interface SearchFilters {
  category?: string;
  priceRange?: [number, number];
  brand?: string;
  certification?: boolean;
  availability?: 'in_stock' | 'all';
  sortBy?: 'name' | 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actions?: NotificationAction[];
}

interface NotificationAction {
  label: string;
  action: () => void;
}

const initialCart: Cart = {
  items: [],
  subtotal: 0,
  total: 0,
  itemCount: 0,
  appliedCoupons: [],
  estimatedTax: 0,
  estimatedShipping: 0
};

const calculateCartTotals = (items: CartItem[], products: Product[]): Partial<Cart> => {
  const subtotal = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return sum;
    return sum + (product.price * item.quantity);
  }, 0);
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedTax = subtotal * 0.1; // 10% tax rate
  const estimatedShipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const total = subtotal + estimatedTax + estimatedShipping;
  
  return {
    subtotal,
    total,
    itemCount,
    estimatedTax,
    estimatedShipping
  };
};

const useAppStore = create<AppState>()(persist(
  (set, get) => ({
    // UI State
    modalIsOpen: false,
    toggleModal: (value) => set({ modalIsOpen: value }),
    isScrolled: false,
    setIsScrolled: (value) => set({ isScrolled: value }),
    galleryPage: 0,
    setGalleryPage: (page) => set({ galleryPage: page }),
    introPage: 0,
    setIntroPage: (page) => set({ introPage: page }),
    reviewPage: 0,
    setReviewPage: (page) => set({ reviewPage: page }),
    modalContent: 'privatePolicy',
    setModalContent: (content) => set({ modalContent: content }),
    
    // Event State
    numberOfTickets: 1,
    setNumberOfTickets: (number) => set({ numberOfTickets: number }),
    discountModifier: 1,
    setDiscountModifier: (modifier) => set({ discountModifier: modifier }),
    
    // Authentication State
    user: null,
    setUser: (user) => set({ user }),
    isAuthenticated: false,
    setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    
    // Cart State
    cart: initialCart,
    addToCart: (product, quantity) => {
      const state = get();
      const existingItem = state.cart.items.find(item => item.productId === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.cart.items.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.cart.items, { productId: product.id, quantity }];
      }
      
      const totals = calculateCartTotals(newItems, [product]);
      set({ 
        cart: { 
          ...state.cart, 
          items: newItems,
          ...totals
        }
      });
    },
    
    removeFromCart: (productId) => {
      const state = get();
      const newItems = state.cart.items.filter(item => item.productId !== productId);
      const totals = calculateCartTotals(newItems, []);
      set({ 
        cart: { 
          ...state.cart, 
          items: newItems,
          ...totals
        }
      });
    },
    
    updateCartQuantity: (productId, quantity) => {
      const state = get();
      if (quantity <= 0) {
        get().removeFromCart(productId);
        return;
      }
      
      const newItems = state.cart.items.map(item => 
        item.productId === productId 
          ? { ...item, quantity }
          : item
      );
      const totals = calculateCartTotals(newItems, []);
      set({ 
        cart: { 
          ...state.cart, 
          items: newItems,
          ...totals
        }
      });
    },
    
    clearCart: () => set({ cart: initialCart }),
    
    applyCoupon: (code) => {
      const state = get();
      if (!state.cart.appliedCoupons.includes(code)) {
        set({ 
          cart: { 
            ...state.cart, 
            appliedCoupons: [...state.cart.appliedCoupons, code]
          }
        });
      }
    },
    
    removeCoupon: (code) => {
      const state = get();
      set({ 
        cart: { 
          ...state.cart, 
          appliedCoupons: state.cart.appliedCoupons.filter(c => c !== code)
        }
      });
    },
    
    // Wishlist State
    wishlist: [],
    addToWishlist: (productId) => {
      const state = get();
      if (!state.wishlist.includes(productId)) {
        set({ wishlist: [...state.wishlist, productId] });
      }
    },
    removeFromWishlist: (productId) => {
      const state = get();
      set({ wishlist: state.wishlist.filter(id => id !== productId) });
    },
    clearWishlist: () => set({ wishlist: [] }),
    
    // Recently Viewed
    recentlyViewed: [],
    addToRecentlyViewed: (productId) => {
      const state = get();
      const filtered = state.recentlyViewed.filter(id => id !== productId);
      const newList = [productId, ...filtered].slice(0, 10); // Keep last 10
      set({ recentlyViewed: newList });
    },
    
    // Search State
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    searchFilters: {},
    setSearchFilters: (filters) => set({ searchFilters: filters }),
    
    // Notifications
    notifications: [],
    addNotification: (notification) => {
      const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newNotification: Notification = {
        ...notification,
        id,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      const state = get();
      set({ notifications: [newNotification, ...state.notifications] });
      
      // Auto-remove success notifications after 5 seconds
      if (notification.type === 'success') {
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      }
    },
    
    removeNotification: (id) => {
      const state = get();
      set({ notifications: state.notifications.filter(n => n.id !== id) });
    },
    
    markNotificationAsRead: (id) => {
      const state = get();
      set({ 
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        )
      });
    },
    
    clearNotifications: () => set({ notifications: [] })
  }),
  {
    name: 'mitoderm-app-store',
    partialize: (state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      cart: state.cart,
      wishlist: state.wishlist,
      recentlyViewed: state.recentlyViewed,
      searchFilters: state.searchFilters
    })
  }
));

// Separate auth selectors to avoid object creation on every render
export const useUser = () => useAppStore(state => state.user);
export const useIsAuthenticated = () => useAppStore(state => state.isAuthenticated);
export const useSetUser = () => useAppStore(state => state.setUser);
export const useSetIsAuthenticated = () => useAppStore(state => state.setIsAuthenticated);

// Separate cart selectors to avoid object creation on every render
export const useCart = () => useAppStore(state => state.cart);
export const useAddToCart = () => useAppStore(state => state.addToCart);
export const useRemoveFromCart = () => useAppStore(state => state.removeFromCart);
export const useUpdateCartQuantity = () => useAppStore(state => state.updateCartQuantity);
export const useClearCart = () => useAppStore(state => state.clearCart);
export const useApplyCoupon = () => useAppStore(state => state.applyCoupon);
export const useRemoveCoupon = () => useAppStore(state => state.removeCoupon);

// Separate wishlist selectors to avoid object creation on every render
export const useWishlist = () => useAppStore(state => state.wishlist);
export const useAddToWishlist = () => useAppStore(state => state.addToWishlist);
export const useRemoveFromWishlist = () => useAppStore(state => state.removeFromWishlist);
export const useClearWishlist = () => useAppStore(state => state.clearWishlist);

// Separate search selectors to avoid object creation on every render
export const useSearchQuery = () => useAppStore(state => state.searchQuery);
export const useSetSearchQuery = () => useAppStore(state => state.setSearchQuery);
export const useSearchFilters = () => useAppStore(state => state.searchFilters);
export const useSetSearchFilters = () => useAppStore(state => state.setSearchFilters);

// Separate notification selectors to avoid object creation on every render
export const useNotifications = () => useAppStore(state => state.notifications);
export const useAddNotification = () => useAppStore(state => state.addNotification);
export const useRemoveNotification = () => useAppStore(state => state.removeNotification);
export const useMarkNotificationAsRead = () => useAppStore(state => state.markNotificationAsRead);
export const useClearNotifications = () => useAppStore(state => state.clearNotifications);
// useUnreadCount removed - using useMemo in components instead to avoid selector instability

export default useAppStore;