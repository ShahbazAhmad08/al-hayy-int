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
  Heart, 
  Share2, 
  Check, 
  Ruler, 
  Info,
  Clock
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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-600">Retrieving handcrafted Kashmiri masterpiece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif-luxury text-2xl font-bold text-slate-900">Creation Not Found</h2>
        <Link href="/shop" className="text-amber-800 font-semibold underline text-sm">
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
    { name: product.category, url: `/shop?category=${encodeURIComponent(product.category)}` },
    { name: product.title, url: `/product/${product.id}` }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      <SEOStructuredData type="Product" data={product} />
      <SEOStructuredData type="BreadcrumbList" data={breadcrumbs} />

      {/* Breadcrumb Path */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto pb-2 scrollbar-none">
        <Link href="/" className="hover:text-[#064E3B]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <Link href="/shop" className="hover:text-[#064E3B]">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-[#064E3B]">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-slate-900 font-semibold truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Gallery Column */}
        <div className="space-y-4 sticky top-28">
          {/* Main Large Image */}
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-stone-100 border border-[#EADBCC] shadow-lg">
            <img
              src={selectedImage || product.image}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3.5 py-1.5 bg-[#881337] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                Sale • {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-[#064E3B] shadow-md transition-all"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span className="absolute top-16 right-4 px-3 py-1 bg-emerald-900 text-amber-200 text-xs rounded-lg shadow-lg">
                Link copied!
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#064E3B] shadow-md scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-800">
              <span className="uppercase tracking-widest font-semibold font-sans">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-600">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-sm">{product.rating || '4.9'}</span>
                <span className="text-slate-400">({product.reviews_count || 28} reviews)</span>
              </div>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              {product.title}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-bold text-[#064E3B] font-sans">
                ₹{discountPrice.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className="text-base text-slate-400 line-through">
                  ₹{price.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 font-semibold rounded-full border border-emerald-200">
                Inclusive of all taxes
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Artisan 72h Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF6EE] to-[#F3EFEA] border border-[#EADBCC] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs shadow-sm">
              72h
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                Kashmiri Artisan Handcraft
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {product.craft_details || 'Hand-embroidered with authentic Aari needlework in Srinagar.'}
              </p>
            </div>
          </div>

          {/* Variant: Size Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Choose Size:</span>
                <button
                  type="button"
                  onClick={() => setShowSizeModal(true)}
                  className="text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1 text-xs"
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
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedSize === v.size
                        ? 'bg-[#064E3B] text-white shadow-md ring-2 ring-[#064E3B]/40'
                        : 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-stone-50 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-3 text-slate-600 hover:bg-stone-200 font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-slate-800 min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-3 text-slate-600 hover:bg-stone-200 font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all transform active:scale-95 ${
                  added
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gradient-to-r from-[#022C22] via-[#064E3B] to-[#022C22] text-amber-200 hover:from-[#064E3B] hover:to-[#047857]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-amber-300" />
                    <span>Add to Bag • ₹{(discountPrice * quantity).toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabs / Accordions */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex border-b border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-amber-600 text-amber-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Fabric & Craft
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'care'
                    ? 'border-amber-600 text-amber-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Care Instructions
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-3 px-4 border-b-2 transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-amber-600 text-amber-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Shipping & Returns
              </button>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed">
              {activeTab === 'details' && (
                <div className="space-y-2">
                  <p><strong>Fabric:</strong> {product.fabric || '100% Pure Combed Cotton'}</p>
                  <p><strong>Artisan Work:</strong> Hand-guided Kashmiri needle embroidery</p>
                  <p><strong>Origin:</strong> Srinagar Valley, Jammu & Kashmir</p>
                </div>
              )}
              {activeTab === 'care' && (
                <div className="space-y-2">
                  <p>• {product.care || 'Gentle hand wash in cold water or mild dry clean.'}</p>
                  <p>• Do not bleach or wring dry.</p>
                  <p>• Iron on low heat on the reverse side of embroidery.</p>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p>• <strong>Free Express Shipping:</strong> Orders above ₹1,499 qualify for complimentary delivery.</p>
                  <p>• <strong>Dispatch Time:</strong> Ships within 24-48 hours from Srinagar atelier.</p>
                  <p>• <strong>Returns:</strong> 7-day hassle-free replacement or exchange guarantee.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-[#EADBCC]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif-luxury text-lg font-bold text-slate-900">
                Al Hayy Size Guide (Inches)
              </h3>
              <button onClick={() => setShowSizeModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="p-2.5">Size</th>
                  <th className="p-2.5">Bust</th>
                  <th className="p-2.5">Waist</th>
                  <th className="p-2.5">Hip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr><td className="p-2.5 font-bold">S</td><td className="p-2.5">36"</td><td className="p-2.5">32"</td><td className="p-2.5">38"</td></tr>
                <tr><td className="p-2.5 font-bold">M</td><td className="p-2.5">38"</td><td className="p-2.5">34"</td><td className="p-2.5">40"</td></tr>
                <tr><td className="p-2.5 font-bold">L</td><td className="p-2.5">40"</td><td className="p-2.5">36"</td><td className="p-2.5">42"</td></tr>
                <tr><td className="p-2.5 font-bold">XL</td><td className="p-2.5">42"</td><td className="p-2.5">38"</td><td className="p-2.5">44"</td></tr>
                <tr><td className="p-2.5 font-bold">XXL</td><td className="p-2.5">44"</td><td className="p-2.5">40"</td><td className="p-2.5">46"</td></tr>
              </tbody>
            </table>
            <p className="text-[11px] text-slate-500 italic">
              All sizes follow standard Indian garment specifications.
            </p>
          </div>
        </div>
      )}

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-slate-200">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
              Complete Your Valley Look
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#022C22]">
              You May Also Adore
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
