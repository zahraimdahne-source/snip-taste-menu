import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { popupService } from '../../../services/popupService';
import { Popup } from '../../../types/popup';
import '../../styles/MobileAdmin.css';

const PopupManagement: React.FC = () => {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    type: 'promo' as Popup['type'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    frequency: 'once' as Popup['frequency'],
    targetAudience: 'all' as Popup['targetAudience'],
    isActive: true,
    priority: 1,
    ctaText: 'Commander maintenant',
    ctaAction: 'close' as Popup['ctaAction'],
    ctaLink: '',
    createdBy: 'admin',
  });

  useEffect(() => {
    loadPopups();
  }, []);

  const loadPopups = () => {
    const allPopups = popupService.getPopups();
    setPopups(allPopups);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPopup) {
      popupService.updatePopup(editingPopup.id, {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      });
    } else {
      popupService.addPopup({
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      });
    }

    setShowModal(false);
    setEditingPopup(null);
    resetForm();
    loadPopups();
  };

  const handleEdit = (popup: Popup) => {
    setEditingPopup(popup);
    setFormData({
      title: popup.title,
      description: popup.description || '',
      imageUrl: popup.imageUrl,
      type: popup.type,
      startDate: new Date(popup.startDate).toISOString().split('T')[0],
      endDate: new Date(popup.endDate).toISOString().split('T')[0],
      frequency: popup.frequency,
      targetAudience: popup.targetAudience,
      isActive: popup.isActive,
      priority: popup.priority,
      ctaText: popup.ctaText,
      ctaAction: popup.ctaAction,
      ctaLink: popup.ctaLink || '',
      createdBy: popup.createdBy,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this popup?')) {
      popupService.deletePopup(id);
      loadPopups();
    }
  };

  const handleDuplicate = (id: string) => {
    popupService.duplicatePopup(id);
    loadPopups();
  };

  const toggleActive = (id: string, isActive: boolean) => {
    popupService.updatePopup(id, { isActive: !isActive });
    loadPopups();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      type: 'promo',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      frequency: 'once',
      targetAudience: 'all',
      isActive: true,
      priority: 1,
      ctaText: 'Commander maintenant',
      ctaAction: 'close',
      ctaLink: '',
      createdBy: 'admin',
    });
  };

  const analytics = popupService.getAnalytics();

  return (
    <AdminLayout>
      <div className="popup-management" style={{ padding: '24px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
              Popup Management
            </h2>
            <p style={{ color: '#6b7280' }}>Create and manage promotional popups</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingPopup(null);
              setShowModal(true);
            }}
            className="btn-mobile"
            style={{
              background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <svg
              style={{ width: '20px', height: '20px' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Popup
          </button>
        </div>

        {/* Analytics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              Total Popups
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{analytics.total}</div>
          </div>
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Active</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
              {analytics.active}
            </div>
          </div>
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              Total Views
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{analytics.totalViews}</div>
          </div>
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
              Click Rate
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
              {analytics.avgClickRate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Popups List */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>All Popups</h3>

          {popups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
              <svg
                style={{ width: '64px', height: '64px', margin: '0 auto 16px', opacity: 0.5 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <p>No popups yet. Create your first one!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {popups.map((popup) => (
                <div
                  key={popup.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'start',
                  }}
                >
                  {/* Popup Preview */}
                  {popup.imageUrl && (
                    <img
                      src={popup.imageUrl}
                      alt={popup.title}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {/* Popup Info */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>{popup.title}</h4>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: popup.isActive ? '#d1fae5' : '#fee2e2',
                          color: popup.isActive ? '#065f46' : '#991b1b',
                        }}
                      >
                        {popup.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          background: '#e0e7ff',
                          color: '#3730a3',
                        }}
                      >
                        {popup.type}
                      </span>
                    </div>

                    {popup.description && (
                      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                        {popup.description}
                      </p>
                    )}

                    <div
                      style={{
                        fontSize: '13px',
                        color: '#9ca3af',
                        display: 'flex',
                        gap: '16px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span>
                        📅 {new Date(popup.startDate).toLocaleDateString()} -{' '}
                        {new Date(popup.endDate).toLocaleDateString()}
                      </span>
                      <span>👁️ {popup.viewCount} views</span>
                      <span>👆 {popup.clickCount} clicks</span>
                      <span>🔄 {popup.frequency}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => toggleActive(popup.id, popup.isActive)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        background: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                      title={popup.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {popup.isActive ? '⏸️' : '▶️'}
                    </button>
                    <button
                      onClick={() => handleEdit(popup)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        background: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDuplicate(popup.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        background: 'white',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                      title="Duplicate"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => handleDelete(popup.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #fee2e2',
                        background: '#fef2f2',
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '16px',
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '24px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>
                {editingPopup ? 'Edit Popup' : 'Create New Popup'}
              </h3>

              <form
                onSubmit={handleSubmit}
                className="form-mobile"
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g., Special Offer - 20% Off!"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Optional description"
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    required
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      style={{ marginTop: '8px', maxWidth: '200px', borderRadius: '8px' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as Popup['type'] })
                      }
                    >
                      <option value="promo">Promotional</option>
                      <option value="announcement">Announcement</option>
                      <option value="survey">Survey</option>
                      <option value="welcome">Welcome</option>
                      <option value="exit">Exit Intent</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Frequency
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          frequency: e.target.value as Popup['frequency'],
                        })
                      }
                    >
                      <option value="once">Once</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="always">Always</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    placeholder="e.g., Commander maintenant"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <label htmlFor="isActive" style={{ fontWeight: '500', cursor: 'pointer' }}>
                    Active (show this popup)
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingPopup(null);
                      resetForm();
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      background: 'white',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-mobile"
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                      color: 'white',
                      border: 'none',
                    }}
                  >
                    {editingPopup ? 'Update' : 'Create'} Popup
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PopupManagement;
