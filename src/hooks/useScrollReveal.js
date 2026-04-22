import { useEffect, useRef } from 'react';

/**
 * useScrollReveal
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport it gains the class "reveal-visible",
 * when it leaves the viewport the class is removed so the animation re-plays
 * every time the element scrolls back into view.
 *
 * @param {Object} options
 * @param {number} options.threshold  - 0–1, portion of element that must be visible (default 0.15)
 * @param {string} options.rootMargin - CSS margin around root (default '0px')
 */
const useScrollReveal = ({ threshold = 0.15, rootMargin = '0px' } = {}) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('reveal-visible');
                    el.classList.remove('reveal-hidden');
                } else {
                    el.classList.remove('reveal-visible');
                    el.classList.add('reveal-hidden');
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return ref;
};

export default useScrollReveal;
