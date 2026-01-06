import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebaseConfig';
import '../../styles/Settings.css';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    restaurantName: 'Snip Taste',
    phone: '',
    address: '',
    whatsappNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'settings'));
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setSettings({
          restaurantName: data.restaurantInfo?.name || 'Snip Taste',
          phone: data.restaurantInfo?.phone || '',
          address: data.restaurantInfo?.address || '',
          whatsappNumber: data.restaurantInfo?.whatsappNumber || '',
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const querySnapshot = await getDocs(collection(db, 'settings'));
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(db, 'settings', docId), {
          'restaurantInfo.name': settings.restaurantName,
          'restaurantInfo.phone': settings.phone,
          'restaurantInfo.address': settings.address,
          'restaurantInfo.whatsappNumber': settings.whatsappNumber,
        });
        setMessage('✓ Settings saved successfully!');
      }
    } catch (error) {
      setMessage('✗ Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="settings-container">
        <h2>Restaurant Settings</h2>

        <form onSubmit={handleSubmit} className="settings-form">
          {message && (
            <div className={`message ${message.includes('✓') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="restaurantName">Restaurant Name</label>
            <input
              type="text"
              id="restaurantName"
              value={settings.restaurantName}
              onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="+212 XXX-XXXXXX"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatsappNumber">WhatsApp Number (for orders)</label>
            <input
              type="tel"
              id="whatsappNumber"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              placeholder="212XXXXXXXXX"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Settings;
