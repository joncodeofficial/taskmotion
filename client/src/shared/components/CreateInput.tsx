import { useShortcut } from '@/shared/hooks/useShortcut';
import { useMediaQuery } from '@uidotdev/usehooks';
import { useEffect } from 'react';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { ShortcutBadge } from '@/shared/components/buttons/ShortcutBadge';
import { AddButton } from '@/shared/components/buttons/AddButton';
import { cn } from '@/shared/lib/utils';

type CreateInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  placeholder?: string;
  shortcutKey?: string;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

export const CreateInput = ({
  value,
  onChange,
  onSubmit,
  inputRef,
  placeholder = 'Create...',
  shortcutKey,
  checked,
  onCheck,
  children,
  className,
}: CreateInputProps) => {
  const keydown = useShortcut([`ctrl+${shortcutKey?.toLowerCase()}`]);
  const isSmallDevice = useMediaQuery('only screen and (max-width : 1023px)');

  useEffect(() => {
    if (keydown === `ctrl+${shortcutKey?.toLowerCase()}`) {
      inputRef?.current?.focus();
    }
  }, [inputRef, keydown, shortcutKey]);

  const handleKeyPress = (e: React.KeyboardEvent) => e.key === 'Enter' && onSubmit();

  return (
    <div
      className={cn(
        `relative group flex items-center w-full bg-gray-100 dark:bg-neutral-900 rounded-md px-2`,
        className
      )}
    >
      {onCheck && (
        <Checkbox
          name='checked'
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
          onKeyDown={(e) => e.key === 'Enter' && onCheck(!checked)}
          classNameContainer='ml-1'
        />
      )}

      <Input
        type='text'
        ref={inputRef}
        placeholder={placeholder}
        className='text-neutral-600 dark:text-neutral-50 px-2 outline-none w-full h-12 border-none focus-visible:ring-0 focus-visible:placeholder:text-neutral-400 dark:focus-visible:placeholder:text-neutral-100 rounded-none shadow-none'
        onKeyDown={handleKeyPress}
        onChange={(e) => onChange(e.target.value.trimStart())}
        value={value}
      />

      {!isSmallDevice && shortcutKey && (
        <ShortcutBadge keys={shortcutKey.toUpperCase()} className={`${value && 'opacity-0'}`} />
      )}

      {children}

      <AddButton
        title='Add'
        onMouseDown={(e) => {
          e.preventDefault();
          value ? onSubmit() : inputRef?.current?.focus();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            value ? onSubmit() : inputRef?.current?.focus();
          }
        }}
      />
    </div>
  );
};
