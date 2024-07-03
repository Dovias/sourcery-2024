import React, { useEffect, useState } from 'react';
import { IMessage } from '@stomp/stompjs';

import { CalendarDiagram } from './CalendarDiagram';
import { SchedulerData } from '@justuxs/react-scheduler';
import { createBookingsSocket, fetchCalendarData } from '../../../api/BookingsApi';
import { toast } from 'react-toastify';
import { apiRequestWrapper } from '../../../api/apiRequestWrapper/ApiRequestWrapper';
import { useDebounce } from '../../../hooks/useDebounce';

export const Calendar: React.FC = () => {
  const [data, setData] = useState<SchedulerData>([]);
  const [isLoading, setIsLoading] = useState(true);
  const debounce = useDebounce(500);

  const onWebSocketSubscribe = (data: IMessage) => {
    // Sending over only the changed data would be combersome as data is a type
    // declared in the @justuxs/react-scheduler project and it's a complex type
    // so I'm just sending over all of the calendar data
    const parsed = JSON.parse(data.body);
    setData(parsed);
  };

  const onWebSocketError = () => {
    debounce(() => toast.error('Sorry. No live updates'));
  };

  useEffect(() => {
    const client = createBookingsSocket();
    client.onConnect = () => {
      client.subscribe('/topic/public', onWebSocketSubscribe);
    };
    client.onWebSocketError = onWebSocketError;
    client.onStompError = onWebSocketError;
    client.activate();
    fetchData();

    return () => {
      client.deactivate();
    };
  }, []);

  const fetchData = async () => {
    if (!data) {
      setIsLoading(true);
    }

    const [calendarData, serverError] = await apiRequestWrapper(fetchCalendarData);

    if (serverError) {
      toast.error(serverError.detail || 'Error getting calendar data');
      setIsLoading(false);
      return;
    }
    setData(calendarData);
    setIsLoading(false);
  };

  return (
    <>
      <CalendarDiagram data={data} isLoading={isLoading} refresh={fetchData} />
    </>
  );
};
