import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebaseConfig';

export interface MenuItem {
  id?: string;
  name: string;
  nameAr: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  available: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  order: number;
}

export interface Sauce {
  id: string;
  name: string;
  nameAr: string;
}

// Menu Items
export const getAllMenuItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'menuItems'));
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];
    return { success: true, data: items };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const getMenuItemsByCategory = async (category: string) => {
  try {
    const q = query(collection(db, 'menuItems'), where('category', '==', category));
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];
    return { success: true, data: items };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'menuItems'), {
      ...item,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateMenuItem = async (id: string, item: Partial<MenuItem>) => {
  try {
    const docRef = doc(db, 'menuItems', id);
    await updateDoc(docRef, {
      ...item,
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const deleteMenuItem = async (id: string, imageUrl?: string) => {
  try {
    // Delete the document
    await deleteDoc(doc(db, 'menuItems', id));

    // Delete the image from storage if it exists
    if (imageUrl && imageUrl.includes('firebase')) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Image Upload
export const uploadMenuItemImage = async (file: File, itemName: string) => {
  try {
    const timestamp = Date.now();
    const fileName = `menu-items/${itemName}-${timestamp}.${file.name.split('.').pop()}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return { success: true, url: downloadURL };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Categories
export const getAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categories = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
    return { success: true, data: categories.sort((a, b) => a.order - b.order) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Sauces
export const getAllSauces = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'sauces'));
    const sauces = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Sauce[];
    return { success: true, data: sauces };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
