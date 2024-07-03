import React from 'react';
import { Icon } from '../../icon/Icon';
import { TextButton } from '../../input/buttons/TextButton';
import { CalendarBookingModel } from '../../../models/CalendarBookingModel';

import defaultProfilePicture from '/images/default-profile.jpg';

export interface AboutDataProps extends CalendarBookingModel {
  apartment: string
  apartmentAddress: string
  room: string
}

interface AboutModalProps {
  data: AboutDataProps | null
  isAllowChange: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => Promise<void>
}

export const AboutModal: React.FC<AboutModalProps> = ({
  data,
  onClose,
  isAllowChange,
  onEdit,
  onDelete
}) => {
  if (!data) {
    return null;
  }

  const formatDate = (dob: Date): string => {
    const date = new Date(dob);
    const month = date.toLocaleString('default', { month: 'long' });
    const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
    const weekday = new Intl.DateTimeFormat('en-US', options).format(date);
    const day = date.getDate();
    return `${month} ${day}, ${weekday}`;
  };

  const title = data.title || '';
  const subtitle = data.subtitle || '';
  const startDate = formatDate(data.startDate);
  const endDate = formatDate(data.endDate);
  const profilePicture = data.icon || '';
  const note = data.description || '';
  const apartment = data.apartment || '';
  const apartmentAddress = data.apartmentAddress || '';
  const room = data.room || '';

  return (
    <div className="fixed z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 w-[300px] border-solid border-2">
        <div className="flex justify-between mb-3">
          <div className="flex items-center">
            <div className="mr-4">
              <img
                className="w-10 h-10 mr-4 object-cover rounded-full flex-shrink-0"
                alt="Avatar"
                src={profilePicture ? profilePicture : defaultProfilePicture}
              />
            </div>
            <div>
              <p className="text-base">{title}</p>
              <p className="text-sm">{subtitle}</p>
            </div>
          </div>
          <button type="button" onClick={onClose}>
            <Icon type="cross" className="size-6 transition hover:scale-125 active:scale-100" />
          </button>
        </div>
        <hr className="mb-2"></hr>
        <div>
          <span className="text-xs text-gray-500 mb-2">When</span>
          <div className="flex">
            <div className="mr-3 min-w-6">
              <Icon type="calendar-marked" className="size-6" />
            </div>
            <div className="w-full">
              <div className="flex items-center py-1 mb-2">
                <h6 className="text-base">
                  {startDate}
                  {' - '}
                  {endDate}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-500 py-1 mb-2">Where</span>
          <div className="flex flex-col">
            <div className="flex">
              <Icon type="building" className="size-6 mr-3" />
              <div className="flex flex-col py-1">
                <p className="text-base">{apartment}</p>
                <p className="text-sm break-words text-gray-400">
                  {' '}
                  {apartmentAddress}
                </p>
              </div>
            </div>
            <div className="flex">
              <Icon className="size-6 mr-3" type="door" />
              <div className="flex flex-col py-1">
                <p className="text-base">{room}</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-500">Notes</span>
          <div className="flex mb-3">
            <Icon className="size-6 mr-3" type="lines" />
            <div className="flex w-full">
              <textarea
                readOnly={true}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                value={note}
                placeholder="No notes yet"
                rows={3}
              />
            </div>
          </div>
        </div>
        {isAllowChange
        && (
          <>
            <hr className="mb-2"></hr>
            <div className="flex">
              <TextButton
                className="ml-12"
                name="Delete"
                type="button"
                significance={200}
                emphasis={200}
                onClick={onDelete}
              />
              <TextButton
                className="ml-4"
                name="Edit"
                type="button"
                emphasis={200}
                significance={400}
                onClick={onEdit}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
