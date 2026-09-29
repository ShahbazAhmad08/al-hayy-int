'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Star, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  ChevronRight, 
  Share2, 
  Check, 
  Ruler, 
  Clock,
  Play,
  Video,
  Image as ImageIcon
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductById, getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import SEOStructuredData from '@/components/SEOStructuredData';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id;
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video'
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'care' | 'shipping'
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function load() {
      if (!productId) return;
      setLoading(true);
      try {
        const item = await getProductById(productId);
        setProduct(item);
        if (item) {
          setSelectedImage(item.image);
          setMediaType('image');
          if (item.variants && item.variants[0]) {
            setSelectedSize(item.variants[0].size);
            if (item.variants[0].colors && item.variants[0].colors[0]) {
              setSelectedColor(item.variants[0].colors[0]);
            }
          }
        }
        // Load related items
        const all = await getProducts();
        setRelatedProducts(all.filter(p => String(p.id) !== String(productId)).slice(0, 4));
      } catch (e) {
        console.error('Failed to load product detail', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

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

          {/* Variant: Size Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800">Choose Size:</span>
                <button
                  type="button"
                  onClick={() => setShowSizeModal(true)}
                  className="text-stone-600 hover:text-stone-950 font-semibold flex items-center gap-1 text-xs"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Guide
                </button>
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
                className={`flex-1 py-4 px-6 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95 ${
                  added
                    ? 'bg-[#AA7E18] text-white shadow-xl'
                    : 'bg-[#070E1E] text-[#F7E7B6] hover:bg-[#102142] border border-[#D4AF37]/40'
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
                    <span>Add to Bag • ₹{(discountPrice * quantity).toLocaleString('en-IN')}</span>
                  </>
                )}
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
                Fabric & Craft
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
                Shipping & Returns
              </button>
            </div>

            <div className="text-xs text-stone-600 leading-relaxed">
              {activeTab === 'details' && (
                <div className="space-y-2">
                  <p><strong>Fabric:</strong> {product.fabric || '100% Pure Combed Cotton / Handloom'}</p>
                  <p><strong>Artisan Work:</strong> Authentic Aari needle embroidery & Sozni motifs</p>
                  <p><strong>Origin:</strong> Srinagar, Jammu & Kashmir</p>
                </div>
              )}
              {activeTab === 'care' && (
                <div className="space-y-2">
                  <p>• {product.care || 'Gentle hand wash in cold water or mild dry clean.'}</p>
                  <p>• Do not bleach or wring dry.</p>
                  <p>• Warm iron on the reverse side of embroidery.</p>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p>• <strong>Free Express Shipping:</strong> Compliments on all prepaid orders.</p>
                  <p>• <strong>Dispatch:</strong> 24-48 hours from Srinagar atelier.</p>
                  <p>• <strong>Returns:</strong> 7-day hassle-free replacement guarantee.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-luxury text-lg font-bold text-stone-950">
                Al Hayy Size Guide (Inches)
              </h3>
              <button onClick={() => setShowSizeModal(false)} className="text-stone-400 hover:text-stone-950">
                ✕
              </button>
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-700 uppercase font-semibold">
                <tr>
                  <th className="p-2.5">Size</th>
                  <th className="p-2.5">Bust</th>
                  <th className="p-2.5">Waist</th>
                  <th className="p-2.5">Hip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr><td className="p-2.5 font-bold">S</td><td className="p-2.5">36"</td><td className="p-2.5">32"</td><td className="p-2.5">38"</td></tr>
                <tr><td className="p-2.5 font-bold">M</td><td className="p-2.5">38"</td><td className="p-2.5">34"</td><td className="p-2.5">40"</td></tr>
                <tr><td className="p-2.5 font-bold">L</td><td className="p-2.5">40"</td><td className="p-2.5">36"</td><td className="p-2.5">42"</td></tr>
                <tr><td className="p-2.5 font-bold">XL</td><td className="p-2.5">42"</td><td className="p-2.5">38"</td><td className="p-2.5">44"</td></tr>
                <tr><td className="p-2.5 font-bold">XXL</td><td className="p-2.5">44"</td><td className="p-2.5">40"</td><td className="p-2.5">46"</td></tr>
              </tbody>
            </table>
            <p className="text-[11px] text-stone-500 italic">
              Custom bridal & size alterations available via WhatsApp Concierge.
            </p>
          </div>
        </div>
      )}

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
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md p-3 sm:p-4 border-t border-stone-200 shadow-2xl lg:hidden z-30 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-stone-400 block uppercase">Price</span>
          <span className="text-base font-bold text-stone-950">₹{discountPrice.toLocaleString('en-IN')}</span>
        </div>

        <button
          onClick={handleAddToCart}
          className={`flex-1 py-3 px-5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 ${
            added
              ? 'bg-[#AA7E18] text-white'
              : 'bg-[#070E1E] text-[#F7E7B6] border border-[#D4AF37]/40'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag ({selectedSize})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
