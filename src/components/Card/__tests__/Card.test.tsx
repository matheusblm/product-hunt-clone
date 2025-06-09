import React from 'react';
import { render, screen } from '@testing-library/react';
import AppCard from '../index';

describe('AppCard Component', () => {
  const mockProps = {
    name: 'Test App',
    description: 'Test Description',
    votesCount: 42,
    thumbnail: {
      url: 'https://example.com/image.jpg'
    },
    isDesktop: false
  };

  it('renders with all props correctly', () => {
    render(<AppCard {...mockProps} />);
    
    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByAltText('Test App')).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders with fallback description when no description is provided', () => {
    const propsWithoutDescription = {
      ...mockProps,
      description: null
    };
    
    render(<AppCard {...propsWithoutDescription} />);
    
    expect(screen.getByText(`Check out Test App - a great product that you'll love!`)).toBeInTheDocument();
  });

  it('renders with fallback icon when no thumbnail is provided', () => {
    const propsWithoutThumbnail = {
      ...mockProps,
      thumbnail: undefined
    };
    
    render(<AppCard {...propsWithoutThumbnail} />);
    
    expect(screen.getByText('🚀')).toBeInTheDocument();
  });

  it('applies desktop class when isDesktop is true', () => {
    const desktopProps = {
      ...mockProps,
      isDesktop: true
    };
    
    render(<AppCard {...desktopProps} data-testid="app-card" />);
    
    expect(screen.getByTestId('app-card')).toHaveClass('isDesktop');
  });

  it('renders vote count with correct data attribute', () => {
    render(<AppCard {...mockProps} />);
    
    const voteCountElement = screen.getByText('42');
    expect(voteCountElement).toHaveAttribute('data-count', '43');
  });
}); 