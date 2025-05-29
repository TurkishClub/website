"use client"
import Script from 'next/script';

export default function Polling() {
    return (
         <section className="items-center flex flex-col bg-[#C61E1E]">
                <div className="w-full max-w-2xl min-h-[300px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
                <blockquote className="pollly-embed" data-id="Co4RlUbWrixK1DxVrWoC">          
                  Polling
                </blockquote>
                <Script 
                  src="https://poll.ly/embed.js"
                  onLoad={() => {
                // Hide loading spinner when script loads
                const loadingEl = document.querySelector('.animate-spin')?.parentElement;
                if (loadingEl) loadingEl.style.display = 'none';
                  }}
                />
              </section>
    );
}