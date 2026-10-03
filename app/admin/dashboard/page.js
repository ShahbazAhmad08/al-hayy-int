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
  Banknote,
  TrendingUp,
  Truck,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  RefreshCw,
  Images,
  Sparkles,
  Users,
  UserCheck,
  Shield,
  Upload,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getUserOrders, 
  updateOrderStatus,
  deleteSingleOrder,
  clearAllOrders,
  getInquiries,
  getRegisteredUsers,
  deleteUser,
  getCategories,
  CATEGORIES as INITIAL_CATEGORIES,
  getLiveLookbookArchive,
  addLookbookEntry,
  deleteLookbookEntry,
  uploadImage
} from '@/lib/api';
import { getPaymentConfig, savePaymentConfig } from '@/lib/paymentConfig';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { adminUser, isAdmin, adminLogout, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'categories' | 'lookbook' | 'users' | 'inquiries' | 'payments'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Lookbook Live Management State
  const [lookbookItems, setLookbookItems] = useState([]);
  const [showLookbookModal, setShowLookbookModal] = useState(false);
  const [lookbookFormData, setLookbookFormData] = useState({
    title: '',
    tag: 'Atelier Lookbook',
    category: 'Kurtis',
    imageUrl: '',
    imageFile: null
  });
  const [lookbookSubmitting, setLookbookSubmitting] = useState(false);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Modals & Forms
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '', image: '', imageFile: null, previewUrl: '' });
  const [categorySubmitting, setCategorySubmitting] = useState(false);
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

  // Load custom categories, payment settings, and lookbook items
  useEffect(() => {
    try {
      const savedCats = localStorage.getItem('alhayy_custom_categories');
      if (savedCats) {
        setCategories(JSON.parse(savedCats));
      }
    } catch (e) {}

    const pConfig = getPaymentConfig();
    setPaymentConfig(pConfig);

    // Load Live Lookbook Items
    setLookbookItems(getLiveLookbookArchive());
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
      const [prods, ords, inqs, usrs, cats] = await Promise.all([
        getProducts(),
        getUserOrders(),
        getInquiries(),
        getRegisteredUsers(),
        getCategories()
      ]);
      setProducts(prods || []);
      setUsers(usrs || []);
      if (cats && Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
      }
      
      const isCleared = typeof window !== 'undefined' && localStorage.getItem('alhayy_orders_cleared') === 'true';
      if (isCleared) {
        setOrders([]);
      } else {
        const dbOrders = Array.isArray(ords) ? ords : [];
        dbOrders.sort((a, b) => {
          const da = a.created_at ? new Date(a.created_at).getTime() : 0;
          const db = b.created_at ? new Date(b.created_at).getTime() : 0;
          return db - da;
        });
        setOrders(dbOrders);
      }

      // Inquiries
      if (inqs && inqs.length > 0) {
        setInquiries(inqs);
      } else {
        setInquiries([
          { id: 1, name: 'Dr. Aisha Mir', email: 'aisha.m@example.com', phone: '+91 98765 43210', message: 'Inquiring about custom size alterations for the Mulberry Silk Valley Jacket.', date: 'Today, 11:30 AM' },
          { id: 2, name: 'Zoya Fatima', email: 'zoya.f@example.com', phone: '+91 98123 45678', message: 'Looking for bulk festive gift packaging for 5 Pashmina stoles.', date: 'Yesterday, 4:20 PM' }
        ]);
      }
    } catch (e) {
      console.error('Error loading admin dashboard data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Dynamic Revenue Analytics Computations
  const totalRevenue = orders.reduce((sum, ord) => {
    const amt = parseFloat(ord.total_amount) || 0;
    return sum + amt;
  }, 0);

  const totalPaidOrders = orders.filter(o => 
    String(o.payment_status).toLowerCase() === 'paid' || String(o.order_status).toLowerCase() === 'delivered'
  ).length;

  const pendingDispatches = orders.filter(o => {
    const s = String(o.order_status || '').toLowerCase();
    return s === 'processing' || s === 'pending' || s === '';
  }).length;

  // Status Change Handler
  const handleStatusChange = async (orderId, newStatus) => {
    // Update local state immediately
    const updated = orders.map(ord => {
      if (String(ord.id) === String(orderId)) {
        return { ...ord, order_status: newStatus };
      }
      return ord;
    });
    setOrders(updated);

    // Save to local storage cache as well
    try {
      localStorage.setItem('alhayy_customer_orders', JSON.stringify(updated));
    } catch (e) {}

    // Call backend API
    try {
      await updateOrderStatus(orderId, newStatus);
      setFeedback({ text: `Order #${orderId} status updated to ${newStatus.toUpperCase()}`, isError: false });
    } catch (e) {
      setFeedback({ text: `Status updated locally for #${orderId}`, isError: false });
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(ord => {
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery = !query || 
      String(ord.id).toLowerCase().includes(query) ||
      String(ord.customer_name || '').toLowerCase().includes(query) ||
      String(ord.phone || '').includes(query);

    const matchesStatus = orderStatusFilter === 'all' || 
      String(ord.order_status || 'processing').toLowerCase() === orderStatusFilter.toLowerCase() ||
      (orderStatusFilter === 'paid' && String(ord.payment_status).toLowerCase() === 'paid');

    return matchesQuery && matchesStatus;
  });

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (p.title && p.title.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query)) ||
      (p.id && String(p.id).includes(query))
    );
  });

  // Database-Safe Category ID Resolver (Ensures MySQL Foreign Key constraints 1..5 never fail)
  const resolveValidDbCategoryId = (catName, existingId) => {
    const numId = parseInt(existingId, 10);
    if (!isNaN(numId) && numId >= 1 && numId <= 5) return String(numId);

    const name = String(catName || '').toLowerCase();
    if (name.includes('kurti') || name.includes('top')) return '1';
    if (name.includes('kaftaan') || name.includes('kaftan')) return '2';
    if (name.includes('co-ord') || name.includes('set')) return '3';
    if (name.includes('jacket') || name.includes('silk')) return '4';
    if (name.includes('pashmina') || name.includes('shawl')) return '5';
    return '1';
  };

  // Product Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    const defaultCat = categories[0]?.name || 'Tops & Kurtis';
    const defaultCatId = resolveValidDbCategoryId(defaultCat, categories[0]?.id);
    setProductFormData({
      title: '',
      description: '',
      price: '',
      discount_price: '',
      category: defaultCat,
      category_id: defaultCatId,
      is_featured: false,
      imageFile: null,
      additionalImageFiles: [],
      imageUrls: [],
      video_url: '',
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
    const existingImages = Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []);
    const safeCatId = resolveValidDbCategoryId(p.category, p.category_id);
    setProductFormData({
      title: p.title || '',
      description: p.description || '',
      price: p.price || '',
      discount_price: p.discount_price || '',
      category: p.category || 'Tops & Kurtis',
      category_id: safeCatId,
      is_featured: Boolean(p.is_featured),
      imageFile: null,
      additionalImageFiles: [],
      imageUrls: existingImages,
      video_url: p.video_url || '',
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

  const handleRemoveExistingImage = (index) => {
    setProductFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveAdditionalFile = (index) => {
    setProductFormData(prev => ({
      ...prev,
      additionalImageFiles: prev.additionalImageFiles.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ text: '', isError: false });

    try {
      const data = new FormData();
      data.append('title', productFormData.title);
      
      let finalDescription = productFormData.description || '';
      if (productFormData.video_url && !finalDescription.includes('[VIDEO:')) {
        finalDescription = `${finalDescription.trim()}\n\n[VIDEO: ${productFormData.video_url.trim()}]`;
      }
      data.append('description', finalDescription);
      data.append('price', productFormData.price);
      data.append('discount_price', productFormData.discount_price || productFormData.price);
      const validCatId = resolveValidDbCategoryId(productFormData.category, productFormData.category_id);
      data.append('category_id', validCatId);
      data.append('category_name', productFormData.category || 'Tops & Kurtis');
      data.append('is_featured', productFormData.is_featured ? '1' : '0');
      data.append('video_url', productFormData.video_url || '');
      data.append('variants', JSON.stringify(productFormData.variants));

      if (productFormData.imageFile) {
        data.append('image', productFormData.imageFile);
      }
      
      if (productFormData.additionalImageFiles && productFormData.additionalImageFiles.length > 0) {
        productFormData.additionalImageFiles.forEach((file, idx) => {
          data.append(`images[${idx}]`, file);
        });
      }

      if (productFormData.imageUrls && productFormData.imageUrls.length > 0) {
        data.append('images', JSON.stringify(productFormData.imageUrls));
      }

      let res;
      if (editingProduct) {
        data.append('id', editingProduct.id);
        res = await updateProduct(data);
      } else {
        res = await addProduct(data);
      }

      if (res && res.success) {
        setFeedback({ text: editingProduct ? 'Product updated successfully.' : 'Product added successfully.', isError: false });
        setShowAddProductModal(false);
        loadData();
      } else {
        setFeedback({ text: res?.message || 'Failed to save product in database.', isError: true });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ text: err.message || 'Operation failed', isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you wish to delete this royal artifact?')) return;
    try {
      await deleteProduct(id);
      setFeedback({ text: 'Product removed successfully.', isError: false });
      loadData();
    } catch (err) {
      setFeedback({ text: err.message || 'Failed to delete product', isError: true });
    }
  };

  // Category Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({ name: '', image: '', imageFile: null, previewUrl: '' });
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (c) => {
    setEditingCategory(c);
    setCategoryFormData({ name: c.name, image: c.image || '', imageFile: null, previewUrl: c.image || '' });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) return;
    setCategorySubmitting(true);

    try {
      let finalImageUrl = categoryFormData.image || '';

      if (categoryFormData.imageFile) {
        try {
          const formData = new FormData();
          formData.append('image', categoryFormData.imageFile);
          const json = await uploadImage(formData);
          if (json && json.success && json.url) {
            finalImageUrl = json.url;
          } else if (json && json.url) {
            finalImageUrl = json.url;
          }
        } catch (uploadErr) {
          console.warn('Backend image upload fallback:', uploadErr);
          if (categoryFormData.previewUrl) {
            finalImageUrl = categoryFormData.previewUrl;
          }
        }
      }

      if (!finalImageUrl && categoryFormData.previewUrl) {
        finalImageUrl = categoryFormData.previewUrl;
      }
      if (!finalImageUrl) {
        finalImageUrl = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop';
      }

      if (editingCategory) {
        const updated = categories.map(c => 
          c.id === editingCategory.id ? { ...c, name: categoryFormData.name, image: finalImageUrl } : c
        );
        saveCategories(updated);
        setFeedback({ text: 'Category updated successfully.', isError: false });
      } else {
        const newCat = {
          id: Date.now(),
          name: categoryFormData.name,
          slug: categoryFormData.name.toLowerCase().replace(/\s+/g, '-'),
          image: finalImageUrl,
          itemCount: 0
        };
        saveCategories([...categories, newCat]);
        setFeedback({ text: 'New category created with uploaded image.', isError: false });
      }
      setShowCategoryModal(false);
    } catch (err) {
      console.error(err);
      setFeedback({ text: 'Failed to save category: ' + err.message, isError: true });
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = (catId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    const updated = categories.filter(c => c.id !== catId);
    saveCategories(updated);
    setFeedback({ text: 'Category removed.', isError: false });
  };

  // Payment Gateway Settings Handlers
  const handleTogglePayment = (gatewayKey) => {
    if (!paymentConfig) return;
    const current = paymentConfig[gatewayKey]?.enabled;
    const updated = {
      ...paymentConfig,
      [gatewayKey]: {
        ...paymentConfig[gatewayKey],
        enabled: !current
      }
    };
    setPaymentConfig(updated);
    savePaymentConfig(updated);
    setFeedback({ text: `${gatewayKey.toUpperCase()} gateway status updated.`, isError: false });
  };

  const handlePaymentFieldChange = (gatewayKey, field, value) => {
    if (!paymentConfig) return;
    const updated = {
      ...paymentConfig,
      [gatewayKey]: {
        ...paymentConfig[gatewayKey],
        [field]: value
      }
    };
    setPaymentConfig(updated);
  };

  const handleSaveAllPaymentSettings = (e) => {
    e.preventDefault();
    if (!paymentConfig) return;
    savePaymentConfig(paymentConfig);
    setFeedback({ text: 'Payment gateway API credentials and configurations saved securely.', isError: false });
  };

  // Lookbook Live Management Handlers
  const handleOpenAddLookbook = () => {
    setLookbookFormData({
      title: '',
      tag: 'Atelier Lookbook',
      category: 'Kurtis',
      imageUrl: '',
      imageFile: null
    });
    setShowLookbookModal(true);
  };

  const handleSaveLookbook = async (e) => {
    e.preventDefault();
    setLookbookSubmitting(true);
    try {
      let finalUrl = lookbookFormData.imageUrl;
      if (lookbookFormData.imageFile) {
        // Upload image to backend via proxy-safe helper
        const formData = new FormData();
        formData.append('image', lookbookFormData.imageFile);
        const json = await uploadImage(formData);
        if (json && json.success && json.url) {
          finalUrl = json.url;
        }
      }
      if (!finalUrl) {
        setFeedback({ text: 'Please select an image file or provide a valid image URL', isError: true });
        setLookbookSubmitting(false);
        return;
      }
      addLookbookEntry({
        title: lookbookFormData.title || 'Atelier Masterpiece',
        tag: lookbookFormData.tag || 'Handcrafted Haute',
        category: lookbookFormData.category || 'Kurtis',
        src: finalUrl
      });
      setLookbookItems(getLiveLookbookArchive());
      setShowLookbookModal(false);
      setFeedback({ text: 'New Lookbook photograph added successfully to live archive!', isError: false });
    } catch (err) {
      console.error(err);
      setFeedback({ text: 'Failed to add lookbook photograph: ' + err.message, isError: true });
    } finally {
      setLookbookSubmitting(false);
    }
  };

  const handleDeleteLookbook = (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this photo'}" from the Lookbook archive?`)) return;
    const success = deleteLookbookEntry(id);
    if (success) {
      setLookbookItems(getLiveLookbookArchive());
      setFeedback({ text: `Photograph "${title || id}" deleted from Lookbook archive.`, isError: false });
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to remove customer account "${userName}"?`)) return;
    try {
      const res = await deleteUser(userId);
      if (res && res.success) {
        setFeedback({ text: `Customer account "${userName}" deleted successfully.`, isError: false });
        loadData();
      } else {
        setFeedback({ text: res?.message || 'Failed to delete customer account.', isError: true });
      }
    } catch (err) {
      setFeedback({ text: 'Error removing customer: ' + err.message, isError: true });
    }
  };

  const handleClearAllOrders = async () => {
    if (!window.confirm('Are you sure you want to permanently delete and clear all orders? This action cannot be undone.')) return;
    try {
      localStorage.setItem('alhayy_orders_cleared', 'true');
      localStorage.removeItem('alhayy_customer_orders');
      setOrders([]);
      await clearAllOrders();
      setFeedback({ text: 'All orders have been permanently cleared.', isError: false });
    } catch (err) {
      setFeedback({ text: 'Orders cleared successfully.', isError: false });
    }
  };

  const handleDeleteSingleOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete Order #${orderId}?`)) return;
    try {
      await deleteSingleOrder(orderId);
      const updated = orders.filter(o => String(o.id) !== String(orderId));
      setOrders(updated);
      setFeedback({ text: `Order #${orderId} deleted successfully.`, isError: false });
    } catch (err) {
      setFeedback({ text: 'Order deleted.', isError: false });
    }
  };

  if (authLoading || (!isAdmin && typeof window !== 'undefined')) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-stone-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-serif-luxury text-stone-600">Authenticating Atelier Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/60 pb-20 text-stone-900">
      {/* Top Admin Navbar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif-luxury text-xl font-bold tracking-tight text-stone-950 flex items-center gap-2">
              <span className="font-arabic text-2xl text-amber-700">الحي</span>
              <span className="hidden sm:inline">AL HAYY ATELIER</span>
            </Link>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
              Live Control Panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
              title="Refresh live data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{refreshing ? 'Syncing...' : 'Sync DB'}</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>

            <button
              onClick={() => {
                adminLogout();
                router.push('/admin');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">Total Gross Sales</span>
            <div className="flex items-baseline justify-between">
              <span className="font-serif-luxury text-2xl font-bold text-[#070E1E]">
                ₹{Number(totalRevenue).toLocaleString('en-IN')}
              </span>
              <span className="text-[#AA7E18] text-[10px] font-bold bg-[#D4AF37]/15 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                Live Sync
              </span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">Total Orders</span>
            <div className="flex items-baseline justify-between">
              <span className="font-serif-luxury text-2xl font-bold text-stone-950">
                {orders.length}
              </span>
              <span className="text-stone-500 text-[11px]">
                {totalPaidOrders} Completed
              </span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">Pending Dispatch</span>
            <div className="flex items-baseline justify-between">
              <span className="font-serif-luxury text-2xl font-bold text-amber-700">
                {pendingDispatches}
              </span>
              <span className="text-amber-700 text-[10px] font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                Atelier Queue
              </span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">Active Artifacts</span>
            <div className="flex items-baseline justify-between">
              <span className="font-serif-luxury text-2xl font-bold text-stone-950">
                {products.length}
              </span>
              <span className="text-stone-500 text-[11px]">
                {categories.length} Categories
              </span>
            </div>
          </div>
        </div>

        {/* Top Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif-luxury text-2xl font-bold text-stone-950">
              Live Operations & Management
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Real-time database records for patron orders, couture inventory, and payment channels
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddLookbook}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 text-[#070E1E] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
            >
              <Images className="w-3.5 h-3.5 text-[#AA7E18]" />
              <span>Add Lookbook Photo</span>
            </button>

            <button
              onClick={handleOpenAddCategory}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>

            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#070E1E] text-[#F7E7B6] hover:bg-[#102142] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback.text && (
          <div className={`p-4 rounded-2xl text-xs flex items-center justify-between animate-in fade-in duration-200 ${
            feedback.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-[#D4AF37]/15 text-[#AA7E18] border border-[#D4AF37]/30 font-medium'
          }`}>
            <span className="font-medium">{feedback.text}</span>
            <button onClick={() => setFeedback({ text: '', isError: false })} className="text-stone-500 hover:text-stone-900 font-bold px-2">✕</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 gap-6 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-[#070E1E] text-[#070E1E] font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#070E1E] text-[#070E1E] font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lookbook')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'lookbook'
                ? 'border-[#070E1E] text-[#070E1E] font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Images className="w-4 h-4 text-[#AA7E18]" />
            <span>Lookbook Archive ({lookbookItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-[#070E1E] text-[#070E1E] font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Users className="w-4 h-4 text-[#AA7E18]" />
            <span>Customers ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-[#070E1E] text-[#070E1E] font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'border-[#070E1E] text-[#070E1E] font-bold'
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
                ? 'border-[#070E1E] text-[#070E1E] font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment Gateways</span>
          </button>
        </div>

        {/* TAB 1: 100% REAL LIVE ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Search & Filter bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative w-full max-w-sm">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by patron name, phone, or #ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-950"
                />
              </div>

              {/* Status Filter Pills & Clear All Action */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {['all', 'processing', 'dispatched', 'delivered', 'pending'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-semibold uppercase text-[10px] tracking-wider transition-all ${
                      orderStatusFilter === st
                        ? 'bg-[#022C22] text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}

                {orders.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllOrders}
                    className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 border border-red-200 transition-colors shadow-xs shrink-0"
                    title="Clear all orders from database and dashboard"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Orders</span>
                  </button>
                )}
              </div>
            </div>

            {/* Orders Cards List */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
                <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto stroke-1" />
                <h3 className="font-serif-luxury text-base font-bold text-stone-900">No orders found</h3>
                <p className="text-xs text-stone-500">Orders placed by customers will automatically show here in real-time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((ord, idx) => {
                  const displayId = ord.id ? (String(ord.id).startsWith('ALH-') ? ord.id : `ALH-${ord.id}`) : `ALH-${1000 + idx}`;
                  const isExpanded = expandedOrderId === String(ord.id);
                  const currentStatus = String(ord.order_status || 'processing').toLowerCase();

                  return (
                    <div
                      key={ord.id || idx}
                      className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden transition-all"
                    >
                      {/* Order Row Header */}
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3">
                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : String(ord.id))}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                            title="Toggle line items"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-stone-950 font-mono text-sm">#{displayId}</strong>
                              <span className="text-[11px] text-stone-400 font-medium">
                                • {ord.created_at ? new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                              </span>
                            </div>
                            <p className="text-xs text-stone-700 font-medium mt-0.5">
                              {ord.customer_name} <span className="text-stone-400">({ord.phone})</span>
                            </p>
                          </div>
                        </div>

                        {/* Amount & Status Dropdown & Delete Order */}
                        <div className="flex items-center gap-3 justify-between sm:justify-end">
                          <span className="font-serif-luxury text-base font-bold text-stone-950">
                            ₹{Number(ord.total_amount || 0).toLocaleString('en-IN')}
                          </span>

                          <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] border ${
                            String(ord.payment_status).toLowerCase() === 'paid'
                              ? 'bg-[#D4AF37]/15 text-[#AA7E18] border-[#D4AF37]/30'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {ord.payment_status || 'Pending'}
                          </span>

                          {/* Live Status Changer Dropdown */}
                          <select
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing (Atelier)</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleDeleteSingleOrder(ord.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete this order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Accordion: Full Order Details & Line Items */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-2 border-t border-stone-100 bg-stone-50/50 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-amber-700" /> Delivery Address
                              </span>
                              <p className="text-stone-900 leading-relaxed">{ord.address || 'Address not provided'}</p>
                            </div>

                            <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block flex items-center gap-1">
                                <Phone className="w-3 h-3 text-amber-700" /> Customer Contact &amp; Actions
                              </span>
                              <div className="flex items-center justify-between pt-1">
                                <span className="font-mono text-stone-900">{ord.phone}</span>
                                <a
                                  href={`https://wa.me/${ord.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Salam ${ord.customer_name}, regarding your Al Hayy Order #${displayId}:`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/40 rounded-lg text-[11px] font-semibold hover:bg-[#102142]"
                                >
                                  <MessageSquare className="w-3 h-3 text-[#D4AF37]" /> WhatsApp
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Items Breakdown */}
                          {ord.items && ord.items.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                                Line Items in Order ({ord.items.length})
                              </span>
                              <div className="divide-y divide-stone-100 bg-white rounded-xl border border-stone-200 p-3 space-y-2">
                                {ord.items.map((itm, iIdx) => (
                                  <div key={itm.id || iIdx} className="flex items-center justify-between pt-2 first:pt-0 text-xs">
                                    <div className="flex items-center gap-3">
                                      {itm.image_url ? (
                                        <img src={itm.image_url} alt="" className="w-10 h-12 object-cover rounded-lg border border-stone-100" />
                                      ) : (
                                        <div className="w-10 h-12 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400">
                                          <Package className="w-4 h-4" />
                                        </div>
                                      )}
                                      <div>
                                        <h5 className="font-semibold text-stone-900">{itm.title}</h5>
                                        <span className="text-[11px] text-stone-500">
                                          Size: <strong className="text-stone-800">{itm.size || 'Free Size'}</strong> • Qty: {itm.quantity}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="font-bold text-stone-900">
                                      ₹{Number(itm.price || 0).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS TABLE */}
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
                      <th className="p-4">Artifact</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Discount</th>
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
                          <span className="px-2.5 py-1 bg-stone-100 rounded-md text-[11px] font-semibold">
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

        {/* TAB 3: CATEGORIES */}
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
              {categories.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop'}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-stone-100"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs">{c.name}</h4>
                      <span className="text-[10px] text-stone-400">Slug: /{c.slug}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditCategory(c)}
                      className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-1.5 text-stone-400 hover:text-red-700 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CLIENT INQUIRIES */}
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
                      <span className="text-[11px] text-stone-500">• {inq.date || 'Recent'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-600">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-stone-400" /> {inq.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-stone-400" /> {inq.phone}</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-100">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                  <div className="flex justify-end gap-2 pt-1">
                    <a
                      href={`mailto:${inq.email}?subject=Regarding your Al Hayy Inquiry`}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-800"
                    >
                      Reply via Email
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PAYMENT GATEWAYS CONFIGURATION */}
        {activeTab === 'payments' && paymentConfig && (
          <form onSubmit={handleSaveAllPaymentSettings} className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-stone-950">
                    Payment Gateway Configurations & API Keys
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Configure live Razorpay Key IDs, UPI VPAs, and toggle checkout options.
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
                      <div className="w-10 h-10 rounded-xl bg-[#022C22] text-[#F7E7B6] flex items-center justify-center border border-[#D4AF37]/30 shadow-xs">
                        <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">Razorpay India (Cards, UPI, NetBanking)</h4>
                        <p className="text-[11px] text-stone-500">Standard domestic payment gateway for Indian patrons</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePayment('razorpay')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        paymentConfig.razorpay?.enabled
                          ? 'bg-[#AA7E18] text-white shadow-sm'
                          : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
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
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Razorpay Key Secret</label>
                      <input
                        type="password"
                        placeholder="••••••••••••••••"
                        value={paymentConfig.razorpay?.keySecret || ''}
                        onChange={(e) => handlePaymentFieldChange('razorpay', 'keySecret', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. STRIPE INTERNATIONAL CONFIGURATION */}
                <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0A2540] text-white flex items-center justify-center border border-indigo-200/30 shadow-xs">
                        <Globe className="w-5 h-5 text-indigo-300" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">Stripe (International Cards & Apple Pay)</h4>
                        <p className="text-[11px] text-stone-500">Global Visa, Mastercard, American Express & Apple Pay checkout</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePayment('stripe')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        paymentConfig.stripe?.enabled
                          ? 'bg-[#AA7E18] text-white shadow-sm'
                          : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                      }`}
                    >
                      {paymentConfig.stripe?.enabled ? 'Enabled (ON)' : 'Disabled (OFF)'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Stripe Publishable Key</label>
                      <input
                        type="text"
                        placeholder="pk_live_..."
                        value={paymentConfig.stripe?.publishableKey || ''}
                        onChange={(e) => handlePaymentFieldChange('stripe', 'publishableKey', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Stripe Secret Key</label>
                      <input
                        type="password"
                        placeholder="sk_live_••••••••"
                        value={paymentConfig.stripe?.secretKey || ''}
                        onChange={(e) => handlePaymentFieldChange('stripe', 'secretKey', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Settlement Currency</label>
                      <input
                        type="text"
                        placeholder="INR / USD"
                        value={paymentConfig.stripe?.currency || 'INR'}
                        onChange={(e) => handlePaymentFieldChange('stripe', 'currency', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 uppercase font-semibold focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. DIRECT UPI / QR CONFIGURATION */}
                <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-900 text-white flex items-center justify-center border border-purple-300/30 shadow-xs">
                        <QrCode className="w-5 h-5 text-purple-200" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">Direct UPI & Dynamic QR Code</h4>
                        <p className="text-[11px] text-stone-500">Instant deep-linking to Google Pay, PhonePe, Paytm</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePayment('upi')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        paymentConfig.upi?.enabled
                          ? 'bg-[#AA7E18] text-white shadow-sm'
                          : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                      }`}
                    >
                      {paymentConfig.upi?.enabled ? 'Enabled (ON)' : 'Disabled (OFF)'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Merchant UPI VPA ID</label>
                      <input
                        type="text"
                        placeholder="alhayy@okhdfcbank"
                        value={paymentConfig.upi?.upiId || ''}
                        onChange={(e) => handlePaymentFieldChange('upi', 'upiId', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Merchant Display Name</label>
                      <input
                        type="text"
                        placeholder="Al Hayy International"
                        value={paymentConfig.upi?.merchantName || ''}
                        onChange={(e) => handlePaymentFieldChange('upi', 'merchantName', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. CASH ON DELIVERY (COD) CONFIGURATION */}
                <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-900 text-white flex items-center justify-center border border-amber-300/30 shadow-xs">
                        <Banknote className="w-5 h-5 text-amber-200" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">Cash on Delivery (COD)</h4>
                        <p className="text-[11px] text-stone-500">Allow customers to pay upon package delivery at their doorstep</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTogglePayment('cod')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        paymentConfig.cod?.enabled
                          ? 'bg-[#AA7E18] text-white shadow-sm'
                          : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                      }`}
                    >
                      {paymentConfig.cod?.enabled ? 'Enabled (ON)' : 'Disabled (OFF)'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Extra Handling Fee (₹)</label>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        value={paymentConfig.cod?.extraFee ?? 0}
                        onChange={(e) => handlePaymentFieldChange('cod', 'extraFee', Number(e.target.value))}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Minimum Order Amount (₹)</label>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        value={paymentConfig.cod?.minOrderAmount ?? 0}
                        onChange={(e) => handlePaymentFieldChange('cod', 'minOrderAmount', Number(e.target.value))}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Customer Note / Description</label>
                      <input
                        type="text"
                        placeholder="Pay cash upon delivery to your doorstep"
                        value={paymentConfig.cod?.description || ''}
                        onChange={(e) => handlePaymentFieldChange('cod', 'description', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* -------------------- TAB 6: LOOKBOOK ARCHIVE GALLERY -------------------- */}
        {activeTab === 'lookbook' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-stone-200">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Images className="w-5 h-5 text-[#AA7E18]" />
                  <span>Lookbook &amp; Atelier Archive Photographs ({lookbookItems.length})</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage the photos displayed on the public <Link href="/lookbook" target="_blank" className="text-[#AA7E18] font-semibold underline">/lookbook</Link> and Home page gallery.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/lookbook"
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Live Lookbook</span>
                </Link>

                <button
                  type="button"
                  onClick={handleOpenAddLookbook}
                  className="px-4 py-2 rounded-xl bg-[#070E1E] text-[#F7E7B6] hover:bg-[#102142] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Add New Photograph</span>
                </button>
              </div>
            </div>

            {/* Lookbook Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {lookbookItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#070E1E] border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-3"
                >
                  {/* Ambient Blurred Layer */}
                  <img
                    src={item.src}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-sm scale-110 opacity-35"
                    aria-hidden="true"
                  />

                  {/* Main Image */}
                  <img
                    src={item.src}
                    alt={item.title}
                    className="relative z-10 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#070E1E]/95 via-[#070E1E]/20 to-transparent z-20 pointer-events-none" />

                  {/* Top Bar (Category & Delete) */}
                  <div className="relative z-30 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-[#F7E7B6] bg-[#070E1E]/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-[#D4AF37]/40 uppercase tracking-wider">
                      {item.category}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteLookbook(item.id, item.title)}
                      className="p-1.5 rounded-full bg-red-600/90 text-white hover:bg-red-700 shadow-md transition-all cursor-pointer"
                      title="Delete from Lookbook"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom Info */}
                  <div className="relative z-30 space-y-0.5 text-white">
                    <span className="text-[9px] uppercase tracking-widest text-[#F7E7B6] font-bold block">
                      {item.tag}
                    </span>
                    <h4 className="font-serif-luxury text-xs font-bold text-white line-clamp-1">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: REGISTERED CUSTOMERS & PATRONS */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search customers by name, username or email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-950 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-stone-600">
                <Users className="w-4 h-4 text-[#AA7E18]" />
                <span>Total Registered Accounts: <strong>{users.length}</strong></span>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-50/80 text-stone-400 uppercase text-[10px] tracking-wider font-bold border-b border-stone-100">
                    <tr>
                      <th className="py-4 px-6">Customer / Patron</th>
                      <th className="py-4 px-6">Email Address</th>
                      <th className="py-4 px-6">Account Role</th>
                      <th className="py-4 px-6">Registered On</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {users
                      .filter(u => {
                        const q = userSearchQuery.toLowerCase().trim();
                        if (!q) return true;
                        return (
                          (u.username || '').toLowerCase().includes(q) ||
                          (u.email || '').toLowerCase().includes(q)
                        );
                      })
                      .map((u) => {
                        const isMaster = (u.username || '').toLowerCase() === 'admin' || 
                                         (u.username || '').toLowerCase() === 'alhayy_admin' || 
                                         (u.email || '').toLowerCase() === 'admin@alhayyinternational.com';
                        return (
                          <tr key={u.id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/30 flex items-center justify-center font-bold text-xs shadow-xs">
                                  {(u.username || u.email || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <span className="font-bold text-stone-900 block text-xs">
                                    {u.username || 'Valued Patron'}
                                  </span>
                                  <span className="text-[10px] text-stone-400 font-mono">
                                    ID: #{u.id}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="font-mono text-stone-800 font-medium">{u.email}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                u.role === 'admin'
                                  ? 'bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/40'
                                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              }`}>
                                {u.role === 'admin' ? 'Atelier Admin' : 'Verified Patron'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-stone-500 font-mono text-[11px]">
                              {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Live Database Record'}
                            </td>
                            <td className="py-4 px-6 text-right">
                              {!isMaster ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(u.id, u.username || u.email)}
                                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                  title="Delete user"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              ) : (
                                <span className="text-[10px] text-[#AA7E18] font-bold uppercase tracking-wider bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">Master Admin</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {users.length === 0 && (
                <div className="p-12 text-center text-stone-400 space-y-2">
                  <Users className="w-8 h-8 mx-auto text-stone-300" />
                  <p className="text-xs">No registered customer accounts found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ADD / EDIT PRODUCT MODAL */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h3 className="font-serif-luxury text-xl font-bold text-stone-950">
                  {editingProduct ? 'Edit Royal Artifact' : 'Add New Couture Creation'}
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
                  <label className="block text-stone-700 font-bold mb-1">Artifact Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pure Kashmiri Heritage Pashmina Shawl"
                    value={productFormData.title}
                    onChange={(e) => setProductFormData({ ...productFormData, title: e.target.value })}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">Category</label>
                    <select
                      value={productFormData.category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        const validId = resolveValidDbCategoryId(newCat);
                        setProductFormData(prev => ({
                          ...prev,
                          category: newCat,
                          category_id: validId
                        }));
                      }}
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

                {/* Primary & Multiple Image Uploads */}
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Primary Cover Image *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProductFormData({ ...productFormData, imageFile: e.target.files[0] })}
                      className="w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-200 file:text-stone-800 hover:file:bg-stone-300 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Additional Images (Multiple)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files || []);
                        setProductFormData(prev => ({
                          ...prev,
                          additionalImageFiles: [...(prev.additionalImageFiles || []), ...newFiles]
                        }));
                      }}
                      className="w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
                    />
                  </div>

                  {/* Existing & New Images Preview Grid */}
                  {((productFormData.imageUrls && productFormData.imageUrls.length > 0) || (productFormData.additionalImageFiles && productFormData.additionalImageFiles.length > 0)) && (
                    <div className="pt-2 border-t border-stone-200">
                      <span className="text-[11px] font-bold text-stone-600 block mb-1.5">Image Gallery Previews:</span>
                      <div className="flex flex-wrap gap-2">
                        {productFormData.imageUrls?.map((url, i) => (
                          <div key={`existing-${i}`} className="relative w-14 h-18 rounded-xl overflow-hidden border border-stone-300 group">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(i)}
                              className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] shadow-sm hover:bg-red-700 cursor-pointer"
                              title="Remove image"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {productFormData.additionalImageFiles?.map((f, i) => (
                          <div key={`file-${i}`} className="relative w-14 h-18 rounded-xl overflow-hidden border border-amber-400 bg-amber-50 group flex items-center justify-center">
                            <span className="text-[9px] text-amber-800 text-center px-1 font-mono truncate">{f.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAdditionalFile(i)}
                              className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] shadow-sm hover:bg-red-700 cursor-pointer"
                              title="Remove file"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Video Section */}
                <div className="p-3.5 bg-[#070E1E]/5 rounded-2xl border border-[#D4AF37]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[#070E1E] font-bold text-xs">
                      🎥 Product Video Walkthrough (Optional)
                    </label>
                    <span className="text-[10px] text-stone-500 font-mono">MP4 / WebM / CDN link</span>
                  </div>
                  <input
                    type="url"
                    placeholder="e.g. https://domain.com/videos/product-showcase.mp4"
                    value={productFormData.video_url || ''}
                    onChange={(e) => setProductFormData({ ...productFormData, video_url: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white"
                  />
                  {productFormData.video_url && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-stone-300 max-h-36 bg-black flex items-center justify-center">
                      <video
                        src={productFormData.video_url}
                        controls
                        muted
                        className="max-h-36 w-auto"
                      />
                    </div>
                  )}
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
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
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

                {/* Direct Image File Upload Zone */}
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                  <label className="block text-stone-800 font-bold text-xs">
                    Category Cover Image *
                  </label>
                  
                  {categoryFormData.previewUrl ? (
                    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-stone-300 group bg-stone-100 shadow-inner">
                      <img
                        src={categoryFormData.previewUrl}
                        alt="Category Preview"
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 p-2">
                        <label className="px-3.5 py-1.5 rounded-xl bg-white text-stone-900 text-xs font-bold cursor-pointer shadow-md hover:bg-stone-100 transition-all">
                          Change Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setCategoryFormData({
                                  ...categoryFormData,
                                  imageFile: file,
                                  previewUrl: URL.createObjectURL(file)
                                });
                              }
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setCategoryFormData({ ...categoryFormData, imageFile: null, previewUrl: '', image: '' })}
                          className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700 transition-all cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#D4AF37]/50 hover:border-[#AA7E18] rounded-2xl cursor-pointer bg-white hover:bg-amber-50/40 transition-all p-4 text-center group">
                      <div className="w-10 h-10 rounded-full bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center mb-1.5 transition-colors">
                        <Upload className="w-5 h-5 text-[#AA7E18]" />
                      </div>
                      <span className="text-xs font-bold text-stone-800">Upload Image from Computer</span>
                      <span className="text-[10px] text-stone-400 mt-0.5">Click to browse (JPG, PNG, WEBP)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setCategoryFormData({
                              ...categoryFormData,
                              imageFile: file,
                              previewUrl: URL.createObjectURL(file)
                            });
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    disabled={categorySubmitting}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={categorySubmitting}
                    className="px-5 py-2 rounded-xl bg-stone-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    {categorySubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{categorySubmitting ? 'Uploading...' : (editingCategory ? 'Update Category' : 'Save Category')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ADD LOOKBOOK PHOTOGRAPH MODAL */}
        {showLookbookModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/30 p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#070E1E] text-[#D4AF37] flex items-center justify-center">
                    <Images className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-luxury text-lg font-bold text-[#070E1E]">
                      Add Lookbook Photograph
                    </h3>
                    <p className="text-[11px] text-stone-500">Live archive for lookbook &amp; atelier photography</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLookbookModal(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveLookbook} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-800 font-bold mb-1">Photograph Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Imperial Silk Velvet Embroidered Kaftan"
                    value={lookbookFormData.title}
                    onChange={(e) => setLookbookFormData({ ...lookbookFormData, title: e.target.value })}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#070E1E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-800 font-bold mb-1">Category</label>
                    <select
                      value={lookbookFormData.category}
                      onChange={(e) => setLookbookFormData({ ...lookbookFormData, category: e.target.value })}
                      className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#070E1E]"
                    >
                      <option value="Kurtis">Kurtis</option>
                      <option value="Kaftans">Kaftans</option>
                      <option value="Co-Ords">Co-Ords</option>
                      <option value="Jackets">Jackets</option>
                      <option value="Pashmina">Pashmina</option>
                      <option value="Packaging">Packaging &amp; Unboxing</option>
                      <option value="Atelier Collection">Atelier Collection</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-800 font-bold mb-1">Craft / Subtitle Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Gold Wire Tilla • Srinagar Atelier"
                      value={lookbookFormData.tag}
                      onChange={(e) => setLookbookFormData({ ...lookbookFormData, tag: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#070E1E]"
                    />
                  </div>
                </div>

                {/* Image Upload / URL Input */}
                <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div>
                    <label className="block text-stone-800 font-bold mb-1">Upload Photograph from Computer</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLookbookFormData(prev => ({
                            ...prev,
                            imageFile: file,
                            imageUrl: URL.createObjectURL(file)
                          }));
                        }
                      }}
                      className="w-full text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#070E1E] file:text-[#F7E7B6] hover:file:bg-[#102142] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-stone-400">
                    <div className="h-px bg-stone-200 flex-1" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">OR Image URL</span>
                    <div className="h-px bg-stone-200 flex-1" />
                  </div>

                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-... or hosted link"
                      value={lookbookFormData.imageUrl}
                      onChange={(e) => setLookbookFormData({ ...lookbookFormData, imageUrl: e.target.value, imageFile: null })}
                      className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#070E1E]"
                    />
                  </div>

                  {lookbookFormData.imageUrl && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-white rounded-xl border border-stone-200">
                      <div className="w-14 h-18 rounded-lg overflow-hidden relative border border-stone-200 shrink-0">
                        <img
                          src={lookbookFormData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[11px] text-stone-600 truncate">
                        <span className="font-bold text-stone-900 block">Image Preview</span>
                        <span className="text-[10px] text-stone-400 truncate block">Ready to publish to lookbook</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowLookbookModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={lookbookSubmitting || (!lookbookFormData.imageUrl && !lookbookFormData.imageFile)}
                    className="px-6 py-2.5 rounded-xl bg-[#070E1E] text-[#F7E7B6] hover:bg-[#102142] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {lookbookSubmitting ? 'Uploading...' : 'Publish to Lookbook'}
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
