/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateTask from '@/features/tasks/components/CreateTask';
import { useMediaQuery } from '@uidotdev/usehooks';

// Mock para el store de tareas
vi.mock('@/features/tasks/store/taskStore', () => ({
  useTaskStore: vi.fn().mockReturnValue({
    tasks: [],
  }),
}));

// Mock para las notificaciones
vi.mock('@/shared/hooks/useNotification', () => ({
  useUpdateNotifications: vi.fn().mockReturnValue({
    mutate: vi.fn(),
  }),
}));

// Mock para las tasks
vi.mock('@/features/tasks/hooks/useTasks', () => ({
  useCreateTask: vi.fn().mockReturnValue({
    mutate: vi.fn(),
  }),
}));

// Mock para react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn().mockReturnValue({
    listId: '123e4567-e89b-12d3-a456-426614174000',
  }),
}));

// Mock para media queries
vi.mock('@uidotdev/usehooks', () => ({
  useMediaQuery: vi.fn(),
}));

// Mock para el contexto de autenticación
vi.mock('@/app/context/AuthContext', () => ({
  UserAuth: vi.fn().mockReturnValue({
    user: {
      email: 'test@example.com',
    },
  }),
}));

// Mock para nanoid
vi.mock('nanoid', () => ({
  nanoid: vi.fn().mockReturnValue('mock-id-123'),
}));

// Mock para utilidades
vi.mock('@/shared/utils/replaceEmojis', () => ({
  replaceEmojis: vi.fn().mockImplementation((text) => text),
}));

vi.mock('@/shared/utils/createNotification', () => ({
  createNotification: vi.fn().mockReturnValue({
    type: 'task',
    action: 'created',
    message: 'test',
    id: 'mock-id-123',
  }),
}));

// Mock para el hook de shortcuts
vi.mock('@/shared/hooks/useShortcut', () => ({
  useShortcut: vi.fn().mockReturnValue(null),
}));

// Mock para date-fns
vi.mock('date-fns', () => ({
  format: vi.fn().mockImplementation(() => '12-25-2023'),
}));

// Mock para constantes
vi.mock('@/shared/constants/base', () => ({
  SIZE_ID: 10,
}));

// Mock para componentes
vi.mock('@/shared/components/CreateInput', () => ({
  CreateInput: vi.fn(
    ({
      children,
      placeholder,
      onSubmit,
      onChange,
      value,
      inputRef,
      shortcutKey,
      checked,
      onCheck,
    }) => (
      <div>
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
        <input
          type='checkbox'
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
          data-testid='checkbox'
        />
        {!useMediaQuery('(max-width: 768px)') && (
          <span data-testid='shortcut-key'>{shortcutKey.toUpperCase()}</span>
        )}
        {children}
      </div>
    )
  ),
}));

vi.mock('@/shared/components/buttons/CalendarButton', () => ({
  CalendarButton: vi.fn(({ setDate }) => (
    <button onClick={() => setDate('2023-12-25')} data-testid='calendar-button'>
      Calendar
    </button>
  )),
}));

describe('CreateTask', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMediaQuery).mockReturnValue(false);
    render(<CreateTask />);
  });

  it('renders input field with correct placeholder', () => {
    expect(screen.getByPlaceholderText(/Create new task.../i)).toBeInTheDocument();
  });

  it('updates input value when typing', async () => {
    const user = userEvent.setup();
    const input = screen.getByRole('textbox');
    await user.type(input, 'New Task');
    expect(input).toHaveValue('New Task');
  });

  it('creates new task when Enter is pressed', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Create new task...');
    await user.type(input, 'new task');
    await user.keyboard('{Enter}');
    expect(input).toHaveValue('');
  });

  it('creates new task when Add button is clicked', async () => {
    const user = userEvent.setup();
    const input = screen.getByRole('textbox');
    const addButton = screen.getByTestId('add-button');
    await user.type(input, 'new Task');
    await user.click(addButton);
    expect(input).toHaveValue('');
  });

  it('focuses input when Add button is clicked with empty input', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Create new task...');
    const addButton = screen.getByTestId('add-button');
    await user.click(addButton);
    expect(document.activeElement).toBe(input);
  });

  it('shows shortcut button on desktop devices', () => {
    cleanup();
    vi.mocked(useMediaQuery).mockReturnValue(false);
    render(<CreateTask />);
    expect(screen.getByText('E')).toBeInTheDocument();
  });

  it('hides shortcut button on mobile devices', () => {
    cleanup();
    vi.mocked(useMediaQuery).mockReturnValue(true);
    render(<CreateTask />);
    expect(screen.queryByText('E')).not.toBeInTheDocument();
  });

  it('trims whitespace from start of input', async () => {
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Create new task...');
    await user.type(input, '   Creating a new task');
    expect(input).toHaveValue('Creating a new task');
  });

  // it('should focus input when shortcut control+e is pressed', async () => {
  //   const user = userEvent.setup();
  //   const input = screen.getByRole('textbox');
  //   await user.keyboard('{Control>}{e}{/Control}');
  //   expect(document.activeElement).toBe(input);
  // });
});
