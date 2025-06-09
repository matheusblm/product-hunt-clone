import React from 'react';
import './cardList.css';
import AppCard from '../Card';
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

const LoadingMore = () => (
  <div className="loading-more">
    <span>Loading more posts</span>
    <span className="bouncing-dots">
      <span className="dot dot1">.</span>
      <span className="dot dot2">.</span>
      <span className="dot dot3">.</span>
    </span>
  </div>
);

const EndOfListDivider = () => (
  <div className="end-of-list-divider">
    <span className="line"></span>
    <span className="hash">#</span>
    <span className="line"></span>
  </div>
);

const CardList: React.FC<CardListProps> = ({
  posts,
  orderBy,
  setOrderBy,
  lastPostElementRef,
  isFetchingNextPage,
  status,
  itemRef,
  mobileItemRef,
  hasNextPage,
}) => {
  return (
    <div className="min-h-screen">
      <div className="mobile-header">
        <div className="mobile-header-text">
          <h1>Product Hunt</h1>
          <p>Discover amazing products</p>
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
            <>
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  ref={index === posts.length - 1 ? lastPostElementRef : null}
                  className={`app-card ${index === posts.length - 1 ? 'last-card' : ''}`}
                  style={index === posts.length - 1 ? { 
                    minHeight: '50px',
                    position: 'relative'
                  } : undefined}
                >
                  <AppCard
                    ref={index === 0 ? mobileItemRef : undefined}
                    name={post.name}
                    description={post.description}
                    votesCount={post.votesCount}
                    thumbnail={post.thumbnail}
                    isDesktop={false}
                  />
                </div>
              ))}
              {isFetchingNextPage && <LoadingMore />}
              {!hasNextPage && !isFetchingNextPage && posts.length > 0 && <EndOfListDivider />}
            </>
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
              <>
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                    ref={index === posts.length - 1 ? lastPostElementRef : null}
                    className="app-card"
                  >
                    <AppCard
                      ref={index === 0 ? itemRef : null}
                      name={post.name}
                      description={post.description}
                      votesCount={post.votesCount}
                      thumbnail={post.thumbnail}
                      isDesktop={true}
                    />
                  </div>
                ))}
                {isFetchingNextPage && <LoadingMore />}
                {!hasNextPage && !isFetchingNextPage && posts.length > 0 && <EndOfListDivider />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardList;
