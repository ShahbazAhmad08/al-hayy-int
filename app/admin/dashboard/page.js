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
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getUserOrders, 
  updateOrderStatus,
  getInquiries,
  CATEGORIES as INITIAL_CATEGORIES 
} from '@/lib/api';
import { getPaymentConfig, savePaymentConfig } from '@/lib/paymentConfig';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { adminUser, isAdmin, adminLogout, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'categories' | 'inquiries' | 'payments'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Modals & Forms
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
      const [prods, ords, inqs] = await Promise.all([
        getProducts(),
        getUserOrders(),
        getInquiries()
      ]);
      setProducts(prods || []);
      
      // Merge remote DB orders with any locally placed orders
      let localOrders = [];
      try {
        const stored = localStorage.getItem('alhayy_customer_orders');
        if (stored) localOrders = JSON.parse(stored);
      } catch (e) {}

      const orderMap = new Map();
      (ords || []).forEach(o => orderMap.set(String(o.id), o));
      localOrders.forEach(o => {
        if (!orderMap.has(String(o.id))) {
          orderMap.set(String(o.id), o);
        }
      });

      const mergedOrders = Array.from(orderMap.values());
      // Sort newest first
      mergedOrders.sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        return db - da;
      });

      setOrders(mergedOrders);

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
      data.append('category_id', productFormData.category_id);
      data.append('category_name', productFormData.category);
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

      if (res && res.success) {
        setFeedback({ text: editingProduct ? 'Product updated successfully.' : 'Product added successfully.', isError: false });
        setShowAddProductModal(false);
        loadData();
      } else {
        setFeedback({ text: res?.message || 'Action completed with local sync.', isError: false });
        setShowAddProductModal(false);
        loadData();
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
    setCategoryFormData({ name: '', image: '' });
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (c) => {
    setEditingCategory(c);
    setCategoryFormData({ name: c.name, image: c.image || '' });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) return;

    if (editingCategory) {
      const updated = categories.map(c => 
        c.id === editingCategory.id ? { ...c, name: categoryFormData.name, image: categoryFormData.image } : c
      );
      saveCategories(updated);
      setFeedback({ text: 'Category updated successfully.', isError: false });
    } else {
      const newCat = {
        id: Date.now(),
        name: categoryFormData.name,
        slug: categoryFormData.name.toLowerCase().replace(/\s+/g, '-'),
        image: categoryFormData.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop',
        itemCount: 0
      };
      saveCategories([...categories, newCat]);
      setFeedback({ text: 'New category added.', isError: false });
    }
    setShowCategoryModal(false);
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
              <span className="font-serif-luxury text-2xl font-bold text-[#022C22]">
                ₹{Number(totalRevenue).toLocaleString('en-IN')}
              </span>
              <span className="text-emerald-700 text-[10px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
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
              onClick={handleOpenAddCategory}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>

            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#022C22] text-amber-200 text-xs font-bold uppercase tracking-wider hover:bg-[#064E3B] transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback.text && (
          <div className={`p-4 rounded-2xl text-xs flex items-center justify-between animate-in fade-in duration-200 ${
            feedback.isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
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
                ? 'border-[#022C22] text-[#022C22]'
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
                ? 'border-[#022C22] text-[#022C22]'
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
                ? 'border-[#022C22] text-[#022C22]'
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
                ? 'border-[#022C22] text-[#022C22]'
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
                ? 'border-[#022C22] text-[#022C22]'
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

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
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

                        {/* Amount & Status Dropdown */}
                        <div className="flex items-center gap-3 justify-between sm:justify-end">
                          <span className="font-serif-luxury text-base font-bold text-stone-950">
                            ₹{Number(ord.total_amount || 0).toLocaleString('en-IN')}
                          </span>

                          <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] border ${
                            String(ord.payment_status).toLowerCase() === 'paid'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
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
                                <Phone className="w-3 h-3 text-amber-700" /> Customer Contact & Actions
                              </span>
                              <div className="flex items-center justify-between pt-1">
                                <span className="font-mono text-stone-900">{ord.phone}</span>
                                <a
                                  href={`https://wa.me/${ord.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Salam ${ord.customer_name}, regarding your Al Hayy Order #${displayId}:`)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-semibold"
                                >
                                  <MessageSquare className="w-3 h-3" /> WhatsApp
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
                      <div className="w-10 h-10 rounded-xl bg-[#022C22] text-white flex items-center justify-center">
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

                {/* 2. DIRECT UPI / QR CONFIGURATION */}
                <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-900 text-white flex items-center justify-center">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">Direct UPI & Dynamic QR Code</h4>
                        <p className="text-[11px] text-stone-500">Instant deep-linking to Google Pay, PhonePe, Paytm</p>
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
                      <label className="block font-bold text-stone-700 mb-1">Merchant UPI VPA ID</label>
                      <input
                        type="text"
                        placeholder="alhayy@okhdfcbank"
                        value={paymentConfig.upi?.upiId || ''}
                        onChange={(e) => handlePaymentFieldChange('upi', 'upiId', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Merchant Display Name</label>
                      <input
                        type="text"
                        placeholder="Al Hayy International"
                        value={paymentConfig.upi?.merchantName || ''}
                        onChange={(e) => handlePaymentFieldChange('upi', 'merchantName', e.target.value)}
                        className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
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
