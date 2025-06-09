import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardList from '../index';

jest.mock('../../Card', () => {
  return function MockAppCard({ name, description, votesCount, isDesktop }: any) {
    return (
      <div data-testid="mock-app-card" className={isDesktop ? 'isDesktop' : ''}>
        <h3>{name}</h3>
        <p>{description}</p>
        <span>{votesCount}</span>
      </div>
    );
  };
});

describe('CardList Component', () => {
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
    },
    {
      id: '2',
      name: 'Test App 2',
      description: 'Description 2',
      votesCount: 200,
      thumbnail: { url: 'https://example.com/image2.jpg' },
      slug: 'test-app-2',
      url: 'https://example.com/test-app-2',
      featuredAt: '2024-03-20T00:00:00Z',
      createdAt: '2024-03-19T00:00:00Z',
      tagline: 'Test Tagline 2'
    }
  ];

  const defaultProps = {
    posts: mockPosts,
    orderBy: 'POPULAR' as const,
    setOrderBy: jest.fn(),
    lastPostElementRef: jest.fn(),
    isFetchingNextPage: false,
    status: 'success' as const,
    itemRef: { current: null },
    mobileItemRef: { current: null },
    hasNextPage: true
  };

  it('renders the header with correct title and description', () => {
    render(<CardList {...defaultProps} />);
    
    const productHuntHeadings = screen.getAllByText('Product Hunt');
    expect(productHuntHeadings.length).toBe(2);
    expect(productHuntHeadings[0]).toBeInTheDocument();

    const descriptions = screen.getAllByText('Discover amazing products');
    expect(descriptions.length).toBe(2);
    expect(descriptions[0]).toBeInTheDocument();
  });

  it('renders tabs with correct initial state', () => {
    render(<CardList {...defaultProps} />);
    
    const popularTabs = screen.getAllByText('Popular');
    const newestTabs = screen.getAllByText('Newest');
    
    expect(popularTabs.length).toBe(2);
    expect(newestTabs.length).toBe(2);
    
    expect(popularTabs[0]).toHaveClass('active');
    expect(newestTabs[0]).toHaveClass('inactive');
    
    expect(popularTabs[1]).toHaveClass('active');
    expect(newestTabs[1]).toHaveClass('inactive');
  });

  it('calls setOrderBy when clicking on tabs', () => {
    render(<CardList {...defaultProps} />);
    
    const newestTabs = screen.getAllByText('Newest');
    const popularTabs = screen.getAllByText('Popular');
    
    fireEvent.click(newestTabs[0]);
    expect(defaultProps.setOrderBy).toHaveBeenCalledWith('NEWEST');
    
    fireEvent.click(popularTabs[0]);
    expect(defaultProps.setOrderBy).toHaveBeenCalledWith('POPULAR');
  });

  it('renders loading skeleton when status is pending', () => {
    render(<CardList {...defaultProps} status="pending" />);
    
    const skeletons = screen.getAllByTestId('loading-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error message when status is error', () => {
    render(<CardList {...defaultProps} status="error" />);
    
    const errorHeadings = screen.getAllByText('Oops! Something went wrong');
    const errorMessages = screen.getAllByText("We couldn't load the posts. Please try again later.");
    
    expect(errorHeadings.length).toBe(2);
    expect(errorMessages.length).toBe(2);
    
    expect(errorHeadings[0]).toBeInTheDocument();
    expect(errorMessages[0]).toBeInTheDocument();
  });

  it('renders posts correctly', () => {
    render(<CardList {...defaultProps} />);
    
    const appCards = screen.getAllByTestId('mock-app-card');
    expect(appCards.length).toBe(mockPosts.length * 2);
    
    expect(appCards[0]).toHaveTextContent('Test App 1');
    expect(appCards[1]).toHaveTextContent('Test App 2');
    expect(appCards[2]).toHaveTextContent('Test App 1');
    expect(appCards[3]).toHaveTextContent('Test App 2');
  });

  it('shows loading more indicator when fetching next page', () => {
    render(<CardList {...defaultProps} isFetchingNextPage={true} />);
    
    const loadingIndicators = screen.getAllByText('Loading more posts');
    expect(loadingIndicators.length).toBe(2);
    expect(loadingIndicators[0]).toBeInTheDocument();
  });

  it('shows end of list divider when there are no more pages', () => {
    render(<CardList {...defaultProps} hasNextPage={false} />);
    
    const dividers = screen.getAllByText('#');
    expect(dividers.length).toBe(2);
    expect(dividers[0]).toBeInTheDocument();
  });
}); 