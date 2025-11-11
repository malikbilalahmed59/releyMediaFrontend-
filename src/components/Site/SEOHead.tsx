'use client';
import { useEffect } from 'react';

interface SEOHeadProps {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    nextUrl?: string | null;
    prevUrl?: string | null;
    keywords?: string;
    ogImage?: string;
}

export default function SEOHead({ title, description, canonicalUrl, nextUrl, prevUrl, keywords, ogImage }: SEOHeadProps) {
    useEffect(() => {
        // Update document title
        if (title) {
            document.title = title;
        }

        // Update or create meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description || '');
        } else {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            metaDescription.setAttribute('content', description || '');
            document.head.appendChild(metaDescription);
        }

        // Update canonical URL
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalUrl) {
            if (canonicalLink) {
                canonicalLink.setAttribute('href', canonicalUrl);
            } else {
                canonicalLink = document.createElement('link');
                canonicalLink.setAttribute('rel', 'canonical');
                canonicalLink.setAttribute('href', canonicalUrl);
                document.head.appendChild(canonicalLink);
            }
        } else if (canonicalLink) {
            canonicalLink.remove();
        }

        // Update next/prev links
        let nextLink = document.querySelector('link[rel="next"]');
        if (nextUrl) {
            if (nextLink) {
                nextLink.setAttribute('href', nextUrl);
            } else {
                nextLink = document.createElement('link');
                nextLink.setAttribute('rel', 'next');
                nextLink.setAttribute('href', nextUrl);
                document.head.appendChild(nextLink);
            }
        } else if (nextLink) {
            nextLink.remove();
        }

        let prevLink = document.querySelector('link[rel="prev"]');
        if (prevUrl) {
            if (prevLink) {
                prevLink.setAttribute('href', prevUrl);
            } else {
                prevLink = document.createElement('link');
                prevLink.setAttribute('rel', 'prev');
                prevLink.setAttribute('href', prevUrl);
                document.head.appendChild(prevLink);
            }
        } else if (prevLink) {
            prevLink.remove();
        }

        // Update keywords meta tag
        let keywordsMeta = document.querySelector('meta[name="keywords"]');
        if (keywords) {
            if (keywordsMeta) {
                keywordsMeta.setAttribute('content', keywords);
            } else {
                keywordsMeta = document.createElement('meta');
                keywordsMeta.setAttribute('name', 'keywords');
                keywordsMeta.setAttribute('content', keywords);
                document.head.appendChild(keywordsMeta);
            }
        } else if (keywordsMeta) {
            keywordsMeta.remove();
        }

        // Update Open Graph tags
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (title) {
            if (ogTitle) {
                ogTitle.setAttribute('content', title);
            } else {
                ogTitle = document.createElement('meta');
                ogTitle.setAttribute('property', 'og:title');
                ogTitle.setAttribute('content', title);
                document.head.appendChild(ogTitle);
            }
        }

        let ogDescription = document.querySelector('meta[property="og:description"]');
        if (description) {
            if (ogDescription) {
                ogDescription.setAttribute('content', description);
            } else {
                ogDescription = document.createElement('meta');
                ogDescription.setAttribute('property', 'og:description');
                ogDescription.setAttribute('content', description);
                document.head.appendChild(ogDescription);
            }
        }

        let ogImageMeta = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
            if (ogImageMeta) {
                ogImageMeta.setAttribute('content', ogImage);
            } else {
                ogImageMeta = document.createElement('meta');
                ogImageMeta.setAttribute('property', 'og:image');
                ogImageMeta.setAttribute('content', ogImage);
                document.head.appendChild(ogImageMeta);
            }
        } else if (ogImageMeta) {
            ogImageMeta.remove();
        }

        let ogType = document.querySelector('meta[property="og:type"]');
        if (!ogType) {
            ogType = document.createElement('meta');
            ogType.setAttribute('property', 'og:type');
            ogType.setAttribute('content', 'product');
            document.head.appendChild(ogType);
        }
    }, [title, description, canonicalUrl, nextUrl, prevUrl, keywords, ogImage]);

    return null;
}




