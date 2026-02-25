import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateList from '@/features/lists/components/CreateList';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useNavigate } from 'react-router';

// Mock para el contexto de autenticación
vi.mock('@/app/context/AuthContext', () => ({
  UserAuth: vi.fn(() => ({
    user: {
      email: 'test@example.com',
    },
  })),
}));

// Mock para nanoid
vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => 'mock-list-id-123'),
}));

// Mock para utilidades
vi.mock('@/shared/utils/replaceEmojis', () => ({
  replaceEmojis: vi.fn((text) => text),
}));

// Mock para el hook de shortcuts
vi.mock('@/shared/hooks/useShortcut', () => ({
  useShortcut: vi.fn(() => null),
}));

// Mock para constantes
vi.mock('@/shared/constants/base', () => ({
  SIZE_ID: 10,
}));

// Mock para el componente CreateInput
vi.mock('@/shared/components/CreateInput', () => ({
  CreateInput: vi.fn(
    ({ value, onChange, onSubmit, inputRef, placeholder, shortcutKey, className }) => (
      <div className={className}>
        <input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/^\s+/, ''))}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          data-testid='create-input'
        />
        <button onClick={onSubmit} data-testid='add-button'>
          Add
        </button>
        {!useMediaQuery('(max-width: 768px)') && (
          <span data-testid='shortcut-key'>{shortcutKey.toUpperCase()}</span>
        )}
      </div>
    )
  ),
}));

// Mock para notificaciones
vi.mock('@/shared/hooks/useNotification', () => ({
  useUpdateNotifications: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}));

// Mock para utilidades de notificación
vi.mock('@/shared/utils/createNotification', () => ({
  createNotification: vi.fn(() => ({
    type: 'list',
    action: 'created',
    message: 'test list',
    id: 'mock-list-id-123',
  })),
}));

// Mock para hooks de listas
vi.mock('@/features/lists/hooks/useLists', () => ({
  useLists: vi.fn(() => ({
    lists: [],
  })),
  useCreateList: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}));

// Mock para react-router
vi.mock('react-router', () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

// Mock para media queries
vi.mock('@uidotdev/usehooks', () => ({
  useMediaQuery: vi.fn(),
}));

vi.mocked(useNavigate).mockReturnValue(vi.fn());

describe('CreateList', () => {
  beforeEach(() => {
    render(<CreateList />);
  });
  it('renders input field with correct placeholder', () => {
    expect(screen.getByPlaceholderText(/Create new list.../i)).toBeInTheDocument();
  });
  it('updates input value when typing', async () => {
    const user = userEvent.setup();
    const input = screen.getByRole('textbox');
    await user.type(input, 'New List');
    expect(input).toHaveValue('New List');
  });
  it('creates new list when Enter is pressed', async () => {
    const user = userEvent.setup();
    const input = screen.getByRole('textbox');
    await user.type(input, 'Creating a new list');
    await user.keyboard('{Enter}');
    expect(input).toHaveValue('');
  });
  it('creates new list when Add button is clicked', async () => {
    const user = userEvent.setup();
    const input = screen.getByRole('textbox');
    const addButton = screen.getByTestId('add-button');
    await user.type(input, 'New List');
    await user.click(addButton);
    expect(input).toHaveValue('');
  });
  it('focuses input when Add button is clicked with empty input', async () => {
    const user = userEvent.setup();
    const input = screen.getByRole('textbox');
    const addButton = screen.getByTestId('add-button');
    await user.click(addButton);
    expect(document.activeElement).toBe(input);
  });
  it('shows shortcut button on desktop devices', () => {
    cleanup();
    vi.mocked(useMediaQuery).mockReturnValue(false);
    render(<CreateList />);
    expect(screen.getByText('L')).toBeInTheDocument();
  });
  it('hides shortcut button on mobile devices', () => {
    cleanup();
    vi.mocked(useMediaQuery).mockReturnValue(true);
    render(<CreateList />);
    expect(screen.queryByText('L')).not.toBeInTheDocument();
  });
  it('trims whitespace from start of input', async () => {
    const user = userEvent.setup();
    const input = screen.getByRole('textbox');
    await user.type(input, '   Test List');
    expect(input).toHaveValue('Test List');
  });
  // it('should focus input when shortcut control+l is pressed', async () => {
  //   const user = userEvent.setup();
  //   const input = screen.getByRole('textbox');
  //   await user.keyboard('{Control>}{l}{/Control}');
  //   expect(document.activeElement).toBe(input);
  // });
});
