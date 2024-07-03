import React, { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useBeforeUnload } from '../../../hooks/useBeforeUnload.ts';

import { AppRoutes } from '../../../routes';

import { ApartmentModel } from '../../../models/ApartmentModel.ts';

import { createApartment } from '../../../api/ApartmentsApi.ts';

import { ApartmentForm } from './ApartmentForm.tsx';

const blankApartment: ApartmentModel = {
  name: '',
  description: '',
  country: '',
  city: '',
  postalCode: '',
  address: '',
  rooms: [],
  photos64: []
};

export const NewApartment: React.FC = () => {
  const [apartment, setApartment] = useState<ApartmentModel>(blankApartment);
  const navigate = useNavigate();
  const [confirmedApartmentName, setConfirmedApartmentName] = useState<string>('New Apartment');
  const queryClient = useQueryClient();

  useBeforeUnload();

  const mutation = useMutation({
    mutationFn: async (apartmentModel: ApartmentModel) => {
      return createApartment(apartmentModel);
    },
    onSuccess: (newApartment) => {
      setConfirmedApartmentName(apartment.name);
      queryClient.invalidateQueries({ queryKey: [AppRoutes.APARTMENTS], refetchType: 'all' });
      toast.success('Appartment created successfuly');
      navigate(`${AppRoutes.APARTMENTS}/${newApartment.id}`);
    }
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const allRoomsHavePhotos: boolean = apartment.rooms.every((room) => {
      return room.photos.length > 0 && room.photos.every((roomPhoto) => {
        return roomPhoto.photoBase64 && roomPhoto.photoBase64 !== '';
      });
    });

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

  return (
    <ApartmentForm
      handleSubmit={handleSubmit}
      apartment={apartment}
      confirmedApartmentName={confirmedApartmentName}
      setApartment={setApartment}
      submitButtonText="Create apartment"
      isCreation
    />
  );
};
