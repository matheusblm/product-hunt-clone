import { useEffect, useRef, useState } from "react";

export const useItemsPerPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [isReady, setIsReady] = useState<boolean>(false);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const calculateItemsPerPage = () => {
    const itemHeight = 180;
    const windowHeight = window.innerHeight;
    const cardSpacing = 24;
    const itemsInViewport = Math.floor(
      windowHeight / (itemHeight + cardSpacing)
    );
    const bufferItems = 2;
    const totalItems = itemsInViewport + bufferItems;
    const finalItems = Math.max(8, totalItems);
    setItemsPerPage(finalItems);
    setIsReady(true);
  };

  useEffect(() => {
    calculateItemsPerPage();

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(calculateItemsPerPage, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  return { itemsPerPage, isReady };
};
