import React from "react";
import "./cardList.css";
import AppCard from "../Card";
import { CardListProps } from "../../types/app";

const LoadingSkeleton = () => (
  <div className="app-card skeleton" data-testid="loading-skeleton">
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
  hasNextPage,
}) => {
  return (
    <div className="min-h-screen">
      <div className="header">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1>Product Hunt</h1>
              <p>Discover amazing products</p>
            </div>
            <div className="header-actions">
              <div className="tabs">
                <button
                  className={`tab ${
                    orderBy === "POPULAR" ? "active" : "inactive"
                  }`}
                  onClick={() => setOrderBy("POPULAR")}
                >
                  Popular
                </button>
                <button
                  className={`tab ${
                    orderBy === "NEWEST" ? "active" : "inactive"
                  }`}
                  onClick={() => setOrderBy("NEWEST")}
                >
                  Newest
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content-area">
        {status === "error" ? (
          <ErrorMessage />
        ) : status === "pending" ? (
          <div className="grid">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
          </div>
        ) : (
          <div className="grid">
            {posts.map((post, index) => (
              <div
                key={post.id}
                ref={
                  hasNextPage && index === posts.length - 1
                    ? lastPostElementRef
                    : null
                }
                className="app-card"
              >
                <AppCard
                  name={post.name}
                  description={post.description}
                  votesCount={post.votesCount}
                  thumbnail={post.thumbnail}
                />
              </div>
            ))}
          </div>
        )}

        {isFetchingNextPage && <LoadingMore />}
        {!hasNextPage && !isFetchingNextPage && posts.length > 0 && (
          <EndOfListDivider />
        )}
      </div>
    </div>
  );
};

export default CardList;
