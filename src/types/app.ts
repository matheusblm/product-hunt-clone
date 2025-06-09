export type AppCardProps = {
  name: string;
  description: string | null;
  votesCount: number;
  thumbnail?: {
    url: string;
  };
  isDesktop?: boolean;
};

export type Post = {
  id: string;
  name: string;
  slug: string;
  url: string;
  featuredAt: string | null;
  createdAt: string;
  description: string | null;
  tagline: string;
  votesCount: number;
  thumbnail?: {
    url: string;
  };
};

export interface CardListProps {
  posts: Post[];
  orderBy: "POPULAR" | "NEWEST";
  setOrderBy: (order: "POPULAR" | "NEWEST") => void;
  lastPostElementRef: (node: HTMLDivElement | null) => void;
  isFetchingNextPage: boolean;
  status: "error" | "pending" | "success";
  itemRef: React.RefObject<HTMLDivElement | null>;
  mobileItemRef: React.RefObject<HTMLDivElement | null>;
  hasNextPage: boolean;
}

export type PostEdge = {
  node: Post;
  cursor: string;
}

export type PageInfo = {
  hasNextPage: boolean;
  endCursor: string;
}

export type PostsData = {
  posts: {
    edges: PostEdge[];
    pageInfo: PageInfo;
  };
}

export type QueryResponse = {
  data: PostsData;
}