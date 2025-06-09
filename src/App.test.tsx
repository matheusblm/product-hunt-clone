import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

jest.mock('./components/CardList', () => {
  return function MockCardList({ posts, orderBy, setOrderBy, status }: any) {
    return (
      <div data-testid="mock-card-list">
        <div data-testid="order-by">{orderBy}</div>
        <button onClick={() => setOrderBy('NEWEST')}>Change Order</button>
        <div data-testid="status">{status}</div>
        {posts.map((post: any) => (
          <div key={post.id} data-testid="post">
            {post.name}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('./graphql/execute', () => ({
  execute: jest.fn()
}));

describe('App Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          refetchOnReconnect: false,
        },
      },
    });
  });

  it('renders the app with initial state', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('mock-card-list')).toBeInTheDocument();
  });

  it('handles successful data fetching', async () => {
    const mockPosts = [
      {
        id: '1',
        name: 'Test App 1',
        description: 'Description 1',
        votesCount: 100,
        thumbnail: { url: 'https://example.com/image1.jpg' },
        slug: 'test-app-1',
        url: 'https://example.com/test-app-1',
        featuredAt: '2024-03-20T00:00:00Z',
        createdAt: '2024-03-19T00:00:00Z',
        tagline: 'Test Tagline 1'
      }
    ];

    const mockResponse = {
      data: {
        posts: {
          edges: mockPosts.map(post => ({
            node: post,
            cursor: 'cursor1'
          })),
          pageInfo: {
            hasNextPage: false,
            endCursor: 'cursor1'
          }
        }
      }
    };

    const { execute } = require('./graphql/execute');
    execute.mockResolvedValueOnce(mockResponse);

    queryClient.setQueryData(['posts', 10, 'POPULAR'], {
      pages: [mockResponse],
      pageParams: [null]
    });

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('success');
    });

    expect(screen.getByTestId('post')).toHaveTextContent('Test App 1');
  });


  it('changes order when clicking the order button', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    const orderButton = screen.getByText('Change Order');
    fireEvent.click(orderButton);

    await waitFor(() => {
      expect(screen.getByTestId('order-by')).toHaveTextContent('NEWEST');
    });
  });
}); 