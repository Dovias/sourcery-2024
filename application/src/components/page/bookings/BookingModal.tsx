import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { BookingModel } from '../../../models/BookingModel';
import { ApartmentModel } from '../../../models/ApartmentModel';
import { RoomModel } from '../../../models/RoomModel';

import { createBooking as handleSaveApi, handleSaveChanges } from '../../../api/BookingsApi';
import { fetchAllApartmentsNoPhotosNoSearchQuery } from '../../../api/ApartmentsApi';
import { apiRequestWrapper } from '../../../api/apiRequestWrapper/ApiRequestWrapper';

import { useDebounce } from '../../../hooks/useDebounce';

import { TextButton } from '../../input/buttons/TextButton';
import { Icon } from '../../icon';

interface BookingModalProps {
  onClose: () => void
  booking: BookingModel
  refetchBookingsData: () => void
  isEditing: boolean
}

export const BookingModal: React.FC<BookingModalProps> = ({ onClose, booking, refetchBookingsData, isEditing }) => {
  const [apartments, setApartments] = useState<ApartmentModel[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<ApartmentModel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomModel | null>(booking?.room || null);
  const [note, setNote] = useState<string>(booking?.note || '');

  const [startDate, setStartDate] = useState<Date | string>(booking?.start ? booking.start : '');
  const [endDate, setEndDate] = useState<Date | string>(booking?.end ? booking.end : '');

  const inputStartDateRef = useRef<HTMLInputElement>(null);
  const inputEndDateRef = useRef<HTMLInputElement>(null);

  const [isEditingBooking] = useState<boolean>(isEditing);
  const debounce = useDebounce(500);

  const formatDate = (date: Date | string): string => {
    if (date instanceof Date) {
      // Adjust the date to UTC to ensure consistency
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      // Format the date to 'YYYY-MM-DD'
      return utcDate.toISOString().split('T')[0];
    }
    return date;
  };

  const handleApartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const apartmentId = event.target.value;
    const selectedApartment = apartments.find(apartment => apartment.id === apartmentId);
    setSelectedApartment(selectedApartment || null);
    const firstRoomOfNewApartment = selectedApartment?.rooms[0];
    setSelectedRoom(firstRoomOfNewApartment || null);
  };

  const handleRoomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const roomId = event.target.value;
    const selectedRoom = selectedApartment?.rooms.find(room => room.id === roomId);
    setSelectedRoom(selectedRoom || null);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(event.target.value);
  };

  const isValidDateFormat = (dateString: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(dateString);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    const parsedDate = new Date(inputValue);
    if (!isNaN(parsedDate.getTime()) && isValidDateFormat(inputValue)) {
      setStartDate(parsedDate);
    }
    else {
      if (inputStartDateRef.current) {
        inputStartDateRef.current.value = formatDate(startDate);
      }
    }
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    const parsedDate = new Date(inputValue);
    if (!isNaN(parsedDate.getTime()) && isValidDateFormat(inputValue)) {
      setEndDate(parsedDate);
    }
    else {
      if (inputEndDateRef.current) {
        inputEndDateRef.current.value = formatDate(endDate);
      }
    }
  };

  useEffect(() => {
    const fetchApartmentsAndRooms = async () => {
      const [fetchedApartments, serverError] = await apiRequestWrapper(fetchAllApartmentsNoPhotosNoSearchQuery);
      if (serverError) {
        debounce(() => toast.error(serverError.detail || 'Error fetching apartments:'));
        return;
      }
      if (booking && booking.apartment) {
        setApartments(fetchedApartments);
        const selectedApartment = fetchedApartments.find(apartment => apartment.id === booking.apartment.id);
        setSelectedApartment(selectedApartment || null);
        setSelectedRoom(booking.room || null);
      }
    };
    fetchApartmentsAndRooms();
  }, [booking]);

  async function handleSave() {
    if (isEditingBooking) {
      try {
        await handleSaveChanges(
          booking,
          selectedRoom,
          selectedApartment,
          startDate,
          endDate,
          note,
          onClose,
          refetchBookingsData
        );
        toast.success('Your reservation has been successfully changed');
      }
      catch (error) {
        // @ts-expect-error This is error
        toast.error(error.message);
      }
    }
    else {
      try {
        await handleSaveApi(booking, selectedRoom, selectedApartment, startDate, endDate, note, onClose, refetchBookingsData);
        toast.success('Your reservation has been successfully created');
      }
      catch (error) {
        // @ts-expect-error This is error
        // FIXME: Its not guaranteed to be the error of that type.
        toast.error(error.message);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-4 min-w-[470px]">
        <div className="relative mb-3 flex items-center justify-center mt-2">
          <h2
            className="absolute left-1/2 transform -translate-x-1/2"
          >
            {isEditingBooking ? 'Edit reservation' : 'Reserve a room'}
          </h2>
          <button type="button" className="absolute right-0" onClick={onClose}>
            <Icon type="cross" className="size-6 transition hover:scale-125 active:scale-100" />
          </button>
        </div>
        <hr className="mb-2"></hr>
        <div>
          <span className="text-base text-gray-500 mb-2">Guest</span>
          <div className="flex flex-col">
            <div className="flex">
              <Icon type="person" className="size-6 mr-3 mt-1" />
              <div className="flex items-center border border-gray-300 rounded-lg py-1 px-2 mb-2 w-full">
                <h3 className="mr-20">{booking.employee.firstName + ' ' + booking.employee.lastName}</h3>
              </div>
            </div>
          </div>
        </div>

        <div>
          <span className="text-base text-gray-500 mb-2">When</span>
          <div className="flex">
            <div className="mr-3">
              <Icon type="calendar-marked" className="size-6 mt-1" />
            </div>
            <div className="w-full">
              <div className="flex items-center border border-gray-300 rounded-lg py-1 px-2 mb-2">
                <h6 className="text-xs text-gray-500 mr-2">From</h6>
                <div className="flex items-center">
                  <input
                    ref={inputStartDateRef}
                    className="w-full outline-none appearance-none"
                    type="date"
                    defaultValue={startDate instanceof Date ? formatDate(startDate) : ''}
                    onBlur={handleStartDateChange}
                  />
                </div>
              </div>
              <div className="flex items-center border border-gray-300 rounded-lg py-1 px-2 mb-2">
                <h6 className="text-xs text-gray-500 mr-2">To</h6>
                <div className="flex items-center">
                  <input
                    ref={inputEndDateRef}
                    className="w-full outline-none appearance-none"
                    type="date"
                    defaultValue={endDate instanceof Date ? formatDate(endDate) : ''}
                    onBlur={handleEndDateChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span className="text-base text-gray-500 mb-2">Where</span>
          <div className="flex flex-col">
            <div className="flex">
              <Icon type="building" className="size-6 mr-3 mt-1" />
              <div className="flex items-center border border-gray-300 rounded-lg py-1 px-2 mb-2 w-full">
                <select
                  className="w-full outline-none"
                  onChange={handleApartmentChange}
                  value={selectedApartment?.id || ''}
                >
                  {apartments.map(apartment => (
                    <option key={apartment.id} value={apartment.id}>
                      {apartment.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex">
              <Icon type="door" className="size-6 mr-3 mt-1" />
              <div className="flex items-center border border-gray-300 rounded-lg py-1 px-2 mb-2 w-full">
                <select className="w-full outline-none" onChange={handleRoomChange} value={selectedRoom?.id || ''}>
                  {selectedApartment?.rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span className="text-base text-gray-500">Notes</span>
          <div className="flex mb-3">
            <Icon type="lines" className="size-6 mr-3 mt-1" />
            <div className="flex w-full">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={note}
                onChange={handleNoteChange}
                placeholder="Leave note..."
                rows={4}
              />
            </div>
          </div>
        </div>
        <hr className="mb-2"></hr>
        <div className="flex justify-center">
          <TextButton
            className="ml-4"
            name="Cancel"
            type="button"
            significance={300}
            emphasis={200}
            onClick={onClose}
          />
          <TextButton
            className="ml-4"
            name={isEditing ? 'Save changes' : 'Reserve'}
            type="button"
            emphasis={200}
            significance={400}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
};
