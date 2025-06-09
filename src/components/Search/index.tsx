import React, { useState } from 'react';
import './search.css';

interface SearchProps {
  value: string;
  placeholder?: string;
  className?: string;
  onSearch?: (value: string) => void;
}

const Search: React.FC<SearchProps> = ({ 
  value, 
  placeholder = "Search...", 
  className = "",
  onSearch 
}) => {
  const [changedText, setChangedText] = useState(value);

  return (

    <div className={`search-container ${className}`}>
      <svg
        className="search-icon"
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
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={changedText}
        onChange={(e) => setChangedText(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {onSearch && (
        <button 
          className="search-button"
          onClick={() => onSearch(changedText)}
          type="button"
        >
          Search
        </button>
      )}
    </div>
  );
};

export default Search; 