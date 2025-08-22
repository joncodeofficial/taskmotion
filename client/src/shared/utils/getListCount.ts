import { ListProps } from '@shared/types/list.types';
import { format, isSameDay, subDays } from 'date-fns';

export const getListCount = (lists: ListProps[]) => {
  const total = lists.reduce((acc, list) => acc + list.tasks.length, 0);

  const completed = lists.reduce(
    (acc, list) => acc + list.tasks.filter((task) => task.checked).length,
    0
  );

  const overdue = lists.reduce((acc, list) => {
    const today = new Date();
    return (
      acc +
      list.tasks.filter((task) => (task.date ? !task.checked && !isSameDay(today, task.date) : 0))
        .length
    );
  }, 0);

  const pending = total - completed - overdue;

  const last7DaysStats = Array.from({ length: 7 }, (_, index) => {
    const date = subDays(new Date(), index);

    const completedTasksForDay = lists.reduce((acc, list) => {
      return (
        acc +
        list.tasks.filter(
          (task) => task.checked && task.date && isSameDay(new Date(task.date), date)
        ).length
      );
    }, 0);

    return {
      name: format(date, 'EEE'),
      tasks: completedTasksForDay,
    };
  }).reverse();

  const lastMonthStats = (() => {
    const today = new Date();

    return Array.from({ length: 30 }, (_, index) => {
      const date = subDays(today, 29 - index); // Start from 29 days ago to include today

      const tasksForDay = lists.reduce((acc, list) => {
        return (
          acc +
          list.tasks.filter((task) => task.date && isSameDay(new Date(task.date), date)).length
        );
      }, 0);

      return {
        name: format(date, 'd MMM'), // Day and month abbreviated (e.g., "15 Mar")
        tasks: tasksForDay,
      };
    });
  })();

  const completedAux = Math.round((completed * 100) / total);
  const pendingAux = Math.round((pending * 100) / total);
  const overdueAux = 100 - completedAux - pendingAux;

  const completedPercentage = isNaN(completedAux) ? 100 : completedAux;
  const pendingPercentage = isNaN(pendingAux) ? 0 : pendingAux;
  const overduePercentage = isNaN(overdueAux) ? 0 : overdueAux;

  return {
    total,
    completed,
    completedPercentage,
    pending,
    pendingPercentage,
    overdue,
    overduePercentage,
    last7DaysStats,
    lastMonthStats,
  };
};
