import { collection, addDoc, getDocs, query, orderBy, Timestamp, where } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export interface Order {
  id?: string;
  items: any[];
  total: number;
  customerInfo: {
    name?: string;
    phone?: string;
    address?: string;
    location?: {
      lat: number;
      lng: number;
      googleMapsLink: string;
    };
  };
  deliveryDistance?: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt?: any;
}

export const saveOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getAllOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
    return { success: true, data: orders };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getOrdersByStatus = async (status: string) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
    return { success: true, data: orders };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
