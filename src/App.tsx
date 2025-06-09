import { useInfiniteQuery } from "@tanstack/react-query";
import { execute } from "./graphql/execute";
import { useEffect, useRef, useCallback, useState } from "react";
import CardList from "./components/CardList";
import { PostsOrder } from "./graphql/graphql";
import { QueryResponse } from "./types/app";
import { TypedDocumentString } from "./graphql/graphql";

const queryString = new TypedDocumentString<QueryResponse, { first: number; after: string | null; order: PostsOrder }>(`
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

  useEffect(() => {
    const calculateItemsPerPage = () => {
      if (itemRef.current) {
        const itemHeight = itemRef.current.offsetHeight;
        const windowHeight = window.innerHeight;
        const items = Math.ceil(windowHeight / itemHeight) + 2;
        setItemsPerPage(items);
      }
    };

    calculateItemsPerPage();
    window.addEventListener("resize", calculateItemsPerPage);

    return () => {
      window.removeEventListener("resize", calculateItemsPerPage);
    };
  }, []);

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
    });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const posts = data?.pages.flatMap((page) =>
    page.data.posts.edges.map((edge) => edge.node)
  ) || [];

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
      />
    </div>
  );
}

export default App;
