import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { getAllOrders, Order } from '../../../services/orderService';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebaseConfig';
import '../../styles/OrderManagement.css';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  const loadOrders = async () => {
    setLoading(true);
    const result = await getAllOrders();
    if (result.success && result.data) {
      setOrders(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrderStatus = async (
    orderId: string,
    status: 'pending' | 'completed' | 'cancelled'
  ) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      loadOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((order) => order.status === filter);

  return (
    <AdminLayout>
      <div className="order-management-container">
        <h2>Order Management</h2>

        <div className="order-filters">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            All ({orders.length})
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending ({orders.filter((o) => o.status === 'pending').length})
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed ({orders.filter((o) => o.status === 'completed').length})
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state flex flex-col items-center justify-center py-12 text-gray-400">
            <svg
              className="w-16 h-16 mb-4 text-gray-300"
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
            <p className="text-lg">No orders found</p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.id?.slice(0, 8)}</h3>
                    <p className="order-date">
                      {order.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div className="order-total">{order.total?.toFixed(2)} DH</div>
                </div>

                <div className="order-items">
                  <h4>Items:</h4>
                  <ul>
                    {order.items?.map((item: any, idx: number) => (
                      <li key={idx}>
                        {item.quantity}x {item.name} - {item.price} DH
                      </li>
                    ))}
                  </ul>
                </div>

                {order.customerInfo && (
                  <div className="order-customer">
                    <h4>Customer Info:</h4>
                    <p>{order.customerInfo.name}</p>
                    <p>{order.customerInfo.phone}</p>
                    {order.customerInfo.address && <p>{order.customerInfo.address}</p>}
                    {order.deliveryDistance && <p>Distance: {order.deliveryDistance}</p>}
                  </div>
                )}

                <div className="order-actions">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id!, e.target.value as any)}
                    className={`status-select status-${order.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrderManagement;
