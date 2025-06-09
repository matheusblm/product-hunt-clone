import React from 'react';
import './card.css';
import { AppCardProps } from '../../types/app';

const AppCard = ({ name, description, votesCount, thumbnail, isDesktop = false }: AppCardProps) => {
  const fallbackDescription = `Check out ${name} - a great product that you'll love!`;
  
  return (
    <div className={`appCard ${isDesktop ? 'isDesktop' : ''}`}>
      <div className="cardHeader">
        <div className="iconContainer">
          {thumbnail ? (
            <img src={thumbnail.url} alt={name} className="appImage" />
          ) : (
            <div className="fallbackIcon">🚀</div>
          )}
        </div>
        <div className="cardDetails">
          <h3 className="cardName">{name}</h3>
          <p className="cardDescription">{description || fallbackDescription}</p>
        </div>
        <div className="votesBadge">
          <svg
            className="votesIcon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
          <span className="votesCount" data-count={votesCount + 1}>{votesCount}</span>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
