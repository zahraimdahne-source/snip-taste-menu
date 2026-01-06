import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { localDB, Category, MenuItem } from '../../../services/localDatabase';
import MenuTitle from '../../../components/MenuTitle';
import '../../styles/MenuManagement.css';

// Admin view needs full access to data including IDs
interface AdminMenuSection extends Category {
  title: string; // Alias for name to match view components if used
  items: MenuItem[];
}

const MenuManagement: React.FC = () => {
  const [sections, setSections] = useState<AdminMenuSection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Item Modal State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [preSelectedCategoryId, setPreSelectedCategoryId] = useState<string>('');

  // Category Modal State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Load Data
  const loadMenuData = () => {
    const cats = localDB.getCategories();
    const allItems = localDB.getMenuItems();

    // Sort categories (by order or anything, usually they have 'order' prop)
    cats.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Map to sections
    const adminSections: AdminMenuSection[] = cats.map((cat) => ({
      ...cat,
      title: cat.name,
      items: allItems.filter((item) => item.category === cat.id),
    }));

    setSections(adminSections);
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  // Filter Logic
  const getFilteredSections = () => {
    return sections
      .map((section) => {
        if (selectedCategory !== 'all' && section.id !== selectedCategory) {
          return null;
        }

        const filteredItems = section.items.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Show section if it matches search OR if search is empty (show all sections even empty ones)
        if (filteredItems.length === 0 && (searchTerm || selectedCategory !== 'all')) {
          // If searching for "Pizza", show only sections with Pizza.
          // If selecting "Drinks", show only Drinks section.
          return null;
        }

        return { ...section, items: filteredItems };
      })
      .filter(Boolean) as AdminMenuSection[];
  };

  const filteredSections = getFilteredSections();
  const categories = localDB.getCategories();

  // Handlers
  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      localDB.deleteMenuItem(id);
      loadMenuData();
    }
  };

  const handleToggleAvailability = (id: string, available: boolean) => {
    localDB.updateMenuItem(id, { available: !available });
    loadMenuData();
  };

  return (
    <AdminLayout>
      <div className="menu-management-container min-h-screen pb-12">
        {/* Background Pattern */}
        <div className="fixed inset-0 z-[-1] bg-wood-pattern"></div>

        <div className="page-header mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-snip-black">Menu Management</h1>
            <p className="text-gray-500">Customize your menu structure and items</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsAddingCategory(true)}
              className="bg-white text-snip-black border border-snip-black px-6 py-3 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>{' '}
              Add Category
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setPreSelectedCategoryId('');
                setIsAddingItem(true);
              }}
              className="bg-snip-orange text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-snip-black transition-colors flex items-center gap-2 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>{' '}
              Add New Item
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar bg-white/80 backdrop-blur rounded-xl p-4 shadow-sm border border-gray-200 mb-10 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-snip-orange/50 transition-all font-body"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-snip-orange/50 font-body cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Menu Sections Grid */}
        <div className="menu-masonry-grid columns-1 md:columns-2 gap-8 space-y-8">
          {filteredSections.map((section) => (
            <div key={section.id} className="menu-section-wrapper mb-8 break-inside-avoid">
              {/* Section Header with Edit */}
              <div className="flex justify-center items-center gap-2 mb-6 group/title relative">
                {/* Edit Button for Category */}
                <button
                  onClick={() => {
                    // Find original category object to edit
                    const originalCat = categories.find((c) => c.id === section.id);
                    if (originalCat) setEditingCategory(originalCat);
                  }}
                  className="absolute -left-10 p-2 text-gray-400 hover:text-snip-orange opacity-0 group-hover/title:opacity-100 transition-all"
                  title="Edit Category Title"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
                <MenuTitle title={section.title} />
              </div>

              {/* Paper Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 md:p-6 shadow-md border-t-4 border-snip-orange relative overflow-hidden group/section hover:shadow-xl transition-shadow duration-300">
                {/* Dual Price Header */}
                {section.type === 'dual-price' && (
                  <div className="flex justify-end mb-4 px-2 text-snip-black font-display font-bold text-sm border-b border-gray-300 pb-2">
                    <span className="w-20 text-center">PETIT</span>
                    <span className="w-20 text-center">GRAND</span>
                  </div>
                )}

                {section.items.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 italic">
                    No items in this category yet.
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {section.items.map((item) => (
                      <li key={item.id} className="group/item relative">
                        <div
                          className={`flex items-baseline justify-between py-2 border-b border-dashed ${item.available ? 'border-gray-300' : 'border-red-200 bg-red-50/50'}`}
                        >
                          {/* Item Name & Dots */}
                          <div className="flex-1 flex items-baseline relative overflow-hidden">
                            {/* Status Indicator */}
                            <div
                              onClick={() => handleToggleAvailability(item.id, item.available)}
                              className={`mr-3 w-3 h-3 rounded-full cursor-pointer shrink-0 ${item.available ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} transition-colors`}
                              title={
                                item.available
                                  ? 'Click to set Unavailable'
                                  : 'Click to set Available'
                              }
                            ></div>

                            <span
                              className={`font-display font-bold text-lg text-snip-black uppercase tracking-tight z-10 pr-2 ${item.available ? 'bg-white/90' : 'bg-transparent text-gray-500'}`}
                            >
                              {item.name}
                            </span>

                            {/* Dotted Leader */}
                            <div className="dotted-leader absolute bottom-1 left-0 w-full border-b-2 border-dotted border-gray-300 -z-0"></div>
                          </div>

                          {/* Prices */}
                          <div
                            className={`flex items-baseline pl-2 z-10 ${item.available ? 'bg-white/90' : 'bg-transparent'}`}
                          >
                            {section.type === 'standard' && (
                              <span className="font-display font-bold text-xl text-snip-orange whitespace-nowrap">
                                {item.price?.toFixed(2) || '0.00'}{' '}
                                <span className="text-xs text-gray-400">DH</span>
                              </span>
                            )}
                            {section.type === 'dual-price' && (
                              <div className="flex gap-2">
                                <span className="w-20 text-center font-display font-bold text-xl text-snip-orange">
                                  {item.priceSmall?.toFixed(2) || '0.00'}
                                </span>
                                <span className="w-20 text-center font-display font-bold text-xl text-snip-orange">
                                  {item.priceLarge?.toFixed(2) || '0.00'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Overlay */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity bg-white pl-2 shadow-sm rounded-l-lg border border-gray-100 z-20">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full hover:scale-110 transition-all"
                            title="Edit Item"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full hover:scale-110 transition-all"
                            title="Delete Item"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {section.note && (
                  <div className="mt-6 text-center">
                    <span className="inline-block px-4 py-1.5 bg-snip-black text-snip-yellow font-display text-xs tracking-wider uppercase transform -rotate-1 shadow-md">
                      {section.note}
                    </span>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-gray-100 text-center opacity-0 group-hover/section:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setPreSelectedCategoryId(section.id);
                      setIsAddingItem(true);
                    }}
                    className="text-xs font-bold text-gray-400 hover:text-snip-orange uppercase tracking-widest transition-colors"
                  >
                    + Add to {section.title}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Item Modal */}
        {(isAddingItem || editingItem) && (
          <ItemFormModal
            item={editingItem}
            preSelectedCategoryId={preSelectedCategoryId}
            onClose={() => {
              setIsAddingItem(false);
              setEditingItem(null);
            }}
            onSave={() => {
              loadMenuData();
              setIsAddingItem(false);
              setEditingItem(null);
            }}
          />
        )}

        {/* Category Modal */}
        {(isAddingCategory || editingCategory) && (
          <CategoryFormModal
            category={editingCategory}
            onClose={() => {
              setIsAddingCategory(false);
              setEditingCategory(null);
            }}
            onSave={() => {
              loadMenuData();
              setIsAddingCategory(false);
              setEditingCategory(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

// --- Modals ---

const ItemFormModal: React.FC<{
  item: MenuItem | null;
  preSelectedCategoryId?: string;
  onClose: () => void;
  onSave: () => void;
}> = ({ item, preSelectedCategoryId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || preSelectedCategoryId || 'pizza',
    price: item?.price || 0,
    priceSmall: item?.priceSmall || 0,
    priceLarge: item?.priceLarge || 0,
    image: item?.image || '',
    available: item?.available ?? true,
  });

  const categories = localDB.getCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      localDB.updateMenuItem(item.id, formData);
    } else {
      localDB.addMenuItem({ ...formData, nameAr: formData.name });
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slideUp">
        <div className="bg-gradient-custom p-6 text-white text-center">
          <h2 className="text-2xl font-bold">{item ? 'Edit Item' : 'New Item'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Item Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-snip-orange font-bold text-snip-black"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-snip-orange"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Std Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none font-bold"
              />
            </div>
            {/* Simple toggle or expand for dual prices could be here, but using simple inputs for now */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Small (Dual)
              </label>
              <input
                type="number"
                value={formData.priceSmall}
                onChange={(e) => setFormData({ ...formData, priceSmall: Number(e.target.value) })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Large (Dual)
              </label>
              <input
                type="number"
                value={formData.priceLarge}
                onChange={(e) => setFormData({ ...formData, priceLarge: Number(e.target.value) })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border rounded-xl font-bold text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-snip-orange text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CategoryFormModal: React.FC<{
  category: Category | null;
  onClose: () => void;
  onSave: () => void;
}> = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    type: category?.type || 'standard',
    note: category?.note || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      localDB.updateCategory(category.id, formData);
    } else {
      localDB.addCategory(formData);
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-slideUp">
        <div className="bg-gradient-custom p-6 text-white text-center">
          <h2 className="text-2xl font-bold">{category ? 'Edit Category' : 'New Category'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Title
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-snip-orange font-bold text-snip-black"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
            >
              <option value="standard">Standard (Price)</option>
              <option value="dual-price">Dual Price (Petit/Grand)</option>
              <option value="list">List (No Price)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Badge Note (Optional)
            </label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="e.g. 1 Sauce Gratuite"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border rounded-xl font-bold text-gray-500 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-snip-black text-snip-yellow rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuManagement;
