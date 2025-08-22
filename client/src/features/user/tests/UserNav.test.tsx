import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserNav } from '@/features/user/components/UserNav';

// Mock CONSTANTS
const mockSignout = vi.fn();

const mockUser = {
  fullname: 'John Doe',
  email: 'john@example.com',
  picture: 'https://example.com/avatar.jpg',
  fallback: 'JD',
};

// Mock the AuthContext
vi.mock('@/app/context/AuthContext', () => ({
  UserAuth: () => ({
    user: mockUser,
    signout: mockSignout,
  }),
}));

describe('UserNav', () => {
  beforeEach(() => {
    render(<UserNav />);
  });

  it('should render Profile text when dropdown is opened', async () => {
    const user = userEvent.setup();

    const avatarButton = screen.getByRole('button');
    await user.click(avatarButton);

    // Assert
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('should render User name and email when dropdown is opened', async () => {
    const user = userEvent.setup();

    const avatarButton = screen.getByRole('button');
    await user.click(avatarButton);

    // Assert
    expect(screen.getByText(mockUser.fullname)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('should close the dropdown when clicking Log out', async () => {
    const user = userEvent.setup();

    const avatarButton = screen.getByRole('button');
    await user.click(avatarButton);
    const logOutButton = screen.getByText('Log out');
    await user.click(logOutButton);

    // Assert
    expect(mockSignout).toHaveBeenCalledTimes(1);
  });

  it('should render fallback avatar when user does not have an avatar', async () => {
    userEvent.setup();

    // Assert
    expect(screen.getByText(mockUser.fallback)).toBeInTheDocument();
  });
});
