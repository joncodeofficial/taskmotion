import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useAlertDialogStore } from '@/shared/store/dialogStore';
import UserWelcome from '@/features/user/components/UserWelcome';
import { format } from 'date-fns';
import { MemoryRouter } from 'react-router';

vi.mock('@/shared/store/dialogStore', () => ({
  useAlertDialogStore: vi.fn(),
}));

vi.mock('@/features/lists/hooks/useLists', () => ({
  useUpdateList: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('@/features/user/components/ListOptionsMenu', () => ({
  ListOptionsMenu: () => <div>List options menu</div>,
}));

vi.mocked(useAlertDialogStore).mockReturnValue({
  listTitle: 'My list',
  setListTitle: vi.fn(),
});

vi.mock('@/features/user/utils/getGreeting', () => ({
  getGreeting: () => 'Good morning!',
}));

describe('UserWelcome', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render listname', () => {
    render(
      <MemoryRouter>
        <UserWelcome />
      </MemoryRouter>
    );
    expect(screen.getByText(/My list/i)).toBeInTheDocument();
  });

  it('should render greeting message', () => {
    render(
      <MemoryRouter>
        <UserWelcome />
      </MemoryRouter>
    );
    const formattedDate = format(new Date(), 'EEEE, MMMM d');
    expect(screen.getByText(`Good morning! Today is ${formattedDate}`)).toBeInTheDocument();
  });
});
