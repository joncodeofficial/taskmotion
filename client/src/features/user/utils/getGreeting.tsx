import { getHours } from 'date-fns';

export const getGreeting = (): string => {
  const currentHour = getHours(new Date());
  if (currentHour >= 5 && currentHour < 12) return 'Good morning!';
  if (currentHour >= 12 && currentHour < 18) return 'Good afternoon!';
  if (currentHour >= 18 && currentHour < 22) return 'Good evening!';
  return 'Good night!';
};
