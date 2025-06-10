import { useCallback, useRef, useEffect, useState } from "react";

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
  const [nodeToObserve, setNodeToObserve] = useState<HTMLDivElement | null>(
    null
  );
  const isFetchingNextPageRef = useRef(isFetchingNextPage);

  useEffect(() => {
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [isFetchingNextPage]);

  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    setNodeToObserve(node);
  }, []);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    if (!nodeToObserve || !hasNextPage) {
      return;
    }

    observer.current = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0]?.isIntersecting;
        if (isIntersecting && hasNextPage && !isFetchingNextPageRef.current) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    observer.current.observe(nodeToObserve);
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [nodeToObserve, hasNextPage, fetchNextPage]);

  return {
    lastElementRef,
  };
};
