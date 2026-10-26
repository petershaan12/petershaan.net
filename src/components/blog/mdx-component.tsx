"use client"

import * as runtime from "react/jsx-runtime";
import { Callout } from "./callout";
import React, { useEffect, useMemo } from "react";
import NextImage from "next/image";

const getMDXComponent = (code: string) => {
    const fn = new Function(code)
    return fn({ ...runtime }).default;
}


const components = {
    Image: NextImage,
    Callout,
}

interface MdxProps {
    code: string;
    imageMap?: Record<string, string>;
}

export function MDXContent({ code, imageMap = {} }: MdxProps) {
    const Component = useMemo(() => getMDXComponent(code), [code]);

    useEffect(() => {
        const buttons = document.querySelectorAll('button[data-copy="true"]') as NodeListOf<HTMLButtonElement>;
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const pre = button.closest('pre');
                const code = pre?.querySelector('code')?.textContent || '';
                navigator.clipboard.writeText(code);
                button.classList.add('copied');
                button.title = 'Copied!';
                setTimeout(() => {
                    button.classList.remove('copied');
                    button.title = 'Copy to clipboard';
                }, 3000);
            });
        });

        setTimeout(() => {
            const articleImages = document.querySelectorAll('article img:not([data-zoom-handled])');
            articleImages.forEach(img => {
                const src = img.getAttribute('src');
                const replacementSrc = src ? imageMap[src] : undefined;

                if (replacementSrc) {
                    img.setAttribute('src', replacementSrc);
                }

                img.setAttribute('data-zoom-handled', 'true');
                (img as HTMLImageElement).style.cursor = 'zoom-in';
                img.classList.add('transition-opacity', 'hover:opacity-90');
                
                img.addEventListener('click', () => {
                    const src = img.getAttribute('src');
                    const alt = img.getAttribute('alt') || 'Image';
                    
                    const modal = document.createElement('div');
                    modal.className = 'fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-zoom-out';
                    modal.innerHTML = `
                        <button class="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition">
                            &#x2715;
                        </button>
                        <div class="w-full h-full flex items-center justify-center p-4 sm:p-10">
                            <img src="${src}" alt="${alt}" class="max-h-[90vh] w-auto object-contain" />
                        </div>
                    `;
                        
                    document.body.appendChild(modal);
                    document.body.style.overflow = 'hidden';
                    
                    modal.addEventListener('click', () => {
                        document.body.removeChild(modal);
                        document.body.style.overflow = '';
                    });
                    
                    const modalImg = modal.querySelector('img');
                    modalImg?.addEventListener('click', e => e.stopPropagation());
                    
                    const closeBtn = modal.querySelector('button');
                    closeBtn?.addEventListener('click', e => {
                        e.stopPropagation();
                        document.body.removeChild(modal);
                        document.body.style.overflow = '';
                    });
                });
            });
        }, 1000);
    }, [imageMap]);
    
    // eslint-disable-next-line react-hooks/static-components
    return <Component components={components} />;
}
