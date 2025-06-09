import { useInfiniteQuery } from '@tanstack/react-query';
import { execute } from './graphql/execute';
import { useEffect, useRef, useCallback, useState } from 'react';

function App() {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const itemRef = useRef(null);

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
    window.addEventListener('resize', calculateItemsPerPage);

    return () => {
      window.removeEventListener('resize', calculateItemsPerPage);
    };
  }, []);

  const queryString = `
    query PostsQuery($first: Int, $after: String) {
      posts(first: $first, after: $after) {
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
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['posts', itemsPerPage],
    queryFn: ({ pageParam = null }) => execute(queryString, { first: itemsPerPage, after: pageParam }),
    getNextPageParam: (lastPage) => lastPage.data.posts.pageInfo.hasNextPage ? lastPage.data.posts.pageInfo.endCursor : undefined,
  });

  const observer = useRef();
  const lastPostElementRef = useCallback(node => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, fetchNextPage, hasNextPage]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'error') return <div>Error</div>;
  if (!data) return null;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Product Hunt Posts</h1>
        <div>
          {data.pages.map((page, i) => (
            <div key={i}>
              {page.data.posts.edges.map(({ node }, index) => {
                const isLastElement = i === data.pages.length - 1 && index === page.data.posts.edges.length - 1;
                return (
                  <div 
                    key={node.id}
                    ref={index === 0 ? itemRef : (isLastElement ? lastPostElementRef : null)}
                    className="post-item"
                  >
                    <h2>{node.name}</h2>
                    <p>{node.tagline}</p>
                    <p>Votes: {node.votesCount}</p>
                    <a href={node.url} target="_blank" rel="noopener noreferrer">
                      View on Product Hunt
                    </a>
                  </div>
                );
              })}
            </div>
          ))}
          {isFetchingNextPage && <div>Loading more posts...</div>}
        </div>
      </header>
    </div>
  );
}

export default App;
