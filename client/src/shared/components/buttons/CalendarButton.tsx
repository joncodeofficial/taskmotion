import { useEffect, useRef, useState } from 'react';
import { Tooltip } from '../ui/tooltip';
import { Calendar } from '../ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../ui/button';
import { cn } from '@/shared/lib/utils';
import { useShortcut } from '@/shared/hooks/useShortcut';

type CalendarButtonProps = {
  date: string | undefined;
  setDate: React.Dispatch<React.SetStateAction<string | undefined>>;
  disabled?: boolean;
  className?: string;
  classNameButton?: string;
};

export const CalendarButton = ({
  date,
  setDate,
  className,
  classNameButton,
  disabled = false,
}: CalendarButtonProps) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const keydown = useShortcut(['escape']);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsCalendarVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (keydown && isCalendarVisible && keydown === 'escape') setIsCalendarVisible(false);
  }, [isCalendarVisible, keydown]);

  return (
    <div className={cn(`flex flex-col items-start relative`, className)}>
      <Tooltip title='Pick date'>
        <Button
          variant='secondary'
          size='icon'
          ref={buttonRef}
          onClick={() => setIsCalendarVisible(!isCalendarVisible)}
          disabled={disabled}
          className={cn(`w-7 dark:w-7 h-7 dark:h-7 mr-1`, classNameButton)}
        >
          <CalendarIcon
            className='w-4 select-none pointer-events-none
             text-neutral-500 dark:text-neutral-300'
          />
        </Button>
      </Tooltip>
      <AnimatePresence>
        {isCalendarVisible && (
          <motion.div
            ref={calendarRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.13 }}
            style={{ zIndex: 50 }}
          >
            <Calendar
              mode='single'
              selected={date ? new Date(date) : new Date()}
              onSelect={(date) => {
                setDate(date ? date.toISOString() : new Date().toISOString());
                setIsCalendarVisible(false);
              }}
              className='rounded-md border shadow absolute -translate-x-[calc(100%-2rem)] translate-y-1 bg-background'
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
