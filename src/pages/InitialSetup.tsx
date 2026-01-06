import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../config/firebaseConfig';
import './InitialSetup.css';

const InitialSetup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('admin@sniptaste.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const navigate = useNavigate();

  const handleCreateAdmin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');
    setProgress('Creating admin user...');

    try {
      // Create admin user
      await createUserWithEmailAndPassword(auth, email, password);
      setProgress('✓ Admin user created successfully!');

      setTimeout(() => {
        setStep(2);
        setProgress('');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to create admin user');
      setLoading(false);
    }
  };

  const handlePopulateData = async () => {
    setLoading(true);
    setError('');
    setProgress('Populating database...');

    try {
      // Add categories
      setProgress('Adding categories...');
      const categories = [
        { id: 'tex-mex', name: 'TEX MEX', nameAr: 'تكس مكس', order: 1 },
        { id: 'jus', name: 'JUS', nameAr: 'عصير', order: 2 },
        { id: 'desserts', name: 'DESSERTS', nameAr: 'حلويات', order: 3 },
        { id: 'boissons', name: 'BOISSONS', nameAr: 'مشروبات', order: 4 },
        { id: 'salades', name: 'SALADES', nameAr: 'سلطات', order: 5 },
        { id: 'pizza', name: 'PIZZA', nameAr: 'بيتزا', order: 6 },
        { id: 'burger', name: 'BURGER', nameAr: 'برجر', order: 7 },
        { id: 'pasticcios', name: 'PASTICCIOS', nameAr: 'باستيشيو', order: 8 },
        { id: 'pates', name: 'PATES', nameAr: 'معكرونة', order: 9 },
        { id: 'panizzas', name: 'PANIZZAS', nameAr: 'بانيزا', order: 10 },
        { id: 'tacos', name: 'TACOS', nameAr: 'تاكوس', order: 11 },
        { id: 'sandwich', name: 'SANDWICH', nameAr: 'ساندويتش', order: 12 },
        { id: 'kabab', name: 'KABAB', nameAr: 'كباب', order: 13 },
        { id: 'plats', name: 'PLATS', nameAr: 'أطباق', order: 14 },
      ];

      for (const cat of categories) {
        await addDoc(collection(db, 'categories'), cat);
      }

      // Add sample menu items (you can expand this)
      setProgress('Adding menu items...');
      const sampleItems = [
        { name: 'Pizza Margherita', category: 'pizza', price: 20, priceSmall: 20, priceLarge: 30 },
        { name: 'Tacos Poulet', category: 'tacos', price: 30 },
        { name: 'Burger Cheese', category: 'burger', price: 30 },
      ];

      for (const item of sampleItems) {
        await addDoc(collection(db, 'menuItems'), {
          ...item,
          nameAr: item.name,
          image: '',
          description: '',
          available: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }

      // Add settings
      setProgress('Adding restaurant settings...');
      await addDoc(collection(db, 'settings'), {
        restaurantName: 'Snip Taste',
        phone: '+212 660 542 323',
        address: 'N 6, residence ennakhil, Bd Mohamed Zefzaf, Casablanca',
        whatsappNumber: '212660542323',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      setProgress('✓ Setup complete!');

      setTimeout(() => {
        // Mark setup as complete
        localStorage.setItem('sniptaste_setup_complete', 'true');
        navigate('/admin/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to populate data');
      setLoading(false);
    }
  };

  return (
    <div className="initial-setup">
      <div className="setup-container">
        <div className="setup-header">
          <h1>🎉 Welcome to Snip Taste Admin</h1>
          <p>Let's set up your admin account</p>
        </div>

        {step === 1 && (
          <div className="setup-step">
            <h2>Step 1: Create Admin Account</h2>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sniptaste.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a strong password"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            {progress && <div className="progress-message">{progress}</div>}
            <button onClick={handleCreateAdmin} disabled={loading} className="setup-button">
              {loading ? 'Creating...' : 'Create Admin Account'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="setup-step">
            <h2>Step 2: Populate Menu Data</h2>
            <p>Click below to add sample menu items and categories</p>
            {error && <div className="error-message">{error}</div>}
            {progress && <div className="progress-message">{progress}</div>}
            <button onClick={handlePopulateData} disabled={loading} className="setup-button">
              {loading ? 'Setting up...' : 'Populate Database'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InitialSetup;
