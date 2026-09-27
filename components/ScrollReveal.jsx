'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal - High-performance IntersectionObserver reveal animation wrapper
 * @param {string} animation - 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in'
 * @param {number} delay - delay in milliseconds (e.g., 100, 200, 300)
 * @param {number} duration - duration in milliseconds (default 700)
 * @param {number} threshold - visibility threshold to trigger (default 0.15)
 * @param {string} className - extra CSS classes
 */
export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.12,
  className = '',
  as: Component = 'div',
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver is not supported (older browsers/crawlers), make visible immediately
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [threshold]);

  // Base transition styles
  const getTransformClasses = () => {
    switch (animation) {
      case 'fade-up':
        return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10';
      case 'fade-down':
        return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10';
      case 'fade-left':
        return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12';
      case 'fade-right':
        return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12';
      case 'zoom-in':
        return isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95';
      default:
        return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';
    }
  };

  return (
    <Component
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`transition-all ${getTransformClasses()} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
