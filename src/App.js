import { useQuery } from '@tanstack/react-query';
import { execute } from './graphql/execute'

function App() {
  const queryString = `
    query PostsQuery {
      posts {
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
        }
      }
    }
  `;


  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => execute(queryString)
  })

  // if (isLoading) return <div>Loading...</div>
  // if (error) return <div>Error: {error.message}</div>
 

  return (
    <div className="App">
      <header className="App-header">
        <h1>Product Hunt Posts</h1>
        <div>
          {posts?.data?.posts?.edges?.map(({ node }) => (
            <div key={node.id}>
              <h2>{node.name}</h2>
              <p>{node.tagline}</p>
              <p>Votes: {node.votesCount}</p>
              <a href={node.url} target="_blank" rel="noopener noreferrer">
                View on Product Hunt
              </a>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
