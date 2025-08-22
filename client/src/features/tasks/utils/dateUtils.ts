import { isPast, isToday, startOfDay, format } from 'date-fns';

export const dateStyle = (dateString: string) => {
  const date = new Date(dateString);

  if (isToday(date)) return 'bg-amber-400/10 text-amber-500';

  return isPast(startOfDay(date)) ? 'bg-red-400/10 text-red-500' : 'bg-green-400/10 text-green-500';
};

export const dateText = (dateString: string) => {
  const date = new Date(dateString);
  return isToday(date) ? 'Today' : format(date, 'd MMM');
};
