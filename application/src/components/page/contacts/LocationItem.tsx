import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { LocationsModel } from '../../../models/LocationsModel';
import { Loader } from '../../loader/Loader';
import { toast } from 'react-toastify';
import { Icon } from '../../icon';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon from '../../../icons/location/marker-icon.png';
import markerIcon2x from '../../../icons/location/marker-icon-2x.png';
import markerShadow from '../../../icons/location/marker-shadow.png';
import { useDebounce } from '../../../hooks/useDebounce';

interface LocationItemProps {
  location: LocationsModel
}

const DefaultMarkerIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -36],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultMarkerIcon;

export const LocationItem: React.FC<LocationItemProps> = ({ location }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const apiKey = import.meta.env.VITE_HERE_API_KEY;
  const markerRef = useRef<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const debounce = useDebounce(600);

  useEffect(() => {
    if (!position) {
      setIsLoading(true);
      const fetchCoordinates = async () => {
        const fullAddress = encodeURIComponent(`${location.address}, ${location.city}, ${location.postalCode}, ${location.country}`);
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${fullAddress}`;

        try {
          const response = await fetch(url);
          const data = await (response.json());
          if (data[0]) {
            setPosition([data[0].lat, data[0].lon]);
          }
          else {
            debounce(() => toast.error('No coordinates found for this address'));
          }
        }
        catch (error) {
          debounce(() => toast.error('Error. Map not found.'));
        }
        finally {
          setIsLoading(false);
        }
      };

      fetchCoordinates();
    }
  }, [location]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [position]);

  if (isLoading) {
    return <div className="flex rounded-lg border border-gray-300 mx-auto p-6 m-8 mb-14 h-[400px]"><Loader /></div>;
  }

  return (

    <div className="flex rounded-lg border border-gray-300 mx-auto p-6 m-8 mb-14">

      <div className="pr-6 flex flex-1 justify-center items-center" style={{ flex: '2', zIndex: 0 }}>
        {position
          ? (
            <MapContainer
              center={position}
              zoom={15}
              scrollWheelZoom={false}
              style={{
                height: '400px',
                width: '100%',
                borderRadius: '10px',
                overflow: 'hidden'
              }}
            >
              <TileLayer
                url={`https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png?apiKey=${apiKey}`}
                attribution="Map data &copy; HERE 2024"
              />
              <Marker position={position} ref={markerRef}>
                <Popup>
                  <section className="font-bold">
                    Cognizant Apartments&nbsp;
                    {location.country.toUpperCase()}
                  </section>
                  {location.address}
                  ,&nbsp;
                  {location.city}
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`} target="_blank" rel="noopener noreferrer"> (Get Directions)</a>
                </Popup>
              </Marker>
            </MapContainer>
            )
          : (
            <Icon type="broken" className="size-10 fill-gray-300" />
            )}
      </div>

      <div className="rounded-lg text-gray-600 border border-gray-300 p-2 sm:p-4 md:p-6 max-h-400 max-w-80" style={{ flex: '1' }}>
        <div className="p-1 sm:p-2 md:p-2 lg:p-6">
          <h3 className="font-bold text-lg md:text-xl">Address</h3>
          <div className="text-lg md:text-lg">
            <p>{location.address}</p>
            <p>{location.city}</p>
            <p>{location.country}</p>
            <p>{location.postalCode}</p>
          </div>

          {location.apartmentNames && location.apartmentNames.length > 0 && (
            <div className="mt-4 text-lg">
              <p className="font-bold text-lg">Apartments:</p>
              <ul className="text-lg">
                {location.apartmentNames.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

    </div>

  );
};
