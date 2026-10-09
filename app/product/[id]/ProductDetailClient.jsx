'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Star, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp,
  Share2, 
  Check, 
  Clock, 
  Play, 
  Zap, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  Image as ImageIcon, 
  Ruler,
  HelpCircle,
  Globe2,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductById, getProducts, getLookbookReels } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailClient({ 
  initialProduct = null, 
  initialAllProducts = [], 
  initialLookbook = [],
  productId
}) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(initialProduct);
  const [allProducts, setAllProducts] = useState(initialAllProducts || []);
  const [videoProducts, setVideoProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedImage, setSelectedImage] = useState(initialProduct?.image || '');
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video'
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Luxury Accordion State - Keeps content clean & unobtrusive for buyers, 100% crawlable for Google
  const [openAccordion, setOpenAccordion] = useState('specs'); // 'specs' | 'craft' | 'care' | 'shipping' | 'faq' | 'wholesale'

  // Size Chart Guide Modal State
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeChartUnit, setSizeChartUnit] = useState('in'); // 'in' | 'cm'
  const [sizeModalTab, setSizeModalTab] = useState('chart'); // 'chart' | 'measure'

  // Mini Floating Video Screen & Fullscreen Reel Viewer
  const [showFullscreenReel, setShowFullscreenReel] = useState(false);
  const [activeReelIdx, setActiveReelIdx] = useState(0);
  const [isReelMuted, setIsReelMuted] = useState(true);
  const [isFloatingReelDismissed, setIsFloatingReelDismissed] = useState(false);

  // Sync / Hydrate client state
  useEffect(() => {
    async function load() {
      if (initialProduct && initialAllProducts?.length > 0) {
        setupProducts(initialProduct, initialAllProducts, initialLookbook);
        setLoading(false);
        return;
      }

      if (!productId) return;
      setLoading(true);
      try {
        const [item, all, lookbook] = await Promise.all([
          getProductById(productId),
          getProducts(),
          getLookbookReels()
        ]);
        setupProducts(item, all, lookbook);
      } catch (e) {
        console.error('Failed to load product detail', e);
      } finally {
        setLoading(false);
      }
    }

    function setupProducts(item, all, lookbook) {
      if (item && !item.video_url && Array.isArray(lookbook)) {
        const linkedReel = lookbook.find(r => 
          (r.productId && String(r.productId) === String(item.id)) ||
          (r.product_id && String(r.product_id) === String(item.id)) ||
          (r.title && item.title && r.title.toLowerCase().trim() === item.title.toLowerCase().trim())
        );
        if (linkedReel && (linkedReel.videoUrl || linkedReel.video_url || linkedReel.video)) {
          item.video_url = linkedReel.videoUrl || linkedReel.video_url || linkedReel.video;
        }
      }

      setProduct(item);
      setAllProducts(all || []);

      if (item) {
        setSelectedImage(item.image);
        setMediaType('image');
        if (item.colors && item.colors[0]) {
          setSelectedColor(item.colors[0]);
        }
        if (item.variants && item.variants[0]) {
          setSelectedSize(item.variants[0].size);
        }
      }

      const vProds = (all || []).filter(p => p.video_url);
      if (item?.video_url && !vProds.some(p => p.id === item.id)) {
        vProds.unshift(item);
      }
      setVideoProducts(vProds);

      const currIdx = vProds.findIndex(p => String(p.id) === String(productId));
      setActiveReelIdx(currIdx >= 0 ? currIdx : 0);

      // Related products filtered by same category or remaining catalog
      const sameCategory = (all || []).filter(p => String(p.id) !== String(productId) && p.category === item?.category);
      const remaining = (all || []).filter(p => String(p.id) !== String(productId) && p.category !== item?.category);
      setRelatedProducts([...sameCategory, ...remaining].slice(0, 4));
    }

    load();
  }, [productId, initialProduct, initialAllProducts, initialLookbook]);

  // Keyboard navigation for fullscreen reel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showFullscreenReel || videoProducts.length === 0) return;
      if (e.key === 'ArrowRight') {
        setActiveReelIdx((prev) => (prev + 1) % videoProducts.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveReelIdx((prev) => (prev - 1 + videoProducts.length) % videoProducts.length);
      } else if (e.key === 'Escape') {
        setShowFullscreenReel(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showFullscreenReel, videoProducts]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-3 border-stone-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500 font-serif-luxury">Retrieving handcrafted Kashmiri masterpiece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif-luxury text-2xl font-bold text-stone-900">Creation Not Found</h2>
        <Link href="/shop" className="text-stone-900 font-semibold underline text-xs">
          Return to All Collections
        </Link>
      </div>
    );
  }

  const price = Number(product.price) || 999;
  const discountPrice = Number(product.discount_price) || price;
  const hasDiscount = discountPrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity, false);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  // Primary Strategic Export Markets (Dubai Main Hub, USA, Europe, Canada, GCC)
  const primaryExportHubs = [
    { name: 'Dubai & UAE (Main Global Hub)', slug: 'uae', flag: '🇦🇪', highlight: true, note: '3-Day Express Air Cargo' },
    { name: 'United States of America', slug: 'usa', flag: '🇺🇸', highlight: true, note: 'DHL/FedEx Doorstep (CA, NY, TX)' },
    { name: 'United Kingdom', slug: 'uk', flag: '🇬🇧', highlight: true, note: 'London & Manchester (4-5 Days)' },
    { name: 'Canada', slug: 'canada', flag: '🇨🇦', highlight: false, note: 'Toronto & Vancouver Express' },
    { name: 'Germany', slug: 'germany', flag: '🇩🇪', highlight: false, note: 'EU REACH Azo-Free Certified' },
    { name: 'France (Paris)', slug: 'france', flag: '🇫🇷', highlight: false, note: 'Couture Needlework Line' },
    { name: 'Switzerland', slug: 'switzerland', flag: '🇨🇭', highlight: false, note: 'Artisanal Heritage Line' },
    { name: 'Netherlands', slug: 'netherlands', flag: '🇳🇱', highlight: false, note: 'Amsterdam Doorstep Cargo' },
    { name: 'Saudi Arabia', slug: 'saudi-arabia', flag: '🇸🇦', highlight: false, note: 'Riyadh & Jeddah Modest Sets' },
    { name: 'Australia', slug: 'australia', flag: '🇦🇺', highlight: false, note: 'Sydney & Melbourne Delivery' }
  ];

  // Secondary Pan-India Wholesale Hubs (Kept subtle for crawlability without buyer distraction)
  const subtleIndiaHubs = [
    { name: 'Delhi NCR', slug: 'delhi' },
    { name: 'Mumbai', slug: 'mumbai' },
    { name: 'Bengaluru', slug: 'bengaluru' },
    { name: 'Hyderabad', slug: 'hyderabad' },
    { name: 'Kolkata', slug: 'kolkata' },
    { name: 'Surat', slug: 'surat' },
    { name: 'Jaipur', slug: 'jaipur' },
    { name: 'Ahmedabad', slug: 'ahmedabad' },
    { name: 'Lucknow', slug: 'lucknow' },
    { name: 'Pune', slug: 'pune' },
    { name: 'Chandigarh', slug: 'chandigarh' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16 pb-24 lg:pb-12">
      {/* Breadcrumb Path - Semantic Interlinking Hierarchy */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-stone-500 overflow-x-auto pb-1 scrollbar-none">
        <Link href="/" className="hover:text-stone-950 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <Link href="/shop" className="hover:text-stone-950 transition-colors">Shop All</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <Link href={`/shop?category=${encodeURIComponent(product.category || 'All')}`} className="hover:text-stone-950 transition-colors font-medium">
          {product.category || 'Atelier Collection'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span className="text-stone-950 font-bold truncate max-w-[220px]">{product.title}</span>
      </nav>

      {/* Main Product Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Left: Gallery Column */}
        <div className="space-y-4 lg:sticky lg:top-28">
          {/* Main Display: Image or Video Player (Strict 3:4 Aspect Ratio) */}
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-stone-900 border border-stone-200/80 shadow-md flex items-center justify-center">
            {mediaType === 'video' && product.video_url ? (
              <div className="w-full h-full relative bg-black flex items-center justify-center">
                <video
                  src={product.video_url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setMediaType('image')}
                  className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-[11px] font-bold rounded-full flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Back to Photos</span>
                </button>
              </div>
            ) : (
              <img
                src={selectedImage || product.image}
                alt={`${product.title} - Handcrafted Kashmiri Pure Cotton Kurti & Couture by Al Hayy International`}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
            )}

            {mediaType === 'image' && hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-stone-950 text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-md">
                Sale • {discountPercent}% OFF
              </span>
            )}

            {product.video_url && mediaType === 'image' && (
              <button
                onClick={() => setMediaType('video')}
                className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-[#070E1E]/90 hover:bg-[#070E1E] text-[#D4AF37] border border-[#D4AF37]/40 shadow-xl backdrop-blur-md text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-[#D4AF37]" />
                <span>Watch Atelier Video</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md transition-all active:scale-90 cursor-pointer"
              title="Share Creation"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImage(img);
                    setMediaType('image');
                  }}
                  className={`relative w-20 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    mediaType === 'image' && selectedImage === img
                      ? 'border-[#AA7E18] ring-2 ring-[#AA7E18]/30 scale-102'
                      : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}

              {product.video_url && (
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`relative w-20 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-stone-900 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    mediaType === 'video'
                      ? 'border-[#AA7E18] ring-2 ring-[#AA7E18]/30 scale-102'
                      : 'border-stone-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <Play className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-[9px] font-bold text-stone-200 uppercase tracking-wider">Video</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right: Details, Ordering & Sleek Accordions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="uppercase tracking-widest font-bold text-[#AA7E18]">
                {product.category || 'Atelier Collection'}
              </span>
              <div className="flex items-center gap-1 text-amber-700 font-semibold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="font-bold text-sm">{product.rating || '4.9'}</span>
                <span className="text-stone-400">({product.reviews_count || 28} atelier reviews)</span>
              </div>
            </div>

            <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-stone-950 leading-tight">
              {product.title}
            </h1>

            {/* Price Row with SKU & Stock Status for Rich Results */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-bold text-stone-950 font-sans">
                ₹{discountPrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-base text-stone-400 line-through">
                  ₹{price.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-[11px] px-2.5 py-0.5 bg-[#D4AF37]/15 text-[#AA7E18] font-bold rounded-md border border-[#D4AF37]/30">
                Inclusive of all taxes
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold ml-auto flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                In Stock &amp; Ready to Ship
              </span>
            </div>
          </div>

          {/* Editorial Product Description Hook */}
          <div className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
            <p>{product.description}</p>
          </div>

          {/* Kashmiri Heritage Banner */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5D9C8] flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#070E1E] text-[#F7E7B6] flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
                72h
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-950 uppercase tracking-wide">
                  Authentic Kashmiri Handcraft
                </h4>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  {product.craft_details || 'Hand-embroidered needlecraft by Srinagar artisans. 100% natural fiber weave.'}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-wider font-bold text-[#AA7E18] bg-white px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
              Srinagar Guild
            </span>
          </div>

          {/* Variant: Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">
                  Select Shade: <span className="text-[#AA7E18] font-semibold">{selectedColor}</span>
                </span>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">
                  {product.colors.length} Available
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.colors.map((clr) => {
                  const isSelected = selectedColor === clr;
                  return (
                    <button
                      key={clr}
                      type="button"
                      onClick={() => setSelectedColor(clr)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/60 shadow-md ring-1 ring-[#D4AF37]/40 scale-102'
                          : 'bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-stone-300'
                      }`}
                    >
                      <span>{clr}</span>
                      {isSelected && <Check className="w-3 h-3 text-[#D4AF37]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variant: Size Selector + Size Guide */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-900">
                Garment Size: <span className="text-[#AA7E18] font-semibold">{selectedSize}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-stone-900 hover:text-black font-semibold text-xs flex items-center gap-1.5 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900 transition-all cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5 text-stone-600" />
                <span>Size Chart &amp; Fit Guide</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(product.variants && product.variants.length > 0
                ? product.variants.map((v) => v.size)
                : ['S', 'M', 'L', 'XL', 'XXL']
              ).map((sz) => {
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`h-11 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-950 text-white shadow-md scale-102 ring-2 ring-stone-950'
                        : 'bg-stone-50 border border-stone-200 text-stone-800 hover:bg-stone-100 hover:border-stone-400'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row: Quantity + Add to Bag + Buy Now */}
          <div className="space-y-3 pt-3">
            <div className="flex items-center gap-3">
              {/* Quantity Picker */}
              <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-3 text-stone-600 hover:bg-stone-200 font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 font-bold text-stone-900 font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-3 text-stone-600 hover:bg-stone-200 font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-95 cursor-pointer ${
                  added
                    ? 'bg-[#AA7E18] text-white shadow-xl'
                    : 'bg-stone-900 text-stone-100 hover:bg-black border border-stone-700'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              {/* Instant Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-4 px-5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-[#070E1E] text-[#F7E7B6] hover:bg-[#102142] border border-[#D4AF37]/60 shadow-xl transition-all transform active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                <span>Buy Now • ₹{(discountPrice * quantity).toLocaleString('en-IN')}</span>
              </button>
            </div>
          </div>

          {/* 
            ========================================================================
            LUXURY MINIMALIST ACCORDIONS (THE SECRET TO RICH SEO WITHOUT "INFORMATIVE SITE" CLUTTER)
            Users see clean, elegant 1-line rows. Googlebot parses full rich text & keywords!
            ========================================================================
          */}
          <div className="pt-6 border-t border-stone-200 divide-y divide-stone-200 text-xs">
            {/* Accordion 1: Fabric & Craftsmanship Specs */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => toggleAccordion('specs')}
                className="w-full flex items-center justify-between text-left text-stone-900 font-bold tracking-wide uppercase text-xs hover:text-[#AA7E18] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#AA7E18]" />
                  <span>Fabric &amp; Artisan Specifications</span>
                </span>
                {openAccordion === 'specs' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </button>

              {openAccordion === 'specs' && (
                <div className="mt-3.5 space-y-2.5 text-stone-600 pl-5 pr-1 animate-in fade-in duration-200 leading-relaxed font-light">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/60">
                      <strong className="text-stone-900 block font-semibold">Fabric Type:</strong>
                      <span>{product.fabric || '100% Pure Combed Cotton / Kashmiri Handloom Silk Blend'}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/60">
                      <strong className="text-stone-900 block font-semibold">Embroidery Style:</strong>
                      <span>{product.craft_details || 'Authentic Aari Needlework by Srinagar Artisans'}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/60">
                      <strong className="text-stone-900 block font-semibold">Weave &amp; Breathability:</strong>
                      <span>60s Count Combed Lightweight &amp; All-Season Breathable</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/60">
                      <strong className="text-stone-900 block font-semibold">Atelier Origin:</strong>
                      <span>Direct from Srinagar, Kashmir Factory Guild</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Care & Preservation */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => toggleAccordion('care')}
                className="w-full flex items-center justify-between text-left text-stone-900 font-bold tracking-wide uppercase text-xs hover:text-[#AA7E18] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-[#AA7E18]" />
                  <span>Care &amp; Textile Preservation</span>
                </span>
                {openAccordion === 'care' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </button>

              {openAccordion === 'care' && (
                <div className="mt-3.5 space-y-2 text-stone-600 pl-5 pr-1 animate-in fade-in duration-200 text-[11px] leading-relaxed">
                  <p className="font-medium text-stone-900">{product.care || 'Gentle hand wash in cold water with mild detergent or premium dry clean.'}</p>
                  <ul className="list-disc pl-4 space-y-1 text-stone-500">
                    <li>Do not bleach, wring, or soak handcrafted needlework for prolonged durations.</li>
                    <li>Warm iron exclusively on reverse side to safeguard fine thread work.</li>
                    <li>Store in breathable cotton pouch provided with your packaging box.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Accordion 3: Express Insured Shipping & Return Guarantee */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => toggleAccordion('shipping')}
                className="w-full flex items-center justify-between text-left text-stone-900 font-bold tracking-wide uppercase text-xs hover:text-[#AA7E18] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[#AA7E18]" />
                  <span>Delivery, Packaging &amp; 7-Day Exchange</span>
                </span>
                {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </button>

              {openAccordion === 'shipping' && (
                <div className="mt-3.5 space-y-2 text-stone-600 pl-5 pr-1 animate-in fade-in duration-200 text-[11px] leading-relaxed">
                  <p>• <strong>Pan-India Express Shipping:</strong> 100% Free delivery on all prepaid orders. Dispatched in 24-48 hours via premium air cargo.</p>
                  <p>• <strong>Signature Keepsake Presentation:</strong> Arrives enclosed in our royal midnight navy rigid box tied with silk ribbon.</p>
                  <p>• <strong>Hassle-Free 7-Day Exchange:</strong> Need a different size or fit? Our atelier concierge handles prompt reverse pickup &amp; exchange.</p>
                  <p>• <strong>Global Deliveries:</strong> Express international transit to UAE, USA, UK, Canada &amp; Europe with door-to-door tracking.</p>
                </div>
              )}
            </div>

            {/* Accordion 4: Frequently Asked Questions (FAQ) - Google FAQ Schema Indexed */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => toggleAccordion('faq')}
                className="w-full flex items-center justify-between text-left text-stone-900 font-bold tracking-wide uppercase text-xs hover:text-[#AA7E18] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-[#AA7E18]" />
                  <span>Frequently Asked Questions (FAQ)</span>
                </span>
                {openAccordion === 'faq' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </button>

              {openAccordion === 'faq' && (
                <div className="mt-3.5 space-y-3 text-stone-600 pl-5 pr-1 animate-in fade-in duration-200 text-[11px] leading-relaxed">
                  <div>
                    <h5 className="font-bold text-stone-900">Q: Is the embroidery real Kashmiri needlework or computer print?</h5>
                    <p className="mt-0.5 text-stone-600">A: Every Al Hayy International creation is crafted with authentic Kashmiri Aari needlework. No synthetic or digital print copies are used.</p>
                  </div>
                  <div className="pt-2 border-t border-stone-100">
                    <h5 className="font-bold text-stone-900">Q: Can I order in wholesale or customized bulk quantity?</h5>
                    <p className="mt-0.5 text-stone-600">A: Yes! As direct factory manufacturers in Srinagar, we supply boutiques across India (Delhi, Mumbai, Bengaluru, Hyderabad, Surat, Jaipur) and export to Dubai UAE, US &amp; UK at wholesale factory rates with low MOQs.</p>
                  </div>
                  <div className="pt-2 border-t border-stone-100">
                    <h5 className="font-bold text-stone-900">Q: How do I know my exact size?</h5>
                    <p className="mt-0.5 text-stone-600">A: Tap our &apos;Size Chart &amp; Fit Guide&apos; button above to view precise bust, waist, and length measurements in inches and cm. You can also message our WhatsApp concierge for custom tailoring advice.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 5: Dubai, American & European Global Export Desk */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => toggleAccordion('wholesale')}
                className="w-full flex items-center justify-between text-left text-stone-900 font-bold tracking-wide uppercase text-xs hover:text-[#AA7E18] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Globe2 className="w-3.5 h-3.5 text-[#AA7E18]" />
                  <span>Dubai, American &amp; European Global Export Desk</span>
                </span>
                {openAccordion === 'wholesale' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </button>

              {openAccordion === 'wholesale' && (
                <div className="mt-3.5 space-y-3 text-stone-600 pl-5 pr-1 animate-in fade-in duration-200 text-[11px] leading-relaxed">
                  <div className="p-3 rounded-xl bg-[#070E1E] text-white border border-[#D4AF37]/50 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[#F7E7B6] font-bold text-xs flex items-center gap-1.5">
                        <span>🇦🇪</span>
                        <span>Dubai (UAE) • Flagship Middle East Hub</span>
                      </span>
                      <span className="text-[10px] bg-[#D4AF37] text-[#070E1E] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        3-Day Air Cargo
                      </span>
                    </div>
                    <p className="text-stone-300 text-[11px]">
                      Direct factory supply for boutiques in Dubai, Abu Dhabi, Sharjah &amp; GCC. Zero-customs assistance, fast air courier clearance &amp; direct AED billing.
                    </p>
                  </div>

                  <p>
                    We provide direct door-to-door air freight to boutique owners across the <strong>United States (California, NY, Texas, Chicago)</strong>, <strong>Canada (Toronto, Vancouver)</strong>, <strong>United Kingdom (London, Manchester)</strong>, and <strong>Western Europe (France, Germany, Netherlands, Switzerland)</strong>.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      href="/export/uae"
                      className="px-3 py-1.5 rounded-lg bg-[#070E1E] text-[#F7E7B6] font-bold text-[10px] uppercase tracking-wider hover:bg-[#102142] border border-[#D4AF37]/40 transition-colors flex items-center gap-1"
                    >
                      <span>🇦🇪 Dubai Hub Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href="/export/usa"
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[10px] uppercase tracking-wider transition-colors"
                    >
                      🇺🇸 USA Desk
                    </Link>
                    <Link
                      href="/export/uk"
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[10px] uppercase tracking-wider transition-colors"
                    >
                      🇬🇧 UK &amp; Europe
                    </Link>
                    <a
                      href="https://wa.me/919622480276?text=Hello%20Al%20Hayy%20Export%20Desk,%20I%20am%20an%20international%20boutique%20buyer%20from%20Dubai%20/%20USA%20/%20Europe"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-100 transition-colors"
                    >
                      WhatsApp Global Desk (+91 96224 80276)
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Artisanal Provenance & Royal Packaging Guarantee */}
      <section className="p-6 sm:p-10 rounded-3xl bg-white border border-[#E5D9C8] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#AA7E18]">
              Atelier Provenance &amp; Guarantee
            </span>
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#070E1E] mt-0.5">
              The Al Hayy International Craftsmanship Pledge
            </h3>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-[#070E1E] text-[#F7E7B6] font-mono font-bold text-[11px] border border-[#D4AF37]/40 w-fit">
            Srinagar Master Guild
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5D9C8]/70 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-[#AA7E18]" />
              <span>Iconic Keepsake Presentation</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed font-light">
              Every creation is wrapped in whisper-soft tissue, hand-tied with pure silk ribbon, and delivered in our custom matte Midnight Navy rigid keepsake box with heavy luxury carrier bags.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5D9C8]/70 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-[#AA7E18]" />
              <span>Authentic Aari Needlework</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed font-light">
              100% genuine Kashmiri needlecraft with no synthetic print substitutions. Each stitch is shaped by master artisans upholding centuries of heritage.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5D9C8]/70 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
              <Truck className="w-4 h-4 text-[#AA7E18]" />
              <span>Free Express Insured Dispatch</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed font-light">
              Complimentary expedited air shipping across India on all prepaid orders. Fully insured transit with real-time SMS tracking updates.
            </p>
          </div>
        </div>
      </section>

      {/* Related Creations (Organic Internal Links to Other Products) */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-stone-200">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Curated Ensemble
              </span>
              <h2 className="font-serif-luxury text-2xl font-bold text-stone-900 mt-1">
                You May Also Adore
              </h2>
            </div>
            <Link href="/shop" className="text-xs font-semibold text-stone-900 hover:text-[#AA7E18] transition-colors">
              View All Collections →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {/* 
        ========================================================================
        CURATED ATELIER INDEX & INTERNAL LINKING PILL CLOUD
        (High PageRank internal link flow to Wholesale & Export pages, perfectly styled as luxury brand style tags!)
        ========================================================================
      */}
      <section className="p-6 sm:p-8 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-5">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#AA7E18]">
            Atelier Discoveries &amp; Global Supply Network
          </span>
          <h4 className="font-serif-luxury text-base font-bold text-stone-900">
            Explore Handcrafted Collections &amp; Regional Hubs
          </h4>
        </div>

        {/* Collection Category Tags */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">
            Curated Collections:
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href={`/shop?category=${encodeURIComponent(product.category || 'All')}`}
              className="px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-800 hover:border-[#AA7E18] hover:text-[#AA7E18] transition-colors text-[11px] font-medium"
            >
              All {product.category || 'Atelier'} Styles
            </Link>
            <Link
              href="/shop?category=Tops%20%26%20Kurtis"
              className="px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-800 hover:border-[#AA7E18] hover:text-[#AA7E18] transition-colors text-[11px] font-medium"
            >
              Pure Cotton Kurtis
            </Link>
            <Link
              href="/shop?category=Co-ord%20Sets"
              className="px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-800 hover:border-[#AA7E18] hover:text-[#AA7E18] transition-colors text-[11px] font-medium"
            >
              Designer Co-ord Sets
            </Link>
            <Link
              href="/shop?category=Kaftaan%20%26%20Kaftaan%20Sets"
              className="px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-800 hover:border-[#AA7E18] hover:text-[#AA7E18] transition-colors text-[11px] font-medium"
            >
              Handcrafted Kaftans
            </Link>
            <Link
              href="/lookbook"
              className="px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-800 hover:border-[#AA7E18] hover:text-[#AA7E18] transition-colors text-[11px] font-medium"
            >
              Atelier Video Reels
            </Link>
            <Link
              href="/market-areas"
              className="px-3 py-1.5 rounded-full bg-white border border-[#AA7E18]/40 text-[#AA7E18] font-semibold text-[11px]"
            >
              Market Areas &amp; Supply Index
            </Link>
          </div>
        </div>

        {/* Primary Global Export Gateways: Dubai (Main Hub), USA & Europe */}
        <div className="space-y-3 pt-2 border-t border-stone-200/70">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-[#AA7E18] tracking-wider font-bold flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-[#AA7E18]" />
              <span>International Luxury Export Destinations (Dubai, USA &amp; Europe):</span>
            </span>
            <Link href="/export" className="text-[11px] text-[#AA7E18] font-bold hover:underline">
              View All 20+ Global Markets →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {primaryExportHubs.map((hub) => (
              <Link
                key={hub.slug}
                href={`/export/${hub.slug}`}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between group ${
                  hub.highlight
                    ? 'bg-[#070E1E] text-[#FAF7F2] border-[#D4AF37]/50 shadow-xs hover:border-[#D4AF37]'
                    : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{hub.flag}</span>
                  <div>
                    <span className={`text-xs font-bold block ${hub.highlight ? 'text-[#F7E7B6]' : 'text-stone-900 group-hover:text-[#AA7E18]'}`}>
                      {hub.name}
                    </span>
                    <span className={`text-[10px] block ${hub.highlight ? 'text-stone-300' : 'text-stone-400'}`}>
                      {hub.note}
                    </span>
                  </div>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 ${hub.highlight ? 'text-[#D4AF37]' : 'text-stone-400 group-hover:text-stone-800'}`} />
              </Link>
            ))}
          </div>
        </div>

        {/* Pan-India Domestic Wholesale Archive (Subtle collapsible row for crawlability without buyer distraction) */}
        <div className="pt-2 border-t border-stone-200/50">
          <details className="group">
            <summary className="list-none flex items-center justify-between text-[10px] text-stone-400 hover:text-stone-700 cursor-pointer select-none">
              <span className="font-mono uppercase tracking-wider">
                Pan-India Domestic Wholesale Supply Directory ({subtleIndiaHubs.length}+ Cities)
              </span>
              <span className="text-[#AA7E18] underline">
                View Indian Cities
              </span>
            </summary>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-stone-400 mt-2">
              {subtleIndiaHubs.map((city) => (
                <Link
                  key={city.slug}
                  href={`/wholesale/${city.slug}`}
                  className="hover:text-stone-800 hover:underline transition-colors"
                >
                  {city.name} Kurti Wholesale
                </Link>
              ))}
              <Link href="/wholesale" className="text-[#AA7E18] hover:underline">
                + View Complete Pan-India Hubs →
              </Link>
            </div>
          </details>
        </div>
      </section>

      {/* STICKY BOTTOM MOBILE BUY BAR */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 border-t border-stone-200 shadow-2xl lg:hidden z-30 flex items-center gap-2">
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-3 px-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 ${
            added
              ? 'bg-[#AA7E18] text-white'
              : 'bg-stone-900 text-stone-100'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>

      {/* FLOATING MINI REEL (Bottom Right Floating Reel Widget) */}
      {videoProducts.length > 0 && !isFloatingReelDismissed && (
        <div className="fixed bottom-20 lg:bottom-8 right-4 sm:right-8 z-40 animate-in slide-in-from-bottom-5 duration-300">
          <div 
            onClick={() => {
              const curIdx = videoProducts.findIndex(p => String(p.id) === String(productId));
              setActiveReelIdx(curIdx >= 0 ? curIdx : 0);
              setShowFullscreenReel(true);
            }}
            className="relative group cursor-pointer w-24 sm:w-28 aspect-[9/16] rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl bg-black hover:scale-105 transition-all duration-300 ring-4 ring-[#D4AF37]/20"
            title="Watch Product Reel"
          >
            <video
              src={product?.video_url || videoProducts[0]?.video_url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover pointer-events-none"
            />

            <div className="absolute top-1.5 inset-x-1.5 flex items-center justify-between z-10">
              <span className="flex items-center gap-1 bg-[#070E1E]/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-[9px] font-bold text-[#F7E7B6] border border-[#D4AF37]/40 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Reel
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFloatingReelDismissed(true);
                }}
                className="p-1 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all cursor-pointer"
                title="Dismiss mini reel"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#070E1E]/80 border border-[#D4AF37] flex items-center justify-center text-[#F7E7B6] shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-[#F7E7B6] ml-0.5" />
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-center">
              <span className="text-[10px] font-bold text-white line-clamp-1">
                Watch Video
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN REEL SHOWCASE MODAL WITH ARROW NAVIGATION */}
      {showFullscreenReel && videoProducts.length > 0 && videoProducts[activeReelIdx] && (
        <div 
          className="fixed inset-0 z-[9999] bg-[#070E1E]/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={() => setShowFullscreenReel(false)}
        >
          <div 
            className="relative max-w-lg w-full max-h-[92vh] h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar Controls */}
            <div className="absolute -top-12 inset-x-0 flex items-center justify-between text-white z-50">
              <span className="text-xs font-mono text-[#F7E7B6] font-bold">
                Product Video {activeReelIdx + 1} of {videoProducts.length} • Use ← → Arrow Keys
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsReelMuted(!isReelMuted)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-[#D4AF37]/40 transition-all cursor-pointer"
                  title={isReelMuted ? 'Unmute' : 'Mute'}
                >
                  {isReelMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setShowFullscreenReel(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-[#D4AF37]/40 transition-all cursor-pointer"
                  title="Close Showcase"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Left & Right Arrow Navigation */}
            <button
              onClick={() => setActiveReelIdx((prev) => (prev - 1 + videoProducts.length) % videoProducts.length)}
              className="absolute left-2 sm:-left-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#070E1E]/80 hover:bg-[#D4AF37] hover:text-[#070E1E] text-white border border-[#D4AF37]/50 backdrop-blur-md transition-all cursor-pointer z-50 shadow-xl"
              title="Previous Product (←)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => setActiveReelIdx((prev) => (prev + 1) % videoProducts.length)}
              className="absolute right-2 sm:-right-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#070E1E]/80 hover:bg-[#D4AF37] hover:text-[#070E1E] text-white border border-[#D4AF37]/50 backdrop-blur-md transition-all cursor-pointer z-50 shadow-xl"
              title="Next Product (→)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Video Screen Container */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-2xl bg-black flex items-center justify-center">
              <video
                key={videoProducts[activeReelIdx].video_url}
                src={videoProducts[activeReelIdx].video_url}
                autoPlay
                loop
                playsInline
                muted={isReelMuted}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#070E1E]/95 via-transparent to-transparent pointer-events-none" />

              <div className="absolute inset-x-0 bottom-0 p-5 space-y-3 z-30">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#F7E7B6] bg-[#070E1E]/80 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40 uppercase tracking-widest font-bold inline-block">
                    {videoProducts[activeReelIdx].category || 'Atelier Masterpiece'}
                  </span>
                  <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-white drop-shadow-md">
                    {videoProducts[activeReelIdx].title}
                  </h3>
                </div>

                <div className="p-3 rounded-2xl bg-[#0B162C]/90 backdrop-blur-md border border-[#D4AF37]/50 flex items-center justify-between gap-3 shadow-xl">
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={videoProducts[activeReelIdx].image}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-[#D4AF37]/40 shrink-0"
                    />
                    <div className="truncate text-left">
                      <h4 className="font-serif-luxury text-xs font-bold text-white truncate">
                        {videoProducts[activeReelIdx].title}
                      </h4>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-[#F7E7B6]">
                          ₹{(videoProducts[activeReelIdx].discount_price || videoProducts[activeReelIdx].price).toLocaleString('en-IN')}
                        </span>
                        {videoProducts[activeReelIdx].discount_price && (
                          <span className="text-[10px] text-stone-400 line-through">
                            ₹{videoProducts[activeReelIdx].price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/product/${videoProducts[activeReelIdx].id}`}
                    onClick={() => setShowFullscreenReel(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F7E7B6] text-[#070E1E] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shrink-0 transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-[#070E1E]" />
                    <span>View Product</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIZE & FIT MODAL */}
      {showSizeGuide && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setShowSizeGuide(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h2 className="text-sm font-bold text-stone-900 tracking-wider uppercase">
                SIZE &amp; FIT
              </h2>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="text-stone-700 hover:text-stone-950 p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-8 px-6 border-b border-stone-200 text-xs font-bold tracking-wider uppercase">
              <button
                type="button"
                onClick={() => setSizeModalTab('chart')}
                className={`pb-3 transition-colors relative cursor-pointer ${
                  sizeModalTab === 'chart'
                    ? 'text-stone-950 border-b-2 border-stone-950 -mb-[1px]'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                SIZE CHART
              </button>
              <button
                type="button"
                onClick={() => setSizeModalTab('measure')}
                className={`pb-3 transition-colors relative cursor-pointer ${
                  sizeModalTab === 'measure'
                    ? 'text-stone-950 border-b-2 border-stone-950 -mb-[1px]'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                HOW TO MEASURE
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {sizeModalTab === 'chart' ? (
                <>
                  <div className="flex justify-end">
                    <div className="inline-flex items-center bg-[#D8E1E8] p-0.5 rounded-full text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setSizeChartUnit('in')}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                          sizeChartUnit === 'in'
                            ? 'bg-[#101D30] text-white shadow-xs'
                            : 'text-stone-700 hover:text-stone-950'
                        }`}
                      >
                        INCHES
                      </button>
                      <button
                        type="button"
                        onClick={() => setSizeChartUnit('cm')}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                          sizeChartUnit === 'cm'
                            ? 'bg-[#101D30] text-white shadow-xs'
                            : 'text-stone-700 hover:text-stone-950'
                        }`}
                      >
                        CM
                      </button>
                    </div>
                  </div>

                  {(() => {
                    const isCoat = product?.size_chart === 'coats';
                    const isKaftan = product?.size_chart === 'kaftan';

                    const sizes = isKaftan
                      ? ['Length 50', 'Length 52', 'Length 54', 'Length 56', 'Length 58']
                      : ['S', 'M', 'L', 'XL', 'XXL'];

                    const rows = isKaftan
                      ? [
                          { label: 'Bust (Range)', in: ['36-48', '36-50', '36-52', '38-54', '38-56'], cm: ['91-122', '91-127', '91-132', '96-137', '96-142'] },
                          { label: 'Length', in: ['50', '52', '54', '56', '58'], cm: ['127', '132', '137', '142', '147'] },
                          { label: 'Fit Type', in: ['Free Drop', 'Free Drop', 'Free Drop', 'Floor Fit', 'Royal Floor'], cm: ['Free Drop', 'Free Drop', 'Free Drop', 'Floor Fit', 'Royal Floor'] }
                        ]
                      : isCoat
                      ? [
                          { label: 'Bust', in: [36, 38, 40, 42, 44], cm: [91, 97, 102, 107, 112] },
                          { label: 'Shoulder', in: [15, 15.5, 16, 16.5, 17], cm: [38, 39, 41, 42, 43] },
                          { label: 'Sleeve', in: [22, 22.5, 23, 23.5, 24], cm: [56, 57, 58, 60, 61] },
                          { label: 'Length', in: [42, 42, 44, 44, 46], cm: [107, 107, 112, 112, 117] }
                        ]
                      : [
                          { label: 'Bust', in: [36, 38, 40, 42, 44], cm: [91, 97, 102, 107, 112] },
                          { label: 'Waist', in: [32, 34, 36, 38, 40], cm: [81, 86, 91, 97, 102] },
                          { label: 'Hip', in: [38, 40, 42, 44, 46], cm: [97, 102, 107, 112, 117] },
                          { label: 'Length', in: [42, 42, 43, 43, 44], cm: [107, 107, 109, 109, 112] }
                        ];

                    const activeSizeIndex = sizes.findIndex((s) => 
                      s.toLowerCase().trim() === selectedSize.toLowerCase().trim() ||
                      (selectedSize.startsWith('Length') && s.includes(selectedSize))
                    );
                    const safeIndex = activeSizeIndex >= 0 ? activeSizeIndex : (sizes.includes('M') ? sizes.indexOf('M') : 0);

                    return (
                      <div className="overflow-x-auto">
                        <table className="w-full text-center text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-stone-200 text-stone-900 font-bold">
                              <th className="text-left py-2.5 px-2 font-medium text-stone-500 w-24"></th>
                              {sizes.map((s, idx) => {
                                const isSelected = idx === safeIndex;
                                return (
                                  <th
                                    key={s}
                                    onClick={() => setSelectedSize(s)}
                                    className={`py-2.5 px-3 transition-colors cursor-pointer font-bold ${
                                      isSelected
                                        ? 'bg-[#CBD5E1]/40 text-stone-950'
                                        : 'text-stone-700 hover:text-stone-950'
                                    }`}
                                  >
                                    {s}
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100 text-stone-800">
                            {rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-stone-50/50">
                                <td className="text-left py-3 px-2 font-bold text-stone-900">
                                  {row.label}
                                </td>
                                {sizes.map((s, cIdx) => {
                                  const isSelected = cIdx === safeIndex;
                                  const val = sizeChartUnit === 'in' ? row.in[cIdx] : row.cm[cIdx];
                                  return (
                                    <td
                                      key={cIdx}
                                      onClick={() => setSelectedSize(s)}
                                      className={`py-3 px-3 transition-colors cursor-pointer ${
                                        isSelected
                                          ? 'bg-[#CBD5E1]/40 font-bold text-stone-950'
                                          : 'text-stone-700 hover:text-stone-900'
                                      }`}
                                    >
                                      {val}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}

                  <p className="text-[11px] text-stone-500 font-normal leading-relaxed pt-1">
                    Measurements are &apos;to fit&apos; body sizes. Between sizes? Size up for a relaxed fit.
                  </p>
                </>
              ) : (
                <div className="space-y-4 text-stone-700 text-xs">
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                      <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#101D30] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                        Bust / Chest
                      </span>
                      <p className="text-stone-600 text-[11px] pl-6 leading-relaxed">
                        Measure around the fullest part of your bust, keeping the measuring tape comfortably horizontal and relaxed.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                      <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#101D30] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                        Waist
                      </span>
                      <p className="text-stone-600 text-[11px] pl-6 leading-relaxed">
                        Measure around the narrowest point of your natural waistline, usually right above your belly button.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                      <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#101D30] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                        Hip
                      </span>
                      <p className="text-stone-600 text-[11px] pl-6 leading-relaxed">
                        Stand with feet together and measure around the fullest part of your hips and bottom.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                      <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#101D30] text-white flex items-center justify-center text-[10px] font-bold">4</span>
                        Length
                      </span>
                      <p className="text-stone-600 text-[11px] pl-6 leading-relaxed">
                        Measure vertically from the highest point of the shoulder seam straight down to the bottom hem of the garment.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-stone-700">
                    <strong className="text-amber-950 font-bold">Custom Alterations: </strong>
                    Need special sleeve, bust, or length adjustments? Contact our master atelier team via WhatsApp after placing your order.
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart();
                    setShowSizeGuide(false);
                  }}
                  className="w-full py-3.5 bg-[#101D30] hover:bg-[#1A2E4C] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  ADD TO CART — ₹{discountPrice.toLocaleString('en-IN')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
