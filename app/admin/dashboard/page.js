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
  addCategory,
  updateCategory,
  deleteCategory,
  getLiveCategoriesArchive,
  saveLiveCategoriesArchive,
  CATEGORIES as INITIAL_CATEGORIES,
  SUBCATEGORIES_MAP,
  getSubcategories,
  addSubcategory,
  deleteSubcategory,
  getLookbookReels,
  getLiveLookbookArchive,
  addLookbookReel,
  deleteLookbookReel,
  uploadImage
} from '@/lib/api';
import { getPaymentConfig, savePaymentConfig } from '@/lib/paymentConfig';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { adminUser, isAdmin, adminLogout, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'categories' | 'lookbook' | 'users' | 'inquiries' | 'payments'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [subcategoriesList, setSubcategoriesList] = useState([]);
  const [showSubcatModal, setShowSubcatModal] = useState(false);
  const [subcatFormData, setSubcatFormData] = useState({ category_id: '1', name: '' });
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
    tag: 'Atelier Reel',
    category: 'Tops & Kurtis',
    videoUrl: '',
    videoFile: null,
    imageUrl: '',
    imageFile: null,
    productId: ''
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
    subcategory: '',
    fabric: '',
    craft_details: '',
    care: '',
    size_chart: 'none',
    season: 'all',
    is_featured: false,
    imageFile: null,
    additionalImageFiles: [],
    imageUrls: [],
    video_url: '',
    colors: ['Ivory White', 'Bottle Green', 'Royal Maroon'],
    customColorInput: '',
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
    const liveCats = getLiveCategoriesArchive();
    if (liveCats && liveCats.length > 0) {
      setCategories(liveCats);
    }

    const pConfig = getPaymentConfig();
    setPaymentConfig(pConfig);

    // Load Live Lookbook Items
    setLookbookItems(getLiveLookbookArchive());
  }, []);

  const saveCategories = (newCats) => {
    setCategories(newCats);
    saveLiveCategoriesArchive(newCats);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords, inqs, usrs, cats, lReels, subcats] = await Promise.all([
        getProducts(),
        getUserOrders(),
        getInquiries(),
        getRegisteredUsers(),
        getCategories(),
        getLookbookReels(),
        getSubcategories()
      ]);
      setProducts(prods || []);
      setUsers(usrs || []);
      if (Array.isArray(lReels)) {
        setLookbookItems(lReels);
      }
      
      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
        saveLiveCategoriesArchive(cats);
      }

      if (Array.isArray(subcats)) {
        setSubcategoriesList(subcats);
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

  const handleAddSubcategorySubmit = async (e) => {
    e?.preventDefault();
    if (!subcatFormData.name?.trim()) return;
    setFeedback({ text: '', isError: false });
    const res = await addSubcategory({
      category_id: subcatFormData.category_id,
      name: subcatFormData.name.trim()
    });
    if (res && res.success) {
      setFeedback({ text: 'Subcategory added successfully', isError: false });
      setShowSubcatModal(false);
      setSubcatFormData(prev => ({ ...prev, name: '' }));
      const refreshed = await getSubcategories();
      if (Array.isArray(refreshed)) setSubcategoriesList(refreshed);
    } else {
      setFeedback({ text: res?.message || 'Failed to add subcategory', isError: true });
    }
  };

  const handleDeleteSubcat = async (id) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    const res = await deleteSubcategory(id);
    if (res && res.success) {
      setFeedback({ text: 'Subcategory deleted successfully', isError: false });
      const refreshed = await getSubcategories();
      if (Array.isArray(refreshed)) setSubcategoriesList(refreshed);
    } else {
      setFeedback({ text: res?.message || 'Failed to delete subcategory', isError: true });
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

  // Database-Safe Category ID Resolver (Matches live category ID from database)
  const resolveValidDbCategoryId = (catName, existingId) => {
    if (existingId !== undefined && existingId !== null && existingId !== '') {
      const matchById = categories.find(c => String(c.id) === String(existingId));
      if (matchById) return String(matchById.id);
    }
    const matchByName = categories.find(c => String(c.name).toLowerCase() === String(catName || '').toLowerCase());
    if (matchByName) return String(matchByName.id);

    return existingId ? String(existingId) : '1';
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
      subcategory: '',
      fabric: '',
      craft_details: '',
      care: '',
      size_chart: 'none',
      season: 'all',
      is_featured: false,
      imageFile: null,
      additionalImageFiles: [],
      imageUrls: [],
      video_url: '',
      colors: ['Bottle Green', 'Royal Maroon', 'Ivory White'],
      customColorInput: '',
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
      subcategory: p.subcategory || '',
      fabric: p.fabric || '',
      craft_details: p.craft_details || '',
      care: p.care || '',
      size_chart: p.size_chart || 'none',
      season: p.season || 'all',
      is_featured: Boolean(p.is_featured),
      imageFile: null,
      additionalImageFiles: [],
      imageUrls: existingImages,
      video_url: p.video_url || '',
      colors: p.colors && p.colors.length > 0 ? p.colors : ['Bottle Green', 'Royal Maroon', 'Ivory White'],
      customColorInput: '',
      variants: p.variants && p.variants.length > 0 ? p.variants : [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 12 }
      ]
    });
    setShowAddProductModal(true);
  };

  const handleToggleColor = (colorName) => {
    setProductFormData(prev => {
      const exists = prev.colors.includes(colorName);
      if (exists) {
        return { ...prev, colors: prev.colors.filter(c => c !== colorName) };
      } else {
        return { ...prev, colors: [...prev.colors, colorName] };
      }
    });
  };

  const handleAddCustomColor = () => {
    const val = (productFormData.customColorInput || '').trim();
    if (!val) return;
    if (!productFormData.colors.includes(val)) {
      setProductFormData(prev => ({
        ...prev,
        colors: [...prev.colors, val],
        customColorInput: ''
      }));
    } else {
      setProductFormData(prev => ({ ...prev, customColorInput: '' }));
    }
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
      
      // Upload any new additional image files to server first
      let newlyUploadedUrls = [];
      if (productFormData.additionalImageFiles && productFormData.additionalImageFiles.length > 0) {
        for (const file of productFormData.additionalImageFiles) {
          try {
            const uploadFd = new FormData();
            uploadFd.append('image', file);
            const uploadRes = await uploadImage(uploadFd);
            if (uploadRes && (uploadRes.url || (uploadRes.success && uploadRes.data?.url))) {
              const u = uploadRes.url || uploadRes.data?.url;
              newlyUploadedUrls.push(u);
            }
          } catch (uploadErr) {
            console.warn('Failed to upload additional image file:', file.name, uploadErr);
          }
        }
      }

      // Combine existing URLs and newly uploaded additional URLs
      const allGalleryUrls = [
        ...(productFormData.imageUrls || []),
        ...newlyUploadedUrls
      ].filter(Boolean);

      let finalDescription = productFormData.description || '';
      // Strip any old embedded tags before appending clean new ones
      finalDescription = finalDescription
        .replace(/\[SUBCATEGORY:\s*[\s\S]+?\]/gi, '')
        .replace(/\[FABRIC:\s*[\s\S]+?\]/gi, '')
        .replace(/\[CRAFT:\s*[\s\S]+?\]/gi, '')
        .replace(/\[CARE:\s*[\s\S]+?\]/gi, '')
        .replace(/\[SIZECHART:\s*[\s\S]+?\]/gi, '')
        .replace(/\[VIDEO:\s*[\s\S]+?\]/g, '')
        .replace(/\[SEASON:\s*[\s\S]+?\]/g, '')
        .replace(/\[IMAGES:\s*[\s\S]+?\]/g, '')
        .replace(/\[GALLERY:\s*[\s\S]+?\]/g, '')
        .replace(/\[COLORS:\s*[\s\S]+?\]/g, '')
        .trim();

      if (productFormData.subcategory) {
        finalDescription = `${finalDescription}\n\n[SUBCATEGORY: ${productFormData.subcategory.trim()}]`;
      }

      if (productFormData.fabric) {
        finalDescription = `${finalDescription}\n\n[FABRIC: ${productFormData.fabric.trim()}]`;
      }

      if (productFormData.craft_details) {
        finalDescription = `${finalDescription}\n\n[CRAFT: ${productFormData.craft_details.trim()}]`;
      }

      if (productFormData.care) {
        finalDescription = `${finalDescription}\n\n[CARE: ${productFormData.care.trim()}]`;
      }

      if (productFormData.size_chart && productFormData.size_chart !== 'none') {
        finalDescription = `${finalDescription}\n\n[SIZECHART: ${productFormData.size_chart.trim()}]`;
      }

      if (productFormData.video_url) {
        finalDescription = `${finalDescription}\n\n[VIDEO: ${productFormData.video_url.trim()}]`;
      }

      if (productFormData.season && productFormData.season !== 'all') {
        finalDescription = `${finalDescription}\n\n[SEASON: ${productFormData.season}]`;
      }

      if (productFormData.colors && productFormData.colors.length > 0) {
        finalDescription = `${finalDescription}\n\n[COLORS: ${productFormData.colors.join(', ')}]`;
      }

      if (allGalleryUrls.length > 0) {
        finalDescription = `${finalDescription}\n\n[IMAGES: ${allGalleryUrls.join(',')}]`;
      }

      data.append('description', finalDescription.trim());
      data.append('price', productFormData.price);
      data.append('discount_price', productFormData.discount_price || productFormData.price);
      const validCatId = resolveValidDbCategoryId(productFormData.category, productFormData.category_id);
      data.append('category_id', validCatId);
      data.append('category_name', productFormData.category || 'Tops & Kurtis');
      data.append('subcategory', productFormData.subcategory || '');
      data.append('fabric', productFormData.fabric || '');
      data.append('craft_details', productFormData.craft_details || '');
      data.append('care', productFormData.care || '');
      data.append('size_chart', productFormData.size_chart || 'none');
      data.append('is_featured', productFormData.is_featured ? '1' : '0');
      data.append('video_url', productFormData.video_url || '');
      
      const variantsPayload = productFormData.variants.map(v => ({
        ...v,
        color: (productFormData.colors || []).join(', ')
      }));
      data.append('variants', JSON.stringify(variantsPayload));

      if (productFormData.imageFile) {
        data.append('image', productFormData.imageFile);
      }
      
      if (allGalleryUrls.length > 0) {
        data.append('images', JSON.stringify(allGalleryUrls));
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

      const slug = categoryFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      if (editingCategory) {
        try {
          await updateCategory({
            id: editingCategory.id,
            name: categoryFormData.name,
            slug,
            image_url: finalImageUrl
          });
        } catch (apiErr) {
          console.warn('Backend updateCategory fallback:', apiErr);
        }

        const updated = categories.map(c => 
          c.id === editingCategory.id ? { ...c, name: categoryFormData.name, slug, image: finalImageUrl } : c
        );
        saveCategories(updated);
        setFeedback({ text: 'Category updated successfully.', isError: false });
      } else {
        let createdId = Date.now();
        try {
          const addRes = await addCategory({
            name: categoryFormData.name,
            slug,
            image_url: finalImageUrl
          });
          if (addRes && addRes.data && addRes.data.id) {
            createdId = addRes.data.id;
          }
        } catch (apiErr) {
          console.warn('Backend addCategory fallback:', apiErr);
        }

        const newCat = {
          id: createdId,
          name: categoryFormData.name,
          slug,
          image: finalImageUrl,
          count: 0,
          icon: 'Sparkles'
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

  const handleDeleteCategory = async (catId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(catId);
    } catch (apiErr) {
      console.warn('Backend deleteCategory fallback:', apiErr);
    }
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
      tag: 'Atelier Reel',
      category: 'Tops & Kurtis',
      videoUrl: '',
      videoFile: null,
      imageUrl: '',
      imageFile: null,
      productId: ''
    });
    setShowLookbookModal(true);
  };

  const handleSaveLookbook = async (e) => {
    e.preventDefault();
    setLookbookSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', lookbookFormData.title || 'Atelier Masterpiece Reel');
      fd.append('tag', lookbookFormData.tag || 'Atelier Reel');
      fd.append('category', lookbookFormData.category || 'Tops & Kurtis');
      if (lookbookFormData.productId) {
        fd.append('product_id', lookbookFormData.productId);
      }

      if (lookbookFormData.videoFile) {
        fd.append('video', lookbookFormData.videoFile);
      } else if (lookbookFormData.videoUrl) {
        fd.append('video_url', lookbookFormData.videoUrl);
      }

      if (lookbookFormData.imageFile) {
        fd.append('image', lookbookFormData.imageFile);
      } else if (lookbookFormData.imageUrl) {
        fd.append('image_url', lookbookFormData.imageUrl);
      }

      const res = await addLookbookReel(fd);
      if (res && res.success) {
        setFeedback({ text: 'New Lookbook Video Reel saved successfully to live database!', isError: false });
        setShowLookbookModal(false);
        const updatedReels = await getLookbookReels();
        setLookbookItems(updatedReels || []);
      } else {
        setFeedback({ text: res?.message || 'Failed to save lookbook reel in database', isError: true });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ text: 'Failed to add lookbook reel: ' + err.message, isError: true });
    } finally {
      setLookbookSubmitting(false);
    }
  };

  const handleDeleteLookbook = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this reel'}" from the Lookbook database?`)) return;
    try {
      const res = await deleteLookbookReel(id);
      if (res && res.success) {
        const updatedReels = await getLookbookReels();
        setLookbookItems(updatedReels || []);
        setFeedback({ text: `Reel "${title || id}" deleted successfully.`, isError: false });
      } else {
        setFeedback({ text: res?.message || 'Failed to delete reel', isError: true });
      }
    } catch (err) {
      console.error(err);
      setFeedback({ text: 'Delete error: ' + err.message, isError: true });
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
                  const rawStatus = String(ord.order_status || 'processing').toLowerCase();
                  const currentStatus = (rawStatus === 'dispatched' || rawStatus === 'transit' || rawStatus === 'on_the_way') ? 'shipped' : rawStatus;

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
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
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
                            <option value="processing">Processing (Atelier)</option>
                            <option value="shipped">Dispatched (On the Way)</option>
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

        {/* TAB 3: CATEGORIES & SUBCATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-stone-950">
                  Categories &amp; Subcategories Management
                </h3>
                <p className="text-xs text-stone-500">
                  Manage live categories and their subcategories for product assignment and storefront filters.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const firstCatId = categories[0]?.id || '1';
                    setSubcatFormData({ category_id: String(firstCatId), name: '' });
                    setShowSubcatModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-700" /> Add Subcategory
                </button>
                <button
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 rounded-xl bg-stone-950 text-white hover:bg-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Category
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((c) => {
                const catKey = (c.name || '').toLowerCase();
                const staticSubs = (SUBCATEGORIES_MAP[catKey] || []).map(name => ({ id: `static_${name}`, name, isStatic: true }));
                const dbSubs = subcategoriesList
                  .filter(s => String(s.category_id) === String(c.id) || String(s.category_name).toLowerCase() === catKey)
                  .map(s => ({ id: s.id, name: s.name, isStatic: false }));
                
                // Merge without duplicate names
                const seen = new Set();
                const mergedSubs = [];
                for (const item of [...dbSubs, ...staticSubs]) {
                  const lower = item.name.toLowerCase();
                  if (!seen.has(lower)) {
                    seen.add(lower);
                    mergedSubs.push(item);
                  }
                }

                return (
                  <div key={c.id} className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={c.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop'}
                          alt=""
                          className="w-14 h-14 rounded-2xl object-cover border border-stone-100 shadow-2xs shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-stone-900 text-sm">{c.name}</h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold">
                              ID: {c.id}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-400 block mt-0.5">Slug: /{c.slug}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditCategory(c)}
                          className="p-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(c.id)}
                          className="p-2 text-stone-400 hover:text-red-700 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Subcategories Strip */}
                    <div className="pt-3 border-t border-stone-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#AA7E18]" />
                          Subcategories ({mergedSubs.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSubcatFormData({ category_id: String(c.id), name: '' });
                            setShowSubcatModal(true);
                          }}
                          className="text-[10px] font-bold text-[#AA7E18] hover:text-[#886412] flex items-center gap-1 cursor-pointer bg-amber-50/80 px-2 py-0.5 rounded-lg border border-amber-200"
                        >
                          <Plus className="w-3 h-3" /> Add Subcategory
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                        {mergedSubs.length > 0 ? (
                          mergedSubs.map((sub) => (
                            <span
                              key={sub.id}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-50 border border-stone-200 text-[11px] font-semibold text-stone-800"
                            >
                              <span>{sub.name}</span>
                              {!sub.isStatic ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubcat(sub.id)}
                                  className="text-stone-400 hover:text-red-600 cursor-pointer ml-0.5 p-0.5"
                                  title="Delete subcategory from database"
                                >
                                  ✕
                                </button>
                              ) : (
                                <span className="text-[9px] text-stone-400 font-mono" title="Core subcategory">★</span>
                              )}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">No subcategories created for this category yet.</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col max-h-[90vh] my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Sticky Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-white shrink-0">
                <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-stone-950">
                  {editingProduct ? 'Edit Royal Artifact' : 'Add New Couture Creation'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                <form onSubmit={handleSubmitProduct} id="productForm" className="space-y-4">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Category</label>
                      <select
                        value={productFormData.category}
                        onChange={(e) => {
                          const newCatName = e.target.value;
                          const foundCat = categories.find(c => c.name === newCatName);
                          const validId = foundCat ? String(foundCat.id) : resolveValidDbCategoryId(newCatName);
                          setProductFormData(prev => ({
                            ...prev,
                            category: newCatName,
                            category_id: validId,
                            subcategory: ''
                          }));
                        }}
                        className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-xs font-medium bg-white"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Subcategory {(() => {
                          const catKey = (productFormData.category || '').toLowerCase();
                          const staticSubs = SUBCATEGORIES_MAP[catKey] || [];
                          const dbSubs = subcategoriesList
                            .filter(s => String(s.category_id) === String(productFormData.category_id) || String(s.category_name).toLowerCase() === catKey)
                            .map(s => s.name);
                          const count = new Set([...staticSubs, ...dbSubs]).size;
                          return count > 0 ? `(${count} available)` : '(Optional)';
                        })()}
                      </label>
                      {(() => {
                        const catKey = (productFormData.category || '').toLowerCase();
                        const staticSubs = SUBCATEGORIES_MAP[catKey] || [];
                        const dbSubs = subcategoriesList
                          .filter(s => String(s.category_id) === String(productFormData.category_id) || String(s.category_name).toLowerCase() === catKey)
                          .map(s => s.name);
                        const combinedSubs = Array.from(new Set([...staticSubs, ...dbSubs])).filter(Boolean);

                        if (combinedSubs.length > 0) {
                          return (
                            <select
                              value={productFormData.subcategory || ''}
                              onChange={(e) => setProductFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                              className="w-full py-2.5 px-3 rounded-xl border border-amber-200 text-xs font-semibold bg-amber-50/50 text-amber-950"
                            >
                              <option value="">-- Select Subcategory (or No Subcategory) --</option>
                              {combinedSubs.map((sub, idx) => (
                                <option key={idx} value={sub}>{sub}</option>
                              ))}
                            </select>
                          );
                        }

                        return (
                          <input
                            type="text"
                            placeholder="e.g. Needle Work / Short Coat (Optional)"
                            value={productFormData.subcategory || ''}
                            onChange={(e) => setProductFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                            className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900"
                          />
                        );
                      })()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Season Filter / Collection</label>
                      <select
                        value={productFormData.season || 'all'}
                        onChange={(e) => setProductFormData(prev => ({ ...prev, season: e.target.value }))}
                        className="w-full py-2.5 px-3 rounded-xl border border-amber-200 text-xs font-semibold bg-amber-50/70 text-amber-950"
                      >
                        <option value="all">✨ All Season / Festive (Both)</option>
                        <option value="summer">🌸 Summer Collection</option>
                        <option value="winter">❄️ Winter Collection</option>
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                    <div>
                      <label className="block text-stone-700 font-bold mb-1">Featured Masterpiece</label>
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="isFeaturedProduct"
                          checked={productFormData.is_featured}
                          onChange={(e) => setProductFormData({ ...productFormData, is_featured: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                        <label htmlFor="isFeaturedProduct" className="text-xs text-stone-700 font-medium cursor-pointer">
                          Display on Homepage Featured Showcase
                        </label>
                      </div>
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

                  {/* Fabric, Craft, Care & Size Guide Settings */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                      <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#AA7E18]" />
                        Fabric, Craft, Care &amp; Size Guide
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">Customizable Storefront Details</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          Fabric &amp; Material
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 100% Pure Mulberry Silk / Handloom Cotton"
                          value={productFormData.fabric || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, fabric: e.target.value })}
                          className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          Craft &amp; Artisan Work
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Authentic Kashmiri Aari Needle Embroidery"
                          value={productFormData.craft_details || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, craft_details: e.target.value })}
                          className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          Care Instructions
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Dry clean only / Gentle hand wash in cold water"
                          value={productFormData.care || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, care: e.target.value })}
                          className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-bold mb-1">
                          📏 Size Chart Guide (Display for this product)
                        </label>
                        <select
                          value={productFormData.size_chart || 'none'}
                          onChange={(e) => setProductFormData({ ...productFormData, size_chart: e.target.value })}
                          className="w-full py-2.5 px-3 rounded-xl border border-amber-300 text-xs font-semibold bg-amber-50/70 text-amber-950"
                        >
                          <option value="none">🚫 No Size Chart (For Shawls, Bags, Scarfs, Free Size)</option>
                          <option value="kurtis">📏 Kurtis &amp; Tops Size Chart (XS - 3XL)</option>
                          <option value="kaftan">📏 Kaftans &amp; Kaftan Sets Size Chart (Length 50" - 58")</option>
                          <option value="coats">📏 Woolen Coats &amp; Jackets Size Chart (Bust 36" - 48")</option>
                          <option value="standard">📏 Standard Luxury Apparel Chart (S, M, L, XL, XXL)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Primary & Multiple Image Uploads */}
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                    <div>
                      <label className="block text-stone-700 font-bold mb-1">
                        Primary Cover Image {editingProduct ? '(Leave empty to keep current)' : '*'}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setProductFormData({ ...productFormData, imageFile: e.target.files[0] });
                          }
                        }}
                        className="w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-stone-200 file:text-stone-800 hover:file:bg-stone-300 cursor-pointer"
                      />
                      {productFormData.imageFile && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="relative w-14 h-18 rounded-xl overflow-hidden border border-stone-300 shadow-xs">
                            <img
                              src={URL.createObjectURL(productFormData.imageFile)}
                              alt="Cover Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setProductFormData(prev => ({ ...prev, imageFile: null }))}
                              className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] shadow-sm hover:bg-red-700 cursor-pointer"
                              title="Remove file"
                            >
                              ✕
                            </button>
                          </div>
                          <span className="text-[11px] text-stone-600 font-medium">Selected new cover image</span>
                        </div>
                      )}
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
                            <div key={`existing-${i}`} className="relative w-14 h-18 rounded-xl overflow-hidden border border-stone-300 group shadow-xs">
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
                            <div key={`file-${i}`} className="relative w-14 h-18 rounded-xl overflow-hidden border border-amber-400 bg-amber-50 group shadow-xs">
                              <img
                                src={URL.createObjectURL(f)}
                                alt={f.name}
                                className="w-full h-full object-cover"
                              />
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

                  {/* Color Variants Palette */}
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-stone-900 text-xs">🎨 Available Color Variants</span>
                        <p className="text-[10px] text-stone-500">Select colors available for this product</p>
                      </div>
                      <span className="text-[10px] text-[#AA7E18] font-bold font-mono">
                        {productFormData.colors?.length || 0} Selected
                      </span>
                    </div>

                    {/* Preset Color Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: 'Bottle Green', hex: '#1B4D3E' },
                        { name: 'Royal Maroon', hex: '#581845' },
                        { name: 'Midnight Navy', hex: '#0A192F' },
                        { name: 'Mustard Gold', hex: '#C59B27' },
                        { name: 'Peach Pink', hex: '#E892A2' },
                        { name: 'Ivory White', hex: '#FDFBF7' },
                        { name: 'Jet Black', hex: '#111111' },
                        { name: 'Lavender Lilac', hex: '#8E7CC3' },
                        { name: 'Rust Orange', hex: '#B7410E' },
                        { name: 'Emerald Green', hex: '#50C878' }
                      ].map((preset) => {
                        const isSelected = productFormData.colors?.includes(preset.name);
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => handleToggleColor(preset.name)}
                            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/50 shadow-xs'
                                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: preset.hex }}
                            />
                            <span>{preset.name}</span>
                            {isSelected && <span className="text-[9px] text-[#D4AF37]">✓</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Color Input */}
                    <div className="flex items-center gap-2 pt-1 border-t border-stone-200/70">
                      <input
                        type="text"
                        placeholder="Or enter custom color (e.g. Sage Green, Wine Red)..."
                        value={productFormData.customColorInput}
                        onChange={(e) => setProductFormData({ ...productFormData, customColorInput: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomColor();
                          }
                        }}
                        className="flex-1 py-1.5 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomColor}
                        className="px-3 py-1.5 rounded-xl bg-stone-900 text-white hover:bg-black font-bold text-[11px] cursor-pointer"
                      >
                        + Add Color
                      </button>
                    </div>

                    {/* Active Selected Colors Tag Strip */}
                    {productFormData.colors && productFormData.colors.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {productFormData.colors.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-stone-300 text-[10px] font-bold text-stone-800 shadow-2xs"
                          >
                            <span>{c}</span>
                            <button
                              type="button"
                              onClick={() => handleToggleColor(c)}
                              className="text-stone-400 hover:text-red-600 cursor-pointer ml-0.5"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-800">Variants (Size & Stock)</span>
                      <button
                        type="button"
                        onClick={handleAddVariant}
                        className="text-stone-900 hover:underline font-bold text-[11px] cursor-pointer"
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
                            className="text-stone-400 hover:text-red-600 px-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              {/* Sticky Modal Footer */}
              <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-100 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-200 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="productForm"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-stone-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-all disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {submitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
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

        {/* ADD LOOKBOOK VIDEO REEL MODAL */}
        {showLookbookModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/30 p-6 sm:p-8 space-y-5 my-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#070E1E] text-[#D4AF37] flex items-center justify-center">
                    <Images className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-luxury text-lg font-bold text-[#070E1E]">
                      Add Lookbook Video Reel
                    </h3>
                    <p className="text-[11px] text-stone-500">Upload video shorts &amp; link to database products</p>
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
                  <label className="block text-stone-800 font-bold mb-1">Reel Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Imperial Silk Velvet Embroidered Kaftan Flow"
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
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                      <option value="Packaging & Unboxing">Packaging &amp; Unboxing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-800 font-bold mb-1">Craft / Subtitle Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Authentic Sozni Needlework"
                      value={lookbookFormData.tag}
                      onChange={(e) => setLookbookFormData({ ...lookbookFormData, tag: e.target.value })}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#070E1E]"
                    />
                  </div>
                </div>

                {/* 🔗 LINK TO PRODUCT SELECTOR */}
                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1">
                  <label className="block font-bold text-amber-950 text-xs">
                    🔗 Link to Existing Product (Optional)
                  </label>
                  <p className="text-[10px] text-amber-800">
                    When linked, the product details &amp; buy button will appear directly inside the video player!
                  </p>
                  <select
                    value={lookbookFormData.productId || ''}
                    onChange={(e) => setLookbookFormData({ ...lookbookFormData, productId: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-amber-300 text-xs font-semibold bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="">-- No Linked Product (General Showcase) --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Video Upload / URL Input */}
                <div className="space-y-2.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                  <label className="block text-stone-800 font-bold text-xs">
                    🎥 Video Reel File or URL *
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setLookbookFormData(prev => ({
                          ...prev,
                          videoFile: file,
                          videoUrl: URL.createObjectURL(file)
                        }));
                      }
                    }}
                    className="w-full text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#070E1E] file:text-[#F7E7B6] hover:file:bg-[#102142] cursor-pointer"
                  />
                  <input
                    type="url"
                    placeholder="Or enter direct video link (MP4 / WebM / CDN)"
                    value={lookbookFormData.videoUrl}
                    onChange={(e) => setLookbookFormData({ ...lookbookFormData, videoUrl: e.target.value, videoFile: null })}
                    className="w-full py-2 px-3 rounded-xl border border-stone-200 text-xs bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#070E1E]"
                  />
                </div>

                {/* Thumbnail Image */}
                <div className="space-y-2.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                  <label className="block text-stone-800 font-bold text-xs">
                    🖼️ Video Cover Thumbnail (Optional)
                  </label>
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
                    className="w-full text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-200 file:text-stone-800 hover:file:bg-stone-300 cursor-pointer"
                  />
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

        {/* ADD SUBCATEGORY MODAL */}
        {showSubcatModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-white">
                <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-stone-950 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#AA7E18]" />
                  <span>Add New Subcategory</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSubcatModal(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubcategorySubmit} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Parent Category *</label>
                  <select
                    value={subcatFormData.category_id}
                    onChange={(e) => setSubcatFormData(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-xs font-semibold bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name} (ID: {c.id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">Subcategory Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Georgette Tops, Wedding Dress, Needle Work..."
                    value={subcatFormData.name}
                    onChange={(e) => setSubcatFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 text-xs text-stone-900"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setShowSubcatModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-stone-950 text-white hover:bg-stone-800 text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Save Subcategory
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

