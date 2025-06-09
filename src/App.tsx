import { useInfiniteQuery } from "@tanstack/react-query";
import { execute } from "./graphql/execute";
import { useRef, useState } from "react";
import CardList from "./components/CardList";
import { PostsOrder } from "./graphql/graphql";
import { QueryResponse } from "./types/app";
import { TypedDocumentString } from "./graphql/graphql";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { useItemsPerPage } from "./hooks/useItemsPerPage";

const queryString = new TypedDocumentString<
  QueryResponse,
  { first: number; after: string | null; order: PostsOrder; topic?: string }
>(`
query PostsQuery($first: Int, $after: String, $order: PostsOrder, $topic: String) {
  posts(first: $first, after: $after, order: $order, topic: $topic) {
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
  const [orderBy, setOrderBy] = useState<"POPULAR" | "NEWEST">("POPULAR");
  const itemRef = useRef<HTMLDivElement>(null);
  const mobileItemRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = useItemsPerPage({ itemRef, mobileItemRef });

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

  const { lastElementRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const posts =
    data?.pages.flatMap((page) =>
      page.data.posts.edges.map((edge) => edge.node)
    ) || [];

  return (
    <div className="App">
      <CardList
        posts={posts}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        lastPostElementRef={lastElementRef}
        isFetchingNextPage={isFetchingNextPage}
        status={status}
        itemRef={itemRef}
        mobileItemRef={mobileItemRef}
        hasNextPage={hasNextPage}
      />
    </div>
  );
}

export default App;
