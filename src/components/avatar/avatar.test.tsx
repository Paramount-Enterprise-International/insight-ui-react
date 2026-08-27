import { fireEvent, render, screen } from '@testing-library/react';
import { IAvatar } from './avatar';

describe('IAvatar', () => {
  it('renders the user icon when no image source is provided', () => {
    render(<IAvatar />);

    expect(screen.getByLabelText('User avatar')).toHaveAttribute('icon', 'user');
  });

  it('renders the primary image with its alternative text', () => {
    render(<IAvatar alt="Ada Lovelace" src="/ada.jpg" />);

    expect(screen.getByAltText('Ada Lovelace')).toHaveAttribute('src', '/ada.jpg');
  });

  it('uses the fallback image after the primary image fails', () => {
    render(<IAvatar alt="Ada Lovelace" fallbackSrc="/fallback.jpg" src="/ada.jpg" />);

    fireEvent.error(screen.getByAltText('Ada Lovelace'));

    expect(screen.getByAltText('Ada Lovelace')).toHaveAttribute(
      'src',
      '/fallback.jpg'
    );
  });

  it('uses the icon after every available image fails', () => {
    render(<IAvatar fallbackSrc="/fallback.jpg" src="/ada.jpg" />);

    fireEvent.error(screen.getByRole('img'));
    fireEvent.error(screen.getByRole('img'));

    expect(screen.getByLabelText('User avatar')).toHaveAttribute('icon', 'user');
  });

  it('applies shape and size presets to the host', () => {
    const { container } = render(
      <IAvatar className="border-primary" shape="rounded-square" size="lg" />
    );
    const avatar = container.querySelector('i-avatar');

    expect(avatar).toHaveAttribute('data-shape', 'rounded-square');
    expect(avatar).toHaveClass('i-avatar', 'border-primary');
    expect(avatar).toHaveStyle({ width: '64px', height: '64px' });
  });
});