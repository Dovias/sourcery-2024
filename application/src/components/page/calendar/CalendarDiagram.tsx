import React, { useEffect, useState } from 'react';
import {
  Scheduler,
  SchedulerRow,
  SchedulerData,
  SchedulerCellClickData,
  SchedulerProjectData
} from '@justuxs/react-scheduler';
import { MousePosition, useMouse } from '@uidotdev/usehooks';
import { AboutDataProps, AboutModal } from './AboutModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { BookingModel } from '../../../models/BookingModel.ts';
import { BookingModal } from '../bookings/BookingModal.tsx';
import { deleteBooking as deleteBookingApi, fetchBooking, getDummyBooking } from '../../../api/BookingsApi.tsx';
import { toast } from 'react-toastify';
import { ConfirmationModal } from '../../modal/ConfirmationModal';
import { Loader } from '../../loader/Loader.tsx';

interface CalendarDiagramProps {
  data: SchedulerData
  isLoading: boolean
  refresh: () => Promise<void>
}

export const CalendarDiagram: React.FC<CalendarDiagramProps> = ({ data, isLoading, refresh }) => {
  const userId = useSelector((state: RootState) => state.user.id);
  const currentUserRole = useSelector((state: RootState) => state.user.role?.roleName.toUpperCase());
  const currentUserCanEdit = currentUserRole === 'ADMIN' || currentUserRole === 'EDITOR';
  const [mouse, ref] = useMouse() as [MousePosition, React.MutableRefObject<HTMLElement>];
  const [elementW, setElementW] = useState(0);
  const [elementH, setElementH] = useState(0);
  const [isDisplayingAboutModal, SetIsDisplayingAboutModal] = useState(false);
  const [aboutModalX, setAboutModalX] = useState(0);
  const [aboutModalY, setAboutModalY] = useState(0);
  const [aboutModalDataProps, setAboutModalDataProps] = useState<AboutDataProps | null>(null);
  const [isAllowChangeAboutModal, setIsAllowChangeAboutModal] = useState<boolean>(currentUserCanEdit);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [reserveBooking, setReserveBooking] = useState<BookingModel | null>(null);
  const [isEditingBooking, setIsEditingBooking] = useState<boolean>(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);

  const xIntersecting = mouse.elementX > 0 && mouse.elementX < elementW;
  const yIntersecting = mouse.elementY > 0 && mouse.elementY < elementH;
  const isIntersecting = xIntersecting && yIntersecting;

  const aboutModalH = 400;
  const aboutModalW = 240;
  const mouseDif = 70;

  const positionX = mouse.elementX + mouseDif + aboutModalW > elementW ? elementW - aboutModalW : mouse.elementX + mouseDif;
  const positionY = mouse.elementY + mouseDif + aboutModalH > elementH ? elementH - aboutModalH : mouse.elementY + mouseDif;

  useEffect(() => {
    setElementW(ref.current ? ref.current.offsetWidth : 0);
    setElementH(ref.current ? ref.current.offsetHeight : 0);
    !isIntersecting && closeAboutModal();
  }, [ref.current, isIntersecting]);

  function closeAboutModal() {
    SetIsDisplayingAboutModal(false);
  }

  const displayAbout = (schedulerProjectData: SchedulerProjectData) => {
    currentUserCanEdit || schedulerProjectData.ownerId === userId
      ? setIsAllowChangeAboutModal(true)
      : setIsAllowChangeAboutModal(false);
    const row: SchedulerRow | undefined = data.find(row =>
      row.data.some(data => data.id === schedulerProjectData.id)
    );
    if (row == undefined) return;
    const aboutProps: AboutDataProps = {
      ...schedulerProjectData,
      room: row.label.title ? row.label.title : '',
      apartment: row.label.subtitle ? row.label.subtitle : '',
      apartmentAddress: row.label.description ? row.label.description : ''
    };
    setAboutModalDataProps(aboutProps);
    setAboutModalX(positionX);
    setAboutModalY(positionY);
    SetIsDisplayingAboutModal(true);
  };

  const displayReserve = async (cellClickData: SchedulerCellClickData) => {
    SetIsDisplayingAboutModal(false);
    try {
      const booking: BookingModel = await getDummyBooking(
        cellClickData.rowId,
        userId,
        cellClickData.date,
        cellClickData.date
      );
      setReserveBooking(booking);
      setIsEditingBooking(false);
      setShowBookingModal(true);
    }
    catch (error) {
      // @ts-expect-error This is error
      toast.error(error.message);
    }
  };

  async function deleteBooking(id: string) {
    try {
      await deleteBookingApi(id);
      toast.success('Successfully deleted');
      await refreshCalendar();
      closeAboutModal();
    }
    catch (error) {
      toast.error('Error deleting booking');
    }
  }

  async function editBookingClick(id: string) {
    try {
      setReserveBooking(await fetchBooking(id));
      setIsEditingBooking(true);
      closeAboutModal();
      setShowBookingModal(true);
    }
    catch (error) {
      toast.error('This booking is not found');
      await refreshCalendar();
    }
  }

  const refreshCalendar = async () => {
    await refresh();
  };

  return (
    <>
      {isLoading
        ? (
          <Loader />
          )
        : (
          <>
            {isDisplayingAboutModal && (
              <div style={{ left: aboutModalX, top: aboutModalY }} className="absolute">
                <AboutModal
                  data={aboutModalDataProps}
                  isAllowChange={isAllowChangeAboutModal}
                  onClose={() => {
                    closeAboutModal();
                  }}
                  onEdit={() => editBookingClick(`${aboutModalDataProps?.id}`)}
                  onDelete={async () => {
                    setIsConfirmationOpen(true);
                  }}
                >
                </AboutModal>
              </div>
            )}
            {showBookingModal && reserveBooking && (
              <BookingModal
                isEditing={isEditingBooking}
                booking={reserveBooking}
                onClose={async () => {
                  setShowBookingModal(false);
                  setReserveBooking(null);
                }}
                refetchBookingsData={refreshCalendar}
              />
            )}

            <article ref={ref} className="relative h-full">
              <Scheduler
                data={data}
                isLoading={isLoading}
                onTileClick={clickedResource => displayAbout(clickedResource)}
                onCellClick={cell => displayReserve(cell)}
                config={{
                  zoom: 1,
                  filterButtonState: -1,
                  includeTakenHoursOnWeekendsInDayView: true,
                  maxRecordsPerPage: 200
                }}
              />
            </article>
          </>
          )}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        heading="Remove booking"
        text="Are you sure you want to delete this booking?"
        closeModal={() => setIsConfirmationOpen(false)}
        onConfirm={() => {
          deleteBooking(`${aboutModalDataProps?.id}`);
          setIsConfirmationOpen(false);
        }}
        overlay
        disableScroll
      />
    </>
  );
};
