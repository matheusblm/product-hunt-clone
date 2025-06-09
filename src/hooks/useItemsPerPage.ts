import { useEffect, useRef, useState } from 'react';

interface UseItemsPerPageProps {
  itemRef: React.RefObject<HTMLDivElement | null>;
  mobileItemRef: React.RefObject<HTMLDivElement | null>;
}

export const useItemsPerPage = ({ itemRef, mobileItemRef }: UseItemsPerPageProps) => {
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const calculateItemsPerPage = () => {
      const isMobile = window.innerWidth <= 768;
      const currentRef = isMobile ? mobileItemRef.current : itemRef.current;

      if (currentRef) {
        let itemHeight = currentRef.offsetHeight;
        if (itemHeight === 0) {
          itemHeight = 152;
        }
        const windowHeight = window.innerHeight;
        const cardSpacing = isMobile ? 16 : 24;
        const itemsInViewport = Math.ceil(
          windowHeight / (itemHeight + cardSpacing)
        );
        const bufferItems = isMobile ? 6 : 4;
        const totalItems = itemsInViewport + bufferItems;
        const finalItems = Math.max(isMobile ? 2 : 5, totalItems);
        setItemsPerPage(finalItems);
      } else {
        setItemsPerPage(isMobile ? 5 : 12);
      }
    };

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(calculateItemsPerPage, 150);
    };

    calculateItemsPerPage();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [itemRef, mobileItemRef]);

  return itemsPerPage;
}; 