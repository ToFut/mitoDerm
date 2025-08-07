import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/services/userService';
import { getProductStats } from '@/lib/services/productService';
import { orderService } from '@/lib/services/orderService';
import { eventService } from '@/lib/services/eventService';
import { educationService } from '@/lib/services/educationService';
import { certificationService } from '@/lib/services/certificationService';

export async function GET(request: NextRequest) {
  try {
    // Load all stats in parallel
    const [
      userStats,
      productStats,
      orderStats,
      eventStats,
      educationStats,
      certificationStats
    ] = await Promise.all([
      userService.getUserStats(),
      getProductStats(),
      orderService.getOrderStats(),
      eventService.getEventStats(),
      educationService.getEducationStats(),
      certificationService.getCertificationStats()
    ]);

    // Calculate additional metrics
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orderStats.recentOrders.filter(order => 
      order.orderDate.startsWith(today)
    );
    const ordersToday = todayOrders.length;
    const revenueToday = todayOrders.reduce((sum, order) => sum + order.total, 0);

    const dashboardStats = {
      // Users
      totalUsers: userStats.totalUsers,
      activeUsers: userStats.activeUsers,
      newUsersThisMonth: userStats.newUsersThisMonth,
      partnerUsers: userStats.usersByRole.partner || 0,
      certifiedUsers: 0, // This would need a separate query
      
      // Products
      totalProducts: productStats.total,
      activeProducts: productStats.active,
      lowStockProducts: productStats.lowStock,
      partnerOnlyProducts: 0, // This would need to be calculated in getProductStats
      
      // Orders
      totalOrders: orderStats.totalOrders,
      totalRevenue: orderStats.totalRevenue,
      ordersToday,
      revenueToday,
      pendingOrders: orderStats.ordersByStatus.pending || 0,
      
      // Events
      totalEvents: eventStats.totalEvents,
      upcomingEvents: eventStats.upcomingEvents,
      totalEventRevenue: eventStats.totalRevenue,
      totalEventRegistrations: eventStats.totalRegistrations,
      
      // Education
      totalCourses: educationStats.totalCourses,
      totalEnrollments: educationStats.totalEnrollments,
      totalCertificatesIssued: educationStats.totalCertificatesIssued,
      averageCompletionRate: educationStats.averageCompletionRate,
      
      // Certifications
      totalCertifications: certificationStats.totalRequests,
      pendingCertifications: certificationStats.pendingRequests,
      approvedCertifications: certificationStats.approvedRequests,
      
      // System (these would come from media service)
      totalVideos: 0,
      totalImages: 0
    };

    return NextResponse.json(dashboardStats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}