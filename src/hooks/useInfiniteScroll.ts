import { useCallback, useRef, useState } from 'react';

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<any>;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseInfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage || isLoadingMore) return;
      if (observer.current) observer.current.disconnect();
      if (node) {
        const isMobile = window.innerWidth <= 768;
        const setupObserver = () => {
          observer.current = new IntersectionObserver((entries) => {
            const isIntersecting = entries[0]?.isIntersecting;
            if (isIntersecting && hasNextPage && !isLoadingMore) {
              setIsLoadingMore(true);
              fetchNextPage().finally(() => {
                setIsLoadingMore(false);
              });
            }
          });

          observer.current.observe(node);
        };
        if (isMobile) {
          requestAnimationFrame(setupObserver);
        } else {
          setupObserver();
        }
      }
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage, isLoadingMore]
  );

  return {
    lastElementRef,
    isLoadingMore,
  };
}; 