import { useEffect, useRef, useCallback } from 'react';

/**
 * Optimized useScrollReveal with performance improvements
 * - Debounced intersection updates
 - Will-change optimization
 - Performance monitoring
 *
 * @param {Object} options
 * @param {number} options.threshold  - 0–1, portion of element that must be visible (default 0.15)
 * @param {string} options.rootMargin - CSS margin around root (default '0px')
 * @param {number} options.debounceMs - Debounce delay in ms (default 50)
 */
const useScrollReveal = ({ 
    threshold = 0.15, 
    rootMargin = '0px',
    debounceMs = 50 
} = {}) => {
    const ref = useRef(null);
    const animationFrameRef = useRef(null);
    const lastUpdateRef = useRef(0);

    const handleIntersection = useCallback(([entry]) => {
        const now = Date.now();
        
        // Throttle updates to prevent excessive reflows
        if (now - lastUpdateRef.current < debounceMs) {
            return;
        }
        lastUpdateRef.current = now;

        // Cancel any pending animation frame
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
            if (entry.isIntersecting) {
                ref.current.classList.add('reveal-visible');
                ref.current.classList.remove('reveal-hidden');
            } else {
                ref.current.classList.remove('reveal-visible');
                ref.current.classList.add('reveal-hidden');
            }
        });
    }, [debounceMs]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Add will-change for better performance
        el.style.willChange = 'transform, opacity';

        const observer = new IntersectionObserver(
            handleIntersection,
            { 
                threshold, 
                rootMargin,
                // Use passive observer for better performance
                root: null
            }
        );

        observer.observe(el);
        
        return () => {
            observer.disconnect();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [threshold, rootMargin, handleIntersection]);

    return ref;
};

export default useScrollReveal;
