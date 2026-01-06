import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { getAllOrders } from '../../../services/orderService';
import { getAllMenuItems } from '../../../services/menuService';
import '../../styles/Analytics.css';

const Analytics: React.FC = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    popularItems: [] as { name: string; count: number }[],
  });

  const loadAnalytics = async () => {
    const ordersResult = await getAllOrders();
    const itemsResult = await getAllMenuItems();

    if (ordersResult.success && ordersResult.data) {
      const orders = ordersResult.data;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate popular items
      const itemCounts: { [key: string]: number } = {};
      orders.forEach((order) => {
        order.items?.forEach((item: any) => {
          itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
      });

      const popularItems = Object.entries(itemCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setStats({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        popularItems,
      });
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <AdminLayout>
      <div className="analytics-container">
        <h2>Analytics & Reports</h2>

        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="card-icon bg-green-100 text-green-600 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="card-content">
              <h3>Total Revenue</h3>
              <p className="card-value">{stats.totalRevenue.toFixed(2)} DH</p>
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon bg-blue-100 text-blue-600 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="card-content">
              <h3>Total Orders</h3>
              <p className="card-value">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="analytics-card">
            <div className="card-icon bg-purple-100 text-purple-600 p-3 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="card-content">
              <h3>Average Order Value</h3>
              <p className="card-value">{stats.averageOrderValue.toFixed(2)} DH</p>
            </div>
          </div>
        </div>

        <div className="popular-items-section">
          <h3>Top 10 Popular Items</h3>
          {stats.popularItems.length === 0 ? (
            <div className="empty-state flex flex-col items-center justify-center py-8 text-gray-400">
              <svg
                className="w-12 h-12 mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p>No order data yet</p>
            </div>
          ) : (
            <div className="popular-items-list">
              {stats.popularItems.map((item, index) => (
                <div key={index} className="popular-item">
                  <div className="item-rank">#{index + 1}</div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-count">{item.count} orders</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
