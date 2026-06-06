import HeatMap from '@uiw/react-heat-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ActivityPoint } from '@/shared/services/activityService';
import { useEffect, useRef } from 'react';

type Props = { data: ActivityPoint[] };

const startDate = new Date();
startDate.setFullYear(startDate.getFullYear() - 1);

export const ActivityCalendar = ({ data }: Props) => {
  const isDark = document.documentElement.classList.contains('dark');
  const containerRef = useRef<HTMLDivElement>(null);

  const heatmapData = data.map(({ date, count }) => ({
    date: date.replace(/-/g, '/'),
    count,
  }));

  useEffect(() => {
    const svg = containerRef.current?.querySelector('svg');
    if (!svg) return;
    svg.setAttribute('width', '100%');
    svg.setAttribute('preserveAspectRatio', 'none');
  }, [data]);

  return (
    <Card className='bg-neutral-50 dark:bg-neutral-900'>
      <CardHeader>
        <CardTitle className='text-neutral-700 dark:text-neutral-50'>Activity</CardTitle>
      </CardHeader>
      <CardContent className='pb-4'>
        <div ref={containerRef} className='w-full overflow-hidden'>
          <HeatMap
            value={heatmapData}
            startDate={startDate}
            endDate={new Date()}
            weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
            rectSize={12}
            space={2}
            panelColors={{
              0: isDark ? '#262626' : '#f5f5f5',
              1: '#bbf7d0',
              3: '#86efac',
              6: '#4ade80',
              10: '#16a34a',
            }}
            rectProps={{ rx: 2 }}
            style={{ color: isDark ? '#a3a3a3' : '#737373' }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
