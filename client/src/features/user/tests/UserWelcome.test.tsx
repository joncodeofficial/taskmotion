import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useAlertDialogStore } from '@/shared/store/dialogStore';
import UserWelcome from '@/features/user/components/UserWelcome';
import { format } from 'date-fns';

vi.mock('@/shared/store/dialogStore', () => ({
  useAlertDialogStore: vi.fn(),
}));

vi.mocked(useAlertDialogStore).mockReturnValue({
  listTitle: 'My list',
});

vi.mock('@/features/user/utils/getGreeting', () => ({
  getGreeting: () => 'Good morning!',
}));

describe('UserWelcome', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render listname', () => {
    render(<UserWelcome />);
    expect(screen.getByText(/My list/i)).toBeInTheDocument();
  });

  it('should render greeting message', () => {
    render(<UserWelcome />);
    const formatedDate = format(new Date(), 'EEEE, MMMM d');
    expect(screen.getByText(`Good morning! Today is ${formatedDate}`)).toBeInTheDocument();
  });
});
