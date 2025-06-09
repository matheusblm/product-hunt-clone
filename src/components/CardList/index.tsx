import React from 'react';
import './cardList.css';
import AppCard from '../Card';
import Search from '../Search';
import { CardListProps } from '../../types/app';

  const LoadingSkeleton = () => (
  <div className="app-card skeleton">
    <div className="cardHeader">
      <div className="iconContainer skeleton-bg"></div>
      <div className="cardDetails">
        <div className="skeleton-title skeleton-bg"></div>
        <div className="skeleton-description skeleton-bg"></div>
      </div>
      <div className="votesBadge skeleton-bg"></div>
    </div>
  </div>
);

const ErrorMessage = () => (
  <div className="error-container">
    <div className="error-icon">⚠️</div>
    <h3>Oops! Something went wrong</h3>
    <p>We couldn't load the posts. Please try again later.</p>
  </div>
);

const CardList: React.FC<CardListProps> = ({
  posts,
  searchQuery,
  setSearchQuery,
  orderBy,
  setOrderBy,
  lastPostElementRef,
  isFetchingNextPage,
  status
}) => {
  return (
    <div className="min-h-screen">
      <div className="mobile-header">
        <div className="header-content">
          <div className="header-icon">👤</div>
          <div className="header-date">Today, {new Date().toLocaleDateString()}</div>
        </div>
        <div className="tabs">
          <button
            className={`tab ${orderBy === 'POPULAR' ? 'active' : 'inactive'}`}
            onClick={() => setOrderBy('POPULAR')}
          >
            Popular
          </button>
          <button
            className={`tab ${orderBy === 'NEWEST' ? 'active' : 'inactive'}`}
            onClick={() => setOrderBy('NEWEST')}
          >
            Newest
          </button>
        </div>
      </div>

      <div className="desktop-header">
        <div className="container">
          <div className="desktop-header-content">
            <div className="desktop-header-text">
              <h1>Product Hunt</h1>
              <p>Discover amazing products</p>
            </div>
            <div className="desktop-header-actions">
              <Search
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search apps..."
                className="desktop-search"
              />
              <div className="desktop-tabs">
                <button
                  className={`desktop-tab ${orderBy === 'POPULAR' ? 'active' : 'inactive'}`}
                  onClick={() => setOrderBy('POPULAR')}
                >
                  Popular
                </button>
                <button
                  className={`desktop-tab ${orderBy === 'NEWEST' ? 'active' : 'inactive'}`}
                  onClick={() => setOrderBy('NEWEST')}
                >
                  Newest
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mobile-content">
        <div className="app-list">
          {status === 'error' ? (
            <ErrorMessage />
          ) : status === 'pending' ? (
            Array(3).fill(0).map((_, index) => <LoadingSkeleton key={index} />)
          ) : (
            posts.map((post, index) => (
              <div
                key={post.id}
                ref={index === posts.length - 1 ? lastPostElementRef : null}
                className="app-card"
              >
                <AppCard
                  name={post.name}
                  description={post.description}
                  votesCount={post.votesCount}
                  thumbnail={post.thumbnail}
                  isDesktop={false}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="desktop-content">
        <div className="container">
          <div className="grid grid-cols-2">
            {status === 'error' ? (
              <ErrorMessage />
            ) : status === 'pending' ? (
              Array(4).fill(0).map((_, index) => <LoadingSkeleton key={index} />)
            ) : (
              posts.map((post, index) => (
                <div
                  key={post.id}
                  ref={index === posts.length - 1 ? lastPostElementRef : null}
                  className="app-card"
                >
                  <AppCard
                    name={post.name}
                    description={post.description}
                    votesCount={post.votesCount}
                    thumbnail={post.thumbnail}
                    isDesktop={true}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mobile-search">
        <Search
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search apps..."
        />
      </div>

      {isFetchingNextPage && (
        <div className="loading-more">
          <div className="loading-spinner"></div>
          <span>Loading more posts...</span>
        </div>
      )}
    </div>
  );
};

export default CardList;
