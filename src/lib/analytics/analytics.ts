// Advanced Analytics and User Behavior Tracking System
// Enhanced with AI-powered insights and real-time processing

interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
  anonymousId: string;
  page: {
    url: string;
    title: string;
    referrer: string;
    path: string;
  };
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: string;
    browser: string;
    viewport: {
      width: number;
      height: number;
    };
  };
  location?: {
    country?: string;
    city?: string;
    timezone: string;
  };
}

interface UserBehaviorData {
  scrollDepth: number;
  timeOnPage: number;
  clicksCount: number;
  formInteractions: number;
  searchQueries: string[];
  productViews: string[];
  cartActions: string[];
  heatmapData: Array<{
    x: number;
    y: number;
    type: 'click' | 'hover' | 'scroll';
    timestamp: number;
  }>;
}

interface AIInsight {
  type: 'user_segment' | 'behavior_pattern' | 'conversion_prediction' | 'churn_risk' | 'product_affinity';
  confidence: number;
  insight: string;
  recommendations: string[];
  data: Record<string, any>;
}

class AdvancedAnalytics {
  private sessionId: string;
  private anonymousId: string;
  private userId?: string;
  private queue: AnalyticsEvent[] = [];
  private behaviorData: UserBehaviorData;
  private isOnline: boolean = true;
  private batchSize: number = 10;
  private flushInterval: number = 30000; // 30 seconds
  private maxRetries: number = 3;
  private retryDelay: number = 1000;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.anonymousId = this.getOrCreateAnonymousId();
    this.behaviorData = this.initializeBehaviorData();
    
    this.setupEventListeners();
    this.startPeriodicFlush();
    this.loadUserPreferences();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getOrCreateAnonymousId(): string {
    let anonymousId = localStorage.getItem('mitoderm_anonymous_id');
    if (!anonymousId) {
      anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('mitoderm_anonymous_id', anonymousId);
    }
    return anonymousId;
  }

  private initializeBehaviorData(): UserBehaviorData {
    return {
      scrollDepth: 0,
      timeOnPage: Date.now(),
      clicksCount: 0,
      formInteractions: 0,
      searchQueries: [],
      productViews: [],
      cartActions: [],
      heatmapData: []
    };
  }

  private setupEventListeners(): void {
    // Page visibility for accurate time tracking
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_blur', { timestamp: Date.now() });
      } else {
        this.track('page_focus', { timestamp: Date.now() });
      }
    });

    // Scroll depth tracking
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        this.behaviorData.scrollDepth = scrollDepth;
        
        // Track milestone scroll depths
        if (scrollDepth >= 25 && scrollDepth < 50 && maxScrollDepth < 25) {
          this.track('scroll_milestone', { depth: 25 });
        } else if (scrollDepth >= 50 && scrollDepth < 75 && maxScrollDepth < 50) {
          this.track('scroll_milestone', { depth: 50 });
        } else if (scrollDepth >= 75 && scrollDepth < 100 && maxScrollDepth < 75) {
          this.track('scroll_milestone', { depth: 75 });
        } else if (scrollDepth === 100 && maxScrollDepth < 100) {
          this.track('scroll_milestone', { depth: 100 });
        }
      }
    });

    // Click tracking with heatmap data
    document.addEventListener('click', (event) => {
      this.behaviorData.clicksCount++;
      
      // Record heatmap data
      this.behaviorData.heatmapData.push({
        x: event.clientX,
        y: event.clientY,
        type: 'click',
        timestamp: Date.now()
      });

      // Track specific element clicks
      const target = event.target as HTMLElement;
      const elementData = {
        tagName: target.tagName,
        className: target.className,
        id: target.id,
        text: target.textContent?.slice(0, 100),
        coordinates: { x: event.clientX, y: event.clientY }
      };

      this.track('click', elementData);
    });

    // Form interaction tracking
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        this.behaviorData.formInteractions++;
        
        this.track('form_interaction', {
          fieldName: target.name || target.id,
          fieldType: target.type,
          formId: target.form?.id,
          valueLength: target.value.length
        });
      }
    });

    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flush(); // Send queued events when back online
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Page unload - send final data
    window.addEventListener('beforeunload', () => {
      this.track('page_unload', {
        timeOnPage: Date.now() - this.behaviorData.timeOnPage,
        scrollDepth: this.behaviorData.scrollDepth,
        clicksCount: this.behaviorData.clicksCount,
        formInteractions: this.behaviorData.formInteractions
      });
      
      // Send beacon for final data
      this.sendBeacon();
    });
  }

  // Public API methods
  public identify(userId: string, traits?: Record<string, any>): void {
    this.userId = userId;
    localStorage.setItem('mitoderm_user_id', userId);
    
    this.track('user_identified', {
      userId,
      traits,
      previousAnonymousId: this.anonymousId
    });
  }

  public track(event: string, properties: Record<string, any> = {}): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        // Add automatic properties
        sessionDuration: Date.now() - this.behaviorData.timeOnPage,
        scrollDepth: this.behaviorData.scrollDepth,
        clicksCount: this.behaviorData.clicksCount,
        isNewUser: !localStorage.getItem('mitoderm_returning_user'),
        userAgent: navigator.userAgent
      },
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      anonymousId: this.anonymousId,
      page: this.getPageInfo(),
      device: this.getDeviceInfo(),
      location: this.getLocationInfo()
    };

    this.queue.push(analyticsEvent);

    // Flush immediately for critical events
    if (this.isCriticalEvent(event)) {
      this.flush();
    }

    // Auto-flush when queue reaches batch size
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  public page(name?: string, properties: Record<string, any> = {}): void {
    // Reset behavior data for new page
    this.behaviorData = this.initializeBehaviorData();
    
    this.track('page_view', {
      name: name || document.title,
      ...properties,
      referrer: document.referrer,
      userAgent: navigator.userAgent
    });

    // Mark as returning user
    localStorage.setItem('mitoderm_returning_user', 'true');
  }

  public ecommerce(action: string, products: any[], properties: Record<string, any> = {}): void {
    this.track(`ecommerce_${action}`, {
      products,
      ...properties,
      revenue: products.reduce((sum, p) => sum + (p.price * p.quantity || 1), 0),
      productCount: products.length,
      categories: [...new Set(products.map(p => p.category))],
      brands: [...new Set(products.map(p => p.brand))]
    });
  }

  public search(query: string, results?: any[], properties: Record<string, any> = {}): void {
    this.behaviorData.searchQueries.push(query);
    
    this.track('search', {
      query,
      resultsCount: results?.length || 0,
      hasResults: (results?.length || 0) > 0,
      ...properties
    });
  }

  public productView(product: any, properties: Record<string, any> = {}): void {
    this.behaviorData.productViews.push(product.id);
    
    this.track('product_view', {
      productId: product.id,
      productName: product.name,
      productCategory: product.category,
      productPrice: product.price,
      productBrand: product.brand,
      ...properties
    });
  }

  public experimentView(experimentId: string, variant: string, properties: Record<string, any> = {}): void {
    this.track('experiment_view', {
      experimentId,
      variant,
      ...properties
    });
  }

  // AI-powered insights
  public async getAIInsights(userId?: string): Promise<AIInsight[]> {
    try {
      const response = await fetch('/api/analytics/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || this.userId,
          anonymousId: this.anonymousId,
          behaviorData: this.behaviorData,
          sessionData: this.queue
        })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to fetch AI insights:', error);
    }

    return [];
  }

  // User segmentation
  public async getUserSegment(): Promise<string | null> {
    try {
      const response = await fetch('/api/analytics/user-segment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.userId,
          anonymousId: this.anonymousId,
          behaviorData: this.behaviorData
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.segment;
      }
    } catch (error) {
      console.warn('Failed to get user segment:', error);
    }

    return null;
  }

  // Personalization data
  public async getPersonalizationData(): Promise<Record<string, any>> {
    try {
      const response = await fetch('/api/analytics/personalization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.userId,
          anonymousId: this.anonymousId,
          searchQueries: this.behaviorData.searchQueries,
          productViews: this.behaviorData.productViews
        })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to get personalization data:', error);
    }

    return {};
  }

  // Private helper methods
  private getPageInfo() {
    return {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      path: window.location.pathname
    };
  }

  private getDeviceInfo() {
    const width = window.innerWidth;
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    
    if (width < 768) deviceType = 'mobile';
    else if (width < 1024) deviceType = 'tablet';

    return {
      type: deviceType,
      os: this.getOS(),
      browser: this.getBrowser(),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  private getLocationInfo() {
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  private getOS(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getBrowser(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private isCriticalEvent(event: string): boolean {
    const criticalEvents = [
      'purchase',
      'add_to_cart',
      'user_identified',
      'form_submit',
      'error',
      'experiment_view'
    ];
    return criticalEvents.includes(event);
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    if (!this.isOnline) {
      // Store in localStorage for offline sync
      const offlineEvents = JSON.parse(localStorage.getItem('mitoderm_offline_analytics') || '[]');
      offlineEvents.push(...events);
      localStorage.setItem('mitoderm_offline_analytics', JSON.stringify(offlineEvents));
      return;
    }

    await this.sendEvents(events);
  }

  private async sendEvents(events: AnalyticsEvent[], attempt: number = 1): Promise<void> {
    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      console.log(`[Analytics] Sent ${events.length} events successfully`);
    } catch (error) {
      console.warn(`[Analytics] Failed to send events (attempt ${attempt}):`, error);
      
      if (attempt < this.maxRetries) {
        setTimeout(() => {
          this.sendEvents(events, attempt + 1);
        }, this.retryDelay * attempt);
      } else {
        // Store failed events for later retry
        const failedEvents = JSON.parse(localStorage.getItem('mitoderm_failed_analytics') || '[]');
        failedEvents.push(...events);
        localStorage.setItem('mitoderm_failed_analytics', JSON.stringify(failedEvents));
      }
    }
  }

  private sendBeacon(): void {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify({ events })], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track', blob);
    }
  }

  private startPeriodicFlush(): void {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private loadUserPreferences(): void {
    const userId = localStorage.getItem('mitoderm_user_id');
    if (userId) {
      this.userId = userId;
    }

    // Load and retry failed events
    const failedEvents = JSON.parse(localStorage.getItem('mitoderm_failed_analytics') || '[]');
    if (failedEvents.length > 0 && this.isOnline) {
      this.sendEvents(failedEvents);
      localStorage.removeItem('mitoderm_failed_analytics');
    }

    // Load and retry offline events
    const offlineEvents = JSON.parse(localStorage.getItem('mitoderm_offline_analytics') || '[]');
    if (offlineEvents.length > 0 && this.isOnline) {
      this.sendEvents(offlineEvents);
      localStorage.removeItem('mitoderm_offline_analytics');
    }
  }
}

// Create singleton instance
const analytics = new AdvancedAnalytics();

// Export for use throughout the application
export default analytics;