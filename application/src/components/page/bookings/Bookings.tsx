import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  createBookingsSocket,
  fetchAllBookingsCompactWithSearch,
  fetchBooking,
  fetchUserBookingsCompactWithSearch
} from '../../../api/BookingsApi.tsx';

import { usePermission } from '../../../hooks/usePermission.ts';
import { useToggleState } from '../../../hooks/useToggleState.ts';

import { Order } from '../../../types/order.ts';

import { BookingCompactModel } from '../../../models/BookingCompactModel.ts';
import { BookingModel } from '../../../models/BookingModel.ts';
import { RootState } from '../../../store/store';

import { apiRequestWrapper } from '../../../api/apiRequestWrapper/ApiRequestWrapper';

import { ActionSectionArticle } from '../../action';
import { BookingModal } from './BookingModal.tsx';
import { TextButton } from '../../input/buttons/TextButton';
import { EntryList } from '../../list';
import { Loader } from '../../loader/Loader.tsx';
import { Icon } from '../../icon';

import defaultProfilePicture from '/images/default-profile.jpg';

import { useDebounce } from '../../../hooks/useDebounce.ts';

export type BookingFilter = 'upcoming' | 'current' | 'archive';

export function Bookings() {
  const { text } = useSelector((state: RootState) => state.searchBarText);
  const userId = useSelector((state: RootState) => state.user.id);
  const hasUserPermissions = usePermission('EDITOR', 'ADMIN');

  const [allBookings, setAllBookings] = useState(hasUserPermissions);
  const [isLoading, setIsLoading] = useState(true);
  const [order, toggleOrder] = useToggleState<Order>('asc', 'desc');

  const [filter, setFilter] = useState<BookingFilter>('upcoming');
  const [bookingCounts, setBookingCounts] = useState<{ [key: string]: number }>({
    upcoming: 0,
    current: 0,
    archive: 0
  });
  const [partitionedBookings, setPartitionedBookings] = useState<BookingCompactModel[][]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingModel | null>(null);
  const debounce = useDebounce(500);
  const sortingOptionText = useMemo(() => {
    if (filter === 'archive') {
      return order === 'asc' ? ['Oldest first', 'Most recent first'] : ['Most recent first', 'Oldest first'];
    }
    return order === 'asc' ? ['Most recent first', 'Latest first'] : ['Latest first', 'Most recent first'];
  }, [order, filter]);

  // this should be calculated by the server?
  const updateBookingCounts = useCallback((bookings: BookingCompactModel[]) => {
    const counts: { [key: string]: number } = {
      upcoming: 0,
      current: 0,
      archive: 0
    };
    const current = new Date();
    current.setHours(0, 0, 0, 0);
    bookings.forEach(({ start, end }) => {
      if (start > current) {
        counts.upcoming++;
      }
      else if (start <= current && end >= current) {
        counts.current++;
      }
      else {
        counts.archive++;
      }
    });
    setBookingCounts(counts);
  }, []);

  // this should be calculated by the server?
  const partitionBookingsByMonth = useCallback(
    (bookings: BookingCompactModel[], filter: BookingFilter) => {
      const monthBookings: BookingCompactModel[][] = [];
      const current = new Date();
      current.setHours(0, 0, 0, 0);
      bookings.forEach((booking) => {
        const { start, end } = booking;
        const categoryMatches
  = (filter === 'upcoming' && start > current)
  || (filter === 'current' && start <= current && end >= current)
  || (filter === 'archive' && end < current);

        if (categoryMatches) {
          const month = start.getMonth();
          if (!monthBookings[month]) {
            monthBookings[month] = [];
          }
          monthBookings[month].push(booking);
        }
      });
      if (order == 'desc') {
        monthBookings.reverse();
      }
      setPartitionedBookings(monthBookings);
    },
    [order]
  );

  const handleCategoryClick = (filter: BookingFilter) => {
    setFilter(filter);
    toggleOrder(filter === 'archive' ? 'desc' : 'asc');
  };

  const handleEditClick = async (booking: BookingCompactModel) => {
    try {
      if (booking && booking.id) {
        const fullBooking = await fetchBooking(booking.id);
        setSelectedBooking(fullBooking);
        setShowModal(true);
      }
    }
    catch (error) {
      toast.error('Error fetching booking details');
    }
  };

  const fetchDataAndUpdate = async () => {
    let bookingsData, bookingError;
    setIsLoading(true);

    if (!hasUserPermissions || !allBookings) {
      [bookingsData, bookingError] = await apiRequestWrapper(() => fetchUserBookingsCompactWithSearch(userId, order, text));
    }
    else {
      [bookingsData, bookingError] = await apiRequestWrapper(() => fetchAllBookingsCompactWithSearch(order, text));
    }

    if (bookingError) {
      debounce(() => toast.error(bookingError.detail || 'Error fetching bookings'));
      setIsLoading(false);
      return;
    }
    if (bookingsData) {
      updateBookingCounts(bookingsData);
      partitionBookingsByMonth(bookingsData, filter);
      setIsLoading(false);
    }
  };

  const onWebSocketSubscribe = () => {
    // Just refetching becuse there is no good way of getting what you actualy need
    // from the response without sending over all of the redistered bookings which we
    // agreed not to do
    fetchDataAndUpdate();
  };

  const onWebSocketError = () => {
    debounce(() => toast.error('Sorry. No live updates'));
  };

  useEffect(() => {
    fetchDataAndUpdate();
  }, [order, filter, hasUserPermissions, userId, allBookings, updateBookingCounts, partitionBookingsByMonth, text]);

  useEffect(() => {
    const socket = createBookingsSocket();
    socket.onConnect = () => socket.subscribe('/topic/public', onWebSocketSubscribe);
    socket.onWebSocketError = onWebSocketError;
    socket.onStompError = onWebSocketError;

    socket.activate();

    return () => {
      socket.deactivate();
    };
  }, []);

  return (
    <ActionSectionArticle significance={100} emphasis={100}>
      <ActionSectionArticle.Heading>Bookings</ActionSectionArticle.Heading>
      <ActionSectionArticle.Paragraph>View and manage upcoming apartment reservations</ActionSectionArticle.Paragraph>

      <div className="mx-4 my-8 ml-0">
        {hasUserPermissions && (
          <div className="mb-4">
            <TextButton
              name="All bookings"
              significance={allBookings ? 600 : 500}
              emphasis={200}
              className="mr-3"
              onClick={() => setAllBookings(true)}
            />
            <TextButton
              name="My bookings"
              significance={!allBookings ? 600 : 500}
              emphasis={200}
              onClick={() => setAllBookings(false)}
            />
          </div>
        )}

        <div className="flex justify-between">
          <div className="flex">
            <TextButton
              name={`Upcoming (${bookingCounts.upcoming})`}
              significance={filter === 'upcoming' ? 300 : 200}
              emphasis={100}
              className="mr-2"
              onClick={() => handleCategoryClick('upcoming')}
            />
            <TextButton
              name={`Current (${bookingCounts.current})`}
              significance={filter === 'current' ? 300 : 200}
              emphasis={100}
              className="mr-2"
              onClick={() => handleCategoryClick('current')}
            />
            <TextButton
              name={`Archive (${bookingCounts.archive})`}
              significance={filter === 'archive' ? 300 : 200}
              emphasis={100}
              onClick={() => handleCategoryClick('archive')}
            />
          </div>
          <button className="flex justify-end font-bold" onClick={() => toggleOrder()}>
            {sortingOptionText[0]}
            <Icon type="tailless-arrow-down" className="size-6" />
          </button>
        </div>
      </div>
      <EntryList significance={300} emphasis={200}>
        {isLoading
          ? (<Loader />)
          : (partitionedBookings.map((bookings, index) => {
              /*
                TODO: We really need to implement some sort of localization support since everything's hardcoded in english.
                  (https://devbridge.atlassian.net/browse/RRSF2024S-92)
             */
              const locale = 'en';
              const entries = bookings.map((booking: BookingCompactModel) => {
                const { start, end } = booking;

                const duration = `${start.toLocaleDateString(locale, {
                  month: 'long',
                  day: 'numeric'
                })} - ${end.toLocaleString(
                  locale,
                  start.getMonth() === end.getMonth() ? { day: 'numeric' } : { month: 'long', day: 'numeric' }
                )}`;
                return (
                  <EntryList.Entry className="flex justify-between items-center" key={booking.id}>
                    <div className="flex flex-1 items-center">
                      <img
                        className="size-16 rounded-full object-cover flex-shrink-0"
                        alt="Profile picture"
                        src={booking.employeeCompact.profileBase64 || defaultProfilePicture}
                      />
                      <div className="mx-6">
                        <p className="text-xl leading-8">{`${booking.employeeCompact.firstName} ${booking.employeeCompact.lastName}`}</p>
                        <p className="text-lg leading-6 text-gray-500">
                          {`${booking.employeeCompact.jobTitle} `}
                          <span className="inline-block mx-1">•</span>
                          {` ${booking.employeeCompact.city}, ${booking.employeeCompact.country}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-1 justify-between max-w-2xl">
                      <div className="flex flex-1">
                        <div className="flex w-[11.26rem]">
                          <Icon type="calendar-unmarked" className="flex-shrink-0 size-6 mr-3" />
                          <p className="leading-6 text-lg truncate">{duration}</p>
                        </div>
                        <div className="flex w-[7.65rem] mx-4 relative group">
                          <Icon type="building" className="flex-shrink-0 size-6 mr-3" />
                          <p className="leading-6 text-lg truncate">{booking.apartmentName}</p>
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-white text-gray-600 text-sm text-center rounded py-1 px-2 min-w-[150px] whitespace-nowrap border border-gray-100">
                            {booking.apartmentName}
                          </span>
                        </div>
                        <div className="flex w-[10.25rem]">
                          <Icon type="door" className="flex-shrink-0 size-6 mr-3" />
                          <p className="leading-6 text-lg truncate">{booking.roomName}</p>
                        </div>
                      </div>
                      {(hasUserPermissions || booking.employeeId === userId) && (
                        <TextButton
                          type="button"
                          name="Edit"
                          significance={200}
                          emphasis={200}
                          onClick={() => handleEditClick(booking)}
                          className="ml-2"
                        />
                      )}
                    </div>
                  </EntryList.Entry>
                );
              });

              /*
              TODO: We are using bookings[0].start to retrieve month's booking's month index. We can't use indices because
                .reverse() used for sorting order would transform indices in reverse order, and there is no standard
                reversedMap() function that would map() elements in backwards order while preserving indices as-is. This
                would not be a problem at all if this sorting logic would be in the serverside instead.
                (https://devbridge.atlassian.net/browse/RRSF2024S-93)
              */
              const monthName = bookings[0].start.toLocaleString(locale, {
                month: 'long'
              });
              const visits = bookings.length;
              return (
                <EntryList.Category
                  name={monthName}
                  description={`${visits} ${visits === 1 ? 'visit' : 'visits'}`}
                  key={index}
                >
                  {...entries}
                </EntryList.Category>
              );
            })
            )}
      </EntryList>
      {showModal && selectedBooking && (
        <BookingModal
          isEditing={true}
          booking={selectedBooking}
          onClose={() => {
            setShowModal(false);
            setSelectedBooking(null);
          }}
          refetchBookingsData={fetchDataAndUpdate}
        />
      )}
    </ActionSectionArticle>
  );
}
