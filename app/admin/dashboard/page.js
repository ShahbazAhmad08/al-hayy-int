'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit3, 
  LogOut, 
  MessageSquare,
  Search,
  ExternalLink,
  Mail,
  Phone,
  Layers,
  X,
  CheckCircle2,
  ShieldAlert,
  Tag,
  CreditCard,
  Settings,
  Save,
  Globe,
  QrCode,
  Banknote
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getUserOrders, 
  CATEGORIES as INITIAL_CATEGORIES 
} from '@/lib/api';
import { getPaymentConfig, savePaymentConfig } from '@/lib/paymentConfig';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { adminUser, isAdmin, adminLogout, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'categories' | 'orders' | 'inquiries' | 'payments'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([
    { id: 1, name: 'Aisha Mir', email: 'aisha.m@example.com', phone: '+91 98765 43210', message: 'Inquiring about custom size alterations for the Mulberry Silk Jacket for an upcoming wedding in Delhi.', date: 'Today, 2:15 PM' },
    { id: 2, name: 'Zoya Fatima', email: 'zoya.f@example.com', phone: '+91 98123 45678', message: 'Looking for bulk festive gift packaging for 5 Pashmina stoles.', date: 'Yesterday, 6:40 PM' }
  ]);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', image: '' });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', isError: false });

  // Product Form State
  const [productFormData, setProductFormData] = useState({
    title: '',
    description: '',
    price: '',
    discount_price: '',
    category: 'Tops & Kurtis',
    category_id: '1',
    is_featured: false,
    imageFile: null,
    variants: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 8 }
    ]
  });

  // Strict Admin Protection
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, authLoading, router]);

  // Load custom categories and payment settings
  useEffect(() => {
    try {
      const savedCats = localStorage.getItem('alhayy_custom_categories');
      if (savedCats) {
        setCategories(JSON.parse(savedCats));
      }
    } catch (e) {}

    const pConfig = getPaymentConfig();
    setPaymentConfig(pConfig);
  }, []);

  const saveCategories = (newCats) => {
    setCategories(newCats);
    try {
      localStorage.setItem('alhayy_custom_categories', JSON.stringify(newCats));
    } catch (e) {}
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        getProducts(),
        getUserOrders()
      ]);
      setProducts(prods || []);
      setOrders(ords || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Product Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      title: '',
      description: '',
      price: '',
      discount_price: '',
      category: categories[0]?.name || 'Tops & Kurtis',
      category_id: String(categories[0]?.id || '1'),
      is_featured: false,
      imageFile: null,
      variants: [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 12 },
        { size: 'XL', stock: 8 }
      ]
    });
    setShowAddProductModal(true);
  };

  const handleOpenEditProduct = (p) => {
    setEditingProduct(p);
    setProductFormData({
      title: p.title || '',
      description: p.description || '',
      price: p.price || '',
      discount_price: p.discount_price || '',
      category: p.category || 'Tops & Kurtis',
      category_id: String(p.category_id || '1'),
      is_featured: Boolean(p.is_featured),
      imageFile: null,
      variants: p.variants && p.variants.length > 0 ? p.variants : [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 12 }
      ]
    });
    setShowAddProductModal(true);
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...productFormData.variants];
    updated[index][field] = value;
    setProductFormData(prev => ({ ...prev, variants: updated }));
  };

  const handleAddVariant = () => {
    setProductFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { size: 'XXL', stock: 5 }]
    }));
  };

  const handleRemoveVariant = (index) => {
    setProductFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ text: '', isError: false });

    try {
      const data = new FormData();
      data.append('title', productFormData.title);
      data.append('description', productFormData.description);
      data.append('price', productFormData.price);
      data.append('discount_price', productFormData.discount_price || productFormData.price);
      data.append('category', productFormData.category);
      data.append('is_featured', productFormData.is_featured ? '1' : '0');
      data.append('variants', JSON.stringify(productFormData.variants));

      if (productFormData.imageFile) {
        data.append('image', productFormData.imageFile);
      }

      let res;
      if (editingProduct) {
        data.append('id', editingProduct.id);
        res = await updateProduct(data);
      } else {
        res = await addProduct(data);
      }

      const localUpdatedProduct = {
        id: editingProduct ? editingProduct.id : (res?.product_id || Date.now()),
        title: productFormData.title,
        description: productFormData.description,
        price: Number(productFormData.price),
        discount_price: Number(productFormData.discount_price || productFormData.price),
        category: productFormData.category,
        is_featured: productFormData.is_featured ? 1 : 0,
        image: productFormData.imageFile ? URL.createObjectURL(productFormData.imageFile) : (editingProduct?.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600'),
        variants: productFormData.variants
      };

      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? localUpdatedProduct : p));
      } else {
        setProducts(prev => [localUpdatedProduct, ...prev]);
      }

      setShowAddProductModal(false);
      setFeedback({ text: `Product "${productFormData.title}" saved successfully!`, isError: false });
    } catch (err) {
      console.error(err);
      setFeedback({ text: err.message, isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setFeedback({ text: 'Product deleted from catalog.', isError: false });
    } catch (e) {
      console.error(e);
    }
  };

  // Category Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({ name: '', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600' });
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryFormData({ name: cat.name, image: cat.image || '' });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) return;

    if (editingCategory) {
      const updatedCats = categories.map(c => 
        c.id === editingCategory.id ? { ...c, name: categoryFormData.name, image: categoryFormData.image || c.image } : c
      );
      saveCategories(updatedCats);
      setProducts(prev => prev.map(p => p.category === editingCategory.name ? { ...p, category: categoryFormData.name } : p));
      setFeedback({ text: `Category "${categoryFormData.name}" updated!`, isError: false });
    } else {
      const newCat = {
        id: Date.now(),
        name: categoryFormData.name.trim(),
        count: 0,
        image: categoryFormData.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600'
      };
      saveCategories([...categories, newCat]);
      setFeedback({ text: `New Category "${newCat.name}" added successfully!`, isError: false });
    }
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (catId, catName) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    const updated = categories.filter(c => c.id !== catId);
    saveCategories(updated);
    setFeedback({ text: `Category "${catName}" removed.`, isError: false });
  };

  // Payment Handlers
  const handleTogglePayment = (method) => {
    if (!paymentConfig) return;
    const updated = {
      ...paymentConfig,
      [method]: {
        ...paymentConfig[method],
        enabled: !paymentConfig[method]?.enabled
      }
    };
    setPaymentConfig(updated);
    savePaymentConfig(updated);
    setFeedback({ text: `${updated[method].name} is now ${updated[method].enabled ? 'ENABLED' : 'DISABLED'}!`, isError: false });
  };

  const handlePaymentFieldChange = (gateway, field, value) => {
    setPaymentConfig(prev => ({
      ...prev,
      [gateway]: {
        ...prev[gateway],
        [field]: value
      }
    }));
  };

  const handleSaveAllPaymentSettings = (e) => {
    if (e) e.preventDefault();
    if (!paymentConfig) return;
    savePaymentConfig(paymentConfig);
    setFeedback({ text: 'All Payment Gateway configurations saved successfully!', isError: false });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-stone-50">
        <div className="p-8 bg-white rounded-3xl border border-stone-200 shadow-md text-center space-y-4 max-w-sm">
          <ShieldAlert className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="font-serif-luxury text-xl font-bold text-stone-900">Access Restricted</h2>
          <p className="text-xs text-stone-500">You must sign in with administrator privileges to access this control center.</p>
          <Link href="/admin" className="inline-block py-2.5 px-5 rounded-xl bg-stone-950 text-white text-xs font-bold uppercase tracking-wider">
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Dedicated Clean Admin Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-32">
                <Image src="/logo.avif" alt="Al Hayy" fill className="object-contain object-left" priority />
              </div>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-bold uppercase tracking-wider">
              Admin Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-950 font-medium px-2 py-1"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => {
                adminLogout();
                router.push('/admin');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-950">
              Atelier Management Hub
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage products, live categories, orders, payment gateways & client inquiries
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddCategory}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>

            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback.text && (
          <div className={`p-4 rounded-2xl text-xs flex items-center justify-between ${
            feedback.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            <span>{feedback.text}</span>
            <button onClick={() => setFeedback({ text: '', isError: false })}>✕</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 gap-6 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length > 0 ? orders.length : '14'})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquiries ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'payments'
                ? 'border-stone-950 text-stone-950'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment Gateways</span>
          </button>
        </div>

        {/* TAB 1: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search products by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
              />
            </div>

            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-600 uppercase font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-4">Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Sale Price</th>
                      <th className="p-4">Variants</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={p.image}
                            alt=""
                            className="w-12 h-14 object-cover rounded-xl border border-stone-100 flex-shrink-0"
                          />
                          <div>
                            <h4 className="font-semibold text-stone-900 line-clamp-1">{p.title}</h4>
                            <span className="text-[10px] text-stone-400">ID: {p.id}</span>
                          </div>
                        </td>

                        <td className="p-4 font-medium text-stone-700">
                          <span className="px-2 py-1 bg-stone-100 rounded-md text-[11px] font-semibold">
                            {p.category}
                          </span>
                        </td>

                        <td className="p-4 font-medium text-stone-500">
                          ₹{p.price}
                        </td>

                        <td className="p-4 font-bold text-stone-950">
                          ₹{p.discount_price || p.price}
                        </td>

                        <td className="p-4 text-stone-600">
                          {p.variants ? p.variants.map(v => v.size).join(', ') : 'Free Size'}
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 rounded-lg text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORY MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Manage collection categories displayed on storefront and filters
              </span>
              <button
                onClick={handleOpenAddCategory}
                className="px-4 py-2 rounded-xl bg-stone-950 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const count = products.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length;
                return (
                  <div
                    key={cat.id}
                    className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600'}
                        alt={cat.name}
                        className="w-12 h-12 object-cover rounded-xl border border-stone-100"
                      />
                      <div>
                        <h4 className="font-semibold text-stone-900 text-sm">{cat.name}</h4>
                        <span className="text-xs text-stone-400">{count} products assigned</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                        title="Edit Category Name"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-4">
            <h3 className="font-serif-luxury text-lg font-bold text-stone-950">
              Customer Orders
            </h3>

            <div className="divide-y divide-stone-100">
              {[
                { id: 'ALH-892110', name: 'Dr. Aisha Mir', phone: '9876543210', amount: 2697, status: 'Paid / Dispatched', date: 'Today' },
                { id: 'ALH-892109', name: 'Fatima Zohra', phone: '9812345678', amount: 899, status: 'COD / In Transit', date: 'Yesterday' },
                { id: 'ALH-892108', name: 'Kavita Sharma', phone: '9765432190', amount: 4999, status: 'Paid / Delivered', date: '2 days ago' }
              ].map((ord) => (
                <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-stone-900 font-mono">{ord.id}</strong>
                      <span className="text-stone-400">• {ord.date}</span>
                    </div>
                    <p className="text-stone-600 mt-0.5">{ord.name} ({ord.phone})</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-stone-950 text-sm">₹{ord.amount.toLocaleString('en-IN')}</span>
                    <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 font-semibold text-[11px]">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CONTACT INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-4">
            <h3 className="font-serif-luxury text-lg font-bold text-stone-950">
              Client Messages & Bespoke Inquiries
            </h3>

            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-stone-900 text-sm">{inq.name}</strong>
                      <span className="text-[11px] text-stone-500">• {inq.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-600">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-stone-400" /> {inq.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-stone-400" /> {inq.phone}</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-100">
                    "{inq.message}"
                  </p>
                  <div className="flex justify-end gap-2 pt-1">
                    <a
                      href={`mailto:${inq.email}?subject=Regarding your Al Hayy Inquiry`}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium"
                    >
                      Reply via Email
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PAYMENT GATEWAYS CONTROL & CONFIGURATION */}
        {activeTab === 'payments' && paymentConfig && (
          <form onSubmit={handleSaveAllPaymentSettings} className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-stone-950">
                    Payment Gateway Configurations & API Keys
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Configure live API credentials, UPI VPAs, and toggle checkout methods ON/OFF.
                  </p>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save All Settings</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* 1. RAZORPAY CONFIGURATION */}
                <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">Razorpay India (Cards, UPI, NetBanking)</h4>
                        <p className="text-[11px] text-stone-500">Standard domestic payment gateway for Indian patrons</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePayment('razorpay')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        paymentConfig.razorpay?.enabled
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {paymentConfig.razorpay?.enabled ? 'Enabled (ON)' : 'Disabled (OFF)'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Razorpay Key ID</label>
                      <input
                        type="text"
                        placeholder="rzp_live_..."
                        value={paymentConfig.razorpay?.keyId || ''}
                        onChange={(e) => handlePaymentFieldChange('razorpay', 'keyId', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Razorpay Key Secret</label>
                      <input
                        type="password"
                        placeholder="••••••••••••••••"
                        value={paymentConfig.razorpay?.keySecret || ''}
                        onChange={(e) => handlePaymentFieldChange('razorpay', 'keySecret', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. STRIPE CONFIGURATION */}
                <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">Stripe International (Visa, AMEX, Apple Pay)</h4>
                        <p className="text-[11px] text-stone-500">Accept global currencies from US, UK, UAE & Europe</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePayment('stripe')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        paymentConfig.stripe?.enabled
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {paymentConfig.stripe?.enabled ? 'Enabled (ON)' : 'Disabled (OFF)'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-stone-700 mb-1">Publishable Key</label>
                      <input
                        type="text"
                        placeholder="pk_live_..."
                        value={paymentConfig.stripe?.publishableKey || ''}
                        onChange={(e) => handlePaymentFieldChange('stripe', 'publishableKey', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Default Settlement Currency</label>
                      <select
                        value={paymentConfig.stripe?.currency || 'INR'}
                        onChange={(e) => handlePaymentFieldChange('stripe', 'currency', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 font-semibold"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="AED">AED (د.إ)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. UPI DIRECT CONFIGURATION */}
                <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">UPI Direct Pay & Dynamic QR (Zero Gateway Fee)</h4>
                        <p className="text-[11px] text-stone-500">Direct merchant account QR scan via GPay, PhonePe & Paytm</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePayment('upi')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        paymentConfig.upi?.enabled
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {paymentConfig.upi?.enabled ? 'Enabled (ON)' : 'Disabled (OFF)'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">UPI VPA Address (Merchant VPA)</label>
                      <input
                        type="text"
                        placeholder="alhayy@okhdfcbank"
                        value={paymentConfig.upi?.upiId || ''}
                        onChange={(e) => handlePaymentFieldChange('upi', 'upiId', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Payee Business Name (Shown on App)</label>
                      <input
                        type="text"
                        placeholder="Al Hayy Kashmir"
                        value={paymentConfig.upi?.merchantName || ''}
                        onChange={(e) => handlePaymentFieldChange('upi', 'merchantName', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. CASH ON DELIVERY (COD) CONFIGURATION */}
                <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-sm">Cash on Delivery (COD)</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Admin Switch</span>
                        </div>
                        <p className="text-[11px] text-stone-500">Pay cash upon delivery to customer doorstep (Default OFF)</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePayment('cod')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        paymentConfig.cod?.enabled
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {paymentConfig.cod?.enabled ? 'Enabled (ON)' : 'Disabled (OFF)'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Extra COD Handling Fee (₹)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={paymentConfig.cod?.extraFee || 0}
                        onChange={(e) => handlePaymentFieldChange('cod', 'extraFee', Number(e.target.value))}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Minimum Order Amount for COD (₹)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0 (No minimum)"
                        value={paymentConfig.cod?.minOrderAmount || 0}
                        onChange={(e) => handlePaymentFieldChange('cod', 'minOrderAmount', Number(e.target.value))}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Payment Settings</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ADD / EDIT PRODUCT MODAL */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6 my-8">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
                  {editingProduct ? 'Edit Product' : 'Add New Designer Creation'}
                </h3>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fine Silk Embroidered Kurti"
                    value={productFormData.title}
                    onChange={(e) => setProductFormData({ ...productFormData, title: e.target.value })}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Category *</label>
                    <select
                      value={productFormData.category}
                      onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-xs font-medium"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Regular Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="999"
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Sale Discount Price (₹)</label>
                    <input
                      type="number"
                      placeholder="899"
                      value={productFormData.discount_price}
                      onChange={(e) => setProductFormData({ ...productFormData, discount_price: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Description & Specifications</label>
                  <textarea
                    rows={3}
                    placeholder="Description of fabric, needlework, and fit..."
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Image Upload (File)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProductFormData({ ...productFormData, imageFile: e.target.files[0] })}
                    className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-800 hover:file:bg-stone-200"
                  />
                </div>

                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Variants (Size & Stock)</span>
                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="text-stone-900 hover:underline font-bold text-[11px]"
                    >
                      + Add Size
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {productFormData.variants.map((v, i) => (
                      <div key={i} className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-xl border border-stone-200">
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => handleVariantChange(i, 'size', e.target.value)}
                          className="w-12 text-center py-1 rounded border border-stone-200 text-xs font-bold"
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(i, 'stock', Number(e.target.value))}
                          className="w-14 text-center py-1 rounded border border-stone-200 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(i)}
                          className="text-stone-400 hover:text-red-600 px-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-stone-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD / EDIT CATEGORY MODAL */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif-luxury text-lg font-bold text-stone-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silk Jackets / Pashmina Shawls"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={categoryFormData.image}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, image: e.target.value })}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-stone-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
