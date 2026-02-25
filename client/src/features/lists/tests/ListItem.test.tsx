import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTaskStore } from '@/features/tasks/store/taskStore';
import ListItem from '@/features/lists/components/ListItem';
import { ListProps } from '@shared/types/list.types';
import { TaskProps } from '@shared/types/task.types';
import { useNavigate } from 'react-router-dom';

const mockTasks = [
  { id: '1', list_id: '1', checked: false, name: 'Task 1', description: 'Description 1', date: '', position: 0 },
  { id: '2', list_id: '1', checked: true, name: 'Task 2', description: 'Description 2', date: '', position: 1 },
] satisfies TaskProps[];

const mockList: ListProps = {
  listId: '1',
  name: 'Test List',
  created_at: new Date().toISOString(),
  tasks: mockTasks,
};

// Mock para el store de tareas
vi.mock('@/features/tasks/store/taskStore', () => ({
  useTaskStore: vi.fn(),
}));

// Mock para react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(() => ({
    listId: '1',
  })),
}));

// Mock para el store del dialog de alerta
vi.mock('@/shared/store/dialogStore', () => ({
  useAlertDialogStore: vi.fn(() => ({
    setOpen: vi.fn(),
    setHandleDelete: vi.fn(),
    setListTitle: vi.fn(),
  })),
}));

// Mock para las utilidades de listas
vi.mock('@/features/lists/utils/getTaskCount', () => ({
  getTaskCount: vi.fn(() => 2),
}));

// Mock para lucide-react
vi.mock('lucide-react', () => ({
  Trash2: vi.fn(({ className, ...props }) => (
    <div className={className} {...props} data-testid='trash-icon'>
      🗑️
    </div>
  )),
}));

// Mock para componentes UI
vi.mock('@/shared/components/ui/tooltip', () => ({
  Tooltip: vi.fn(({ children, title }) => <div data-tooltip={title}>{children}</div>),
}));

// Mock para utilidades
vi.mock('@/shared/utils/replaceEmojis', () => ({
  replaceEmojis: vi.fn((text) => text),
}));

// Mock para hooks de uidotdev
vi.mock('@uidotdev/usehooks', () => ({
  useDebounce: vi.fn((value) => value),
}));

// Mock para el contexto de autenticación
vi.mock('@/app/context/AuthContext', () => ({
  UserAuth: vi.fn(() => ({
    user: {
      email: 'test@example.com',
    },
  })),
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
    action: 'updated',
    message: 'test',
    id: '1',
  })),
}));

// Mock para hooks de listas
vi.mock('@/features/lists/hooks/useLists', () => ({
  useLists: vi.fn(() => ({
    lists: [mockList],
  })),
  useUpdateList: vi.fn(() => ({
    mutate: vi.fn(),
  })),
  useDeleteList: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}));

vi.mocked(useTaskStore).mockReturnValue({
  tasks: mockTasks,
});

vi.mocked(useNavigate).mockReturnValue(vi.fn());

describe('ListItem', () => {
  beforeEach(() => {
    render(<ListItem list={mockList} />);
  });
  it('renders list item with correct name', () => {
    expect(screen.getByText('Test List')).toBeInTheDocument();
  });
  it('shows input field on double click', async () => {
    const user = userEvent.setup();
    const listItem = screen.getByText('Test List');
    await user.dblClick(listItem);
    const input = screen.getByDisplayValue('Test List');
    expect(input).toBeVisible();
  });
  it('updates list name on input change and blur', async () => {
    const user = userEvent.setup();
    const listItem = screen.getByText('Test List');
    await user.dblClick(listItem);
    const input = screen.getByDisplayValue('Test List');
    await user.clear(input);
    await user.type(input, 'Updated List Name');
    await user.click(document.body); // blur the input
    expect(screen.getByText('Updated List Name')).toBeInTheDocument();
  });
  it('shows task count when not hovering', async () => {
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
