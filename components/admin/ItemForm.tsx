import React, { useState, useEffect } from 'react';
import {
  addMenuItem,
  updateMenuItem,
  uploadMenuItemImage,
  MenuItem,
} from '../../services/menuService';
import '../../styles/ItemForm.css';

interface ItemFormProps {
  item: MenuItem | null;
  onClose: (success: boolean) => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ item, onClose }) => {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    nameAr: '',
    price: 0,
    category: '',
    image: '',
    description: '',
    available: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData(item);
      if (item.image) {
        setImagePreview(item.image);
      }
    }
  }, [item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? parseFloat(value)
          : type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let imageUrl = formData.image || '';

      // Upload image if a new one was selected
      if (imageFile) {
        const uploadResult = await uploadMenuItemImage(imageFile, formData.name || 'item');
        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
        } else {
          throw new Error(uploadResult.error || 'Failed to upload image');
        }
      }

      const itemData = {
        ...formData,
        image: imageUrl,
      } as Omit<MenuItem, 'id'>;

      let result;
      if (item?.id) {
        result = await updateMenuItem(item.id, itemData);
      } else {
        result = await addMenuItem(itemData);
      }

      if (result.success) {
        onClose(true);
      } else {
        setError(result.error || 'Failed to save item');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{item ? 'Edit Menu Item' : 'Add New Menu Item'}</h2>
          <button className="close-btn" onClick={() => onClose(false)}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="item-form">
          {error && <div className="error-message">⚠️ {error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Item Name (English) *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="nameAr">Item Name (Arabic) *</label>
              <input
                type="text"
                id="nameAr"
                name="nameAr"
                value={formData.nameAr}
                onChange={handleChange}
                required
                disabled={loading}
                dir="rtl"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (DH) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select category</option>
                <option value="tex-mex">TEX MEX</option>
                <option value="jus">JUS</option>
                <option value="desserts">DESSERTS</option>
                <option value="boissons">BOISSONS</option>
                <option value="salades">SALADES</option>
                <option value="pizza">PIZZA</option>
                <option value="burger">BURGER</option>
                <option value="pasticcios">PASTICCIOS</option>
                <option value="pates">PATES</option>
                <option value="panizzas">PANIZZAS</option>
                <option value="tacos">TACOS</option>
                <option value="sandwich">SANDWICH</option>
                <option value="kabab">KABAB</option>
                <option value="plats">PLATS</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Item Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Item is available</span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => onClose(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Saving...' : item ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
