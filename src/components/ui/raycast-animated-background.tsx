'use client';

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

// Dynamically import UnicornScene to avoid SSR issues
const UnicornScene = dynamic(() => import('unicornstudio-react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse bg-gray-800/20 w-full h-full rounded-lg" />
    </div>
  )
});

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { ...windowSize, isClient };
};

export const RaycastBackground = () => {
  const { width, height, isClient } = useWindowSize();
  const [hasError, setHasError] = useState(false);

  // Don't render anything until we're on the client side
  if (!isClient || width === 0 || height === 0) {
    return (
      <div className={cn("flex flex-col items-center w-full h-full")}>
        <div className="animate-pulse bg-gray-800/10 w-full h-full rounded-lg" />
      </div>
    );
  }

  // If there's an error, show a fallback
  if (hasError) {
    return (
      <div className={cn("flex flex-col items-center w-full h-full")}>
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-50" />
      </div>
    );
  }

  try {
    return (
      <div className={cn("flex flex-col items-center w-full h-full")}>
        <UnicornScene 
          production={true} 
          projectId="cbmTT38A0CcuYxeiyj5H" 
          width={width} 
          height={height}
          onError={() => setHasError(true)}
        />
      </div>
    );
  } catch (error) {
    console.warn('RaycastBackground failed to render:', error);
    setHasError(true);
    return (
      <div className={cn("flex flex-col items-center w-full h-full")}>
        <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-50" />
      </div>
    );
  }
};

// Keep the old export for backward compatibility
export const Component = RaycastBackground;

