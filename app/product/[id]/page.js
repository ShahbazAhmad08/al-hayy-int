'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Share2, 
  Check, 
  Clock,
  Play,
  Video,
  Zap,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Image as ImageIcon,
  Ruler
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductById, getProducts, getLookbookReels } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import SEOStructuredData from '@/components/SEOStructuredData';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [videoProducts, setVideoProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video'
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'care' | 'shipping'
  const [copiedLink, setCopiedLink] = useState(false);

  // Size Chart Guide Modal State
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeChartUnit, setSizeChartUnit] = useState('in'); // 'in' | 'cm'
  const [sizeModalTab, setSizeModalTab] = useState('chart'); // 'chart' | 'measure'

  // Mini Floating Video Screen & Fullscreen Reel Viewer
  const [showFullscreenReel, setShowFullscreenReel] = useState(false);
  const [activeReelIdx, setActiveReelIdx] = useState(0);
  const [isReelMuted, setIsReelMuted] = useState(true);
  const [isFloatingReelDismissed, setIsFloatingReelDismissed] = useState(false);

  useEffect(() => {
    async function load() {
      if (!productId) return;
      setLoading(true);
      try {
        const [item, all, lookbook] = await Promise.all([
          getProductById(productId),
          getProducts(),
          getLookbookReels()
        ]);

        // Link lookbook video reel if item doesn't have video_url
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

        // Build list of all products with video reels for arrow navigation
        const vProds = (all || []).filter(p => p.video_url);
        if (item?.video_url && !vProds.some(p => p.id === item.id)) {
          vProds.unshift(item);
        }
        setVideoProducts(vProds);

        // Find initial index
        const currIdx = vProds.findIndex(p => String(p.id) === String(productId));
        setActiveReelIdx(currIdx >= 0 ? currIdx : 0);

        // Load related items
        setRelatedProducts((all || []).filter(p => String(p.id) !== String(productId)).slice(0, 4));
      } catch (e) {
        console.error('Failed to load product detail', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

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

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: product.category || 'Atelier', url: `/shop?category=${encodeURIComponent(product.category || 'All')}` },
    { name: product.title, url: `/product/${product.id}` }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16 pb-24 lg:pb-12">
      <SEOStructuredData type="Product" data={product} />
      <SEOStructuredData type="BreadcrumbList" data={breadcrumbs} />

      {/* Breadcrumb Path */}
      <nav className="flex items-center space-x-2 text-xs text-stone-500 overflow-x-auto pb-1 scrollbar-none">
        <Link href="/" className="hover:text-stone-950 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <Link href="/shop" className="hover:text-stone-950 transition-colors">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <Link href={`/shop?category=${encodeURIComponent(product.category || 'All')}`} className="hover:text-stone-950 transition-colors">
          {product.category || 'Atelier'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span className="text-stone-950 font-bold truncate max-w-[200px]">{product.title}</span>
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
                alt={product.title}
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
                <span>Watch Fabric Video</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-stone-700 hover:text-stone-950 shadow-sm transition-all cursor-pointer"
              title="Share Creation"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span className="absolute top-16 right-4 px-3 py-1 bg-stone-950 text-white text-xs rounded-lg shadow-lg">
                Link copied!
              </span>
            )}
          </div>

          {/* Thumbnails Strip (Images + Video button) */}
          {((product.images && product.images.length > 1) || product.video_url) && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(img);
                    setMediaType('image');
                  }}
                  className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    mediaType === 'image' && selectedImage === img
                      ? 'border-[#AA7E18] shadow-md scale-102 ring-2 ring-[#AA7E18]/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}

              {/* Video Thumbnail Button if video exists */}
              {product.video_url && (
                <button
                  onClick={() => setMediaType('video')}
                  className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 flex flex-col items-center justify-center bg-[#070E1E] text-white transition-all cursor-pointer ${
                    mediaType === 'video'
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-md'
                      : 'border-transparent opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#070E1E] mb-1 shadow-md">
                    <Play className="w-4 h-4 fill-[#070E1E] ml-0.5" />
                  </div>
                  <span className="text-[10px] font-bold text-[#F7E7B6] uppercase tracking-wider">
                    Video
                  </span>
                </button>
              )}
            </div>
          )}
          {/* Mini Live Video Screen / PiP Reel Box */}
          {product.video_url && (
            <div 
              onClick={() => {
                const idx = videoProducts.findIndex(p => String(p.id) === String(product.id));
                setActiveReelIdx(idx >= 0 ? idx : 0);
                setShowFullscreenReel(true);
              }}
              className="group relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 bg-gradient-to-r from-[#070E1E] to-[#0B162C] text-white shadow-lg p-3 flex items-center justify-between gap-3 transition-all hover:scale-[1.01] hover:border-[#D4AF37] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {/* Mini Playing Screen */}
                <div className="relative w-14 h-18 rounded-xl overflow-hidden bg-black shrink-0 border border-[#D4AF37]/60 shadow-md">
                  <video
                    src={product.video_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors flex items-center justify-center">
                    <Play className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37] drop-shadow-md" />
                  </div>
                </div>

                <div className="text-left space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#F7E7B6] font-bold">
                      Live Atelier Reel
                    </span>
                  </div>
                  <h4 className="font-serif-luxury text-xs sm:text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    Watch Flow &amp; Handcraft Video
                  </h4>
                  <span className="text-[10px] text-stone-300 block">
                    Tap to expand &amp; swipe products with ← → arrows
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-full bg-[#D4AF37] text-[#070E1E] group-hover:scale-110 transition-transform shrink-0 shadow-md">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>

        {/* Right: Details & Actions Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="uppercase tracking-widest font-bold">
                {product.category || 'Atelier Collection'}
              </span>
              <div className="flex items-center gap-1 text-amber-700 font-semibold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="font-bold text-sm">{product.rating || '4.9'}</span>
                <span className="text-stone-400">({product.reviews_count || 28} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-stone-950 leading-tight">
              {product.title}
            </h1>

            {/* Price Row */}
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
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Artisan 72h Badge */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-stone-950 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-xs">
              72h
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-950 uppercase tracking-wide">
                Kashmiri Artisan Handcraft
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {product.craft_details || 'Hand-embroidered with authentic needlework in Srinagar, Kashmir.'}
              </p>
            </div>
          </div>

          {/* Variant: Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">
                  Select Color: <span className="text-[#AA7E18] font-semibold">{selectedColor}</span>
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
                      <span
                        className="w-3 h-3 rounded-full border border-black/15 shadow-2xs shrink-0"
                        style={{
                          backgroundColor:
                            clr.toLowerCase().includes('green') ? '#1B4D3E' :
                            clr.toLowerCase().includes('navy') || clr.toLowerCase().includes('blue') ? '#0A192F' :
                            clr.toLowerCase().includes('maroon') || clr.toLowerCase().includes('wine') || clr.toLowerCase().includes('burgundy') ? '#581845' :
                            clr.toLowerCase().includes('red') ? '#8B0000' :
                            clr.toLowerCase().includes('mustard') || clr.toLowerCase().includes('gold') || clr.toLowerCase().includes('yellow') ? '#C59B27' :
                            clr.toLowerCase().includes('black') ? '#111111' :
                            clr.toLowerCase().includes('white') || clr.toLowerCase().includes('ivory') || clr.toLowerCase().includes('cream') ? '#FDFBF7' :
                            clr.toLowerCase().includes('pink') || clr.toLowerCase().includes('peach') || clr.toLowerCase().includes('rose') ? '#E892A2' :
                            clr.toLowerCase().includes('purple') || clr.toLowerCase().includes('lavender') || clr.toLowerCase().includes('lilac') ? '#8E7CC3' :
                            clr.toLowerCase().includes('rust') || clr.toLowerCase().includes('orange') ? '#B7410E' :
                            clr.toLowerCase().includes('grey') || clr.toLowerCase().includes('gray') ? '#708090' :
                            '#D4AF37'
                        }}
                      />
                      <span>{clr}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variant: Size Selector & Size Chart Guide Button */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800">Choose Size:</span>
                {product.size_chart !== 'none' && (
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[11px] font-bold text-[#AA7E18] hover:text-[#886412] flex items-center gap-1.5 underline underline-offset-4 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5 text-[#AA7E18]" />
                    <span>Size Guide &amp; Fit</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.size}
                    type="button"
                    onClick={() => {
                      setSelectedSize(v.size);
                      if (v.colors && v.colors.length > 0) {
                        setSelectedColor(v.colors[0]);
                      }
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedSize === v.size
                        ? 'bg-stone-950 text-white shadow-md'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons (Desktop) */}
          <div className="hidden lg:block space-y-3 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-3 text-stone-600 hover:bg-stone-200 font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-stone-950 min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-3 text-stone-600 hover:bg-stone-200 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-95 ${
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
                onClick={handleBuyNow}
                className="flex-1 py-4 px-5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 bg-[#070E1E] text-[#F7E7B6] hover:bg-[#102142] border border-[#D4AF37]/60 shadow-xl transition-all transform active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                <span>Buy Now • ₹{(discountPrice * quantity).toLocaleString('en-IN')}</span>
              </button>
            </div>
          </div>

          {/* Tabs / Accordions */}
          <div className="pt-6 border-t border-stone-200 space-y-4">
            <div className="flex border-b border-stone-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-stone-950 text-stone-950'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Fabric &amp; Craft
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'care'
                    ? 'border-stone-950 text-stone-950'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Care Instructions
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-stone-950 text-stone-950'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                Shipping &amp; Returns
              </button>
            </div>

            <div className="text-xs text-stone-600 leading-relaxed">
              {activeTab === 'details' && (
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Fabric Composition</span>
                    <p className="text-xs font-semibold text-stone-900 whitespace-pre-line leading-relaxed">
                      {product.fabric || '100% Pure Kashmiri Handloom / Cotton / Silk'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Artisan &amp; Needlework</span>
                    <p className="text-xs font-semibold text-stone-900 whitespace-pre-line leading-relaxed">
                      {product.craft_details || 'Authentic Kashmiri Aari Needlework & Handcraft'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Provenance &amp; Heritage</span>
                    <p className="text-xs font-semibold text-stone-900">Crafted by Master Artisans in Srinagar, Jammu &amp; Kashmir</p>
                  </div>
                </div>
              )}
              {activeTab === 'care' && (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2.5 text-xs text-stone-700">
                  <p className="font-semibold text-stone-900 whitespace-pre-line leading-relaxed">
                    {product.care || 'Gentle hand wash in cold water or mild dry clean.'}
                  </p>
                  <div className="pt-2 border-t border-stone-200/70 space-y-1 text-stone-600 text-[11px]">
                    <p>• Do not bleach, squeeze or wring the handcrafted fabric.</p>
                    <p>• Warm iron on the reverse side of delicate needlework.</p>
                    <p>• Store in a breathable cotton garment pouch for long-lasting preservation.</p>
                  </div>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p>• <strong>Free Express Shipping:</strong> Compliments on all prepaid orders.</p>
                  <p>• <strong>Dispatch:</strong> 24-48 hours from Srinagar atelier.</p>
                  <p>• <strong>Worldwide Insured Delivery:</strong> Express tracking available on all dispatches.</p>
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
              <span>Iconic Unboxing Presentation</span>
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
              Complimentary expedited shipping across India on all prepaid orders. Fully insured transit with real-time SMS tracking updates.
            </p>
          </div>
        </div>
      </section>

      {/* Related Creations */}
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
            <Link href="/shop" className="text-xs font-semibold text-stone-900 hover:text-stone-600">
              View Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

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

      {/* FLOATING MINI REEL (Kashmir Box style) - Bottom Right Floating Reel Widget */}
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
            {/* Mini Looping Video */}
            <video
              src={product?.video_url || videoProducts[0]?.video_url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover pointer-events-none"
            />

            {/* Top Banner Tag & Dismiss Button */}
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

            {/* Center Hover Play Icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#070E1E]/80 border border-[#D4AF37] flex items-center justify-center text-[#F7E7B6] shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-[#F7E7B6] ml-0.5" />
              </div>
            </div>

            {/* Bottom Text Tag */}
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

              {/* Dark Vignette Bottom Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070E1E]/95 via-transparent to-transparent pointer-events-none" />

              {/* Connected Product Floating Box */}
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

      {/* SIZE & FIT MODAL (Pixel-perfect matching screenshot) */}
      {showSizeGuide && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setShowSizeGuide(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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

            {/* Top Nav Tabs */}
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

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {sizeModalTab === 'chart' ? (
                <>
                  {/* Unit Switcher Pill */}
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

                  {/* Size Matrix Table with Vertical Column Highlight */}
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

                  {/* Footnote matching screenshot */}
                  <p className="text-[11px] text-stone-500 font-normal leading-relaxed pt-1">
                    Measurements are &apos;to fit&apos; body sizes. Between sizes? Size up for a relaxed fit.
                  </p>
                </>
              ) : (
                /* HOW TO MEASURE TAB */
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

              {/* Bottom Action Button (Exact match from screenshot) */}
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

