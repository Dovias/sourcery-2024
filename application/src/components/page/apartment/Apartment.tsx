import React, { FormEvent, useEffect, useState } from 'react';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AppRoutes } from '../../../routes';

import { ApartmentModel } from '../../../models/ApartmentModel.ts';

import { fetchApartmentByIdWithoutRoomPhotos, fetchRoomPhotosByApartmentId, updateApartment } from '../../../api/ApartmentsApi.ts';

import { ApartmentForm } from './ApartmentForm.tsx';

export const Apartment: React.FC = () => {
  const { id } = useParams();
  const queryKey = `apartment_${id}`;
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery<ApartmentModel>({
    queryKey: [queryKey],
    queryFn: async () => fetchApartmentByIdWithoutRoomPhotos(`${id}`)
  });
  const [apartment, setApartment] = useState<ApartmentModel>(data);
  const [confirmedApartmentName, setConfirmedApartmentName] = useState<string>(data.name);
  const [roomPhotosFetched, setRoomPhotosFetched] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: (apartmentModel: ApartmentModel) => {
      return updateApartment(apartmentModel, id || '');
    },
    onSuccess: () => {
      toast.success('Apartment changes saved successfully!');
      queryClient.invalidateQueries({ queryKey: [queryKey, AppRoutes.APARTMENTS], refetchType: 'all' });
      setConfirmedApartmentName(apartment.name);
    }
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const allRoomsHavePhotos: boolean = apartment.rooms.every((room) => {
      return room.photos.length > 0 && room.photos.every((roomPhoto) => {
        return roomPhoto.photoBase64 && roomPhoto.photoBase64 !== '';
      });
    });

    // Notifications are being worked on by someone else. This should be fixed during the next sprint
    if (!apartment.photos64[0] || apartment.photos64[0].photo64 === '') {
      toast.error('The apartment must have photos.');
      return;
    }
    if (!apartment.rooms || apartment.rooms.length === 0) {
      toast.error('Apartment must have at least one room.');
      return;
    }
    if (!allRoomsHavePhotos) {
      toast.error('All rooms must have photos.');
      return;
    }
    mutation.mutate(apartment);
  };

  useEffect(() => {
    setApartment(data);
    setRoomPhotosFetched(false);
  }, [data]);

  useEffect(() => {
    if (!apartment || roomPhotosFetched)
      return;

    const fetchRoomPhotos = async () => {
      try {
        if (apartment.id) {
          const roomPhotos = await fetchRoomPhotosByApartmentId(apartment.id);
          const updatedRooms = apartment.rooms.map(room => ({
            ...room,
            photos: roomPhotos.filter(photo => photo.roomId === room.id)
          }));
          setApartment(prevApartment => ({
            ...prevApartment,
            rooms: updatedRooms
          }));

          setRoomPhotosFetched(true);
        }
      }
      catch (error) {
        toast.error('Failed to load room photos');
      }
    };

    if (apartment.rooms && apartment.rooms.length > 0) {
      fetchRoomPhotos();
    }
  }, [apartment.rooms, roomPhotosFetched]);

  return (
    <ApartmentForm
      apartment={apartment}
      confirmedApartmentName={confirmedApartmentName}
      setApartment={setApartment}
      handleSubmit={handleSubmit}
      submitButtonText="Update apartment"
    />
  );
};
