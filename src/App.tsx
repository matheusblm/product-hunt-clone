import { useInfiniteQuery } from "@tanstack/react-query";
import { execute } from "./graphql/execute";
import { useEffect, useRef, useCallback, useState } from "react";
import CardList from "./components/CardList";
import { PostsOrder } from "./graphql/graphql";
import { QueryResponse } from "./types/app";
import { TypedDocumentString } from "./graphql/graphql";

const queryString = new TypedDocumentString<
  QueryResponse,
  { first: number; after: string | null; order: PostsOrder }
>(`
query PostsQuery($first: Int, $after: String, $order: PostsOrder) {
  posts(first: $first, after: $after, order: $order) {
    edges {
      node {
        id
        name
        slug
        url
        featuredAt
        createdAt
        description
        tagline
        votesCount
        thumbnail {
          url
        }
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`);

function App() {
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [orderBy, setOrderBy] = useState<"POPULAR" | "NEWEST">("POPULAR");
  const itemRef = useRef<HTMLDivElement>(null);
  const mobileItemRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

console.log(itemsPerPage)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery<QueryResponse>({
      queryKey: ["posts", itemsPerPage, orderBy],
      queryFn: ({ pageParam = null }) =>
        execute(queryString, {
          first: itemsPerPage,
          after: pageParam as string | null,
          order: orderBy === "POPULAR" ? PostsOrder.Votes : PostsOrder.Newest,
        }),
      getNextPageParam: (lastPage) =>
        lastPage.data.posts.pageInfo.hasNextPage
          ? lastPage.data.posts.pageInfo.endCursor
          : undefined,
      initialPageParam: null,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      if (node) {
        requestAnimationFrame(() => {
          observer.current = new IntersectionObserver((entries) => {
            const isIntersecting = entries[0]?.isIntersecting;
            if (isIntersecting && hasNextPage) {
              fetchNextPage();
            }
          });

          observer.current.observe(node);
        });
      }
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const posts =
    data?.pages.flatMap((page) =>
      page.data.posts.edges.map((edge) => edge.node)
    ) || [];

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
  }, []);

  return (
    <div className="App">
      <CardList
        posts={posts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        lastPostElementRef={lastPostElementRef}
        isFetchingNextPage={isFetchingNextPage}
        status={status}
        itemRef={itemRef}
        mobileItemRef={mobileItemRef}
      />
    </div>
  );
}

export default App;
