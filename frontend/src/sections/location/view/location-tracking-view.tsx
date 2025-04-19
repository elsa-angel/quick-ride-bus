import { Box, Typography } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';

import axiosInstance from 'src/api/axios-instance';

import { MapContainer, Marker, TileLayer, useMapEvent, MapContainerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import L, { LatLngExpression, Marker as LeafletMarker } from 'leaflet';
import 'leaflet-routing-machine';
import { useEffect, useRef, useState } from 'react';

// const busDivIcon = L.divIcon({
//   html: '🚌',
//   className: '',
//   iconSize: [0, 0],
// });

// Component for handling routing and animation on map click
interface RoutingProps {
  markerRef: React.RefObject<LeafletMarker>;
}

const Routing: React.FC<RoutingProps> = ({ markerRef }) => {
  const map = useMapEvent('click', (e) => {
    const destination = e.latlng;

    (L as any).Routing.control({
      waypoints: [L.latLng(markerRef.current?.getLatLng()!), destination],
      createMarker: () => null, // Do not place default markers
      showAlternatives: false,
      routeControl: false,
    })
      .on('routesfound', (e: any) => {
        const route = e.routes[0];
        const coordinates = route.coordinates;

        coordinates.forEach((coord: any, index: number) => {
          setTimeout(() => {
            if (markerRef.current) {
              markerRef.current.setLatLng([coord.lat, coord.lng]);
            }
          }, 500 * index);
        });
      })
      .addTo(map);

    // Hide the routing details container (this hides the alternatives box)
    // const routingContainer = document.querySelector('.leaflet-routing-container') as HTMLElement;

    // if (routingContainer) {
    //   routingContainer.style.display = 'none';
    // }
  });

  return null;
};

export default function LocationTrackingView() {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<LeafletMarker>(null);
  const [position] = useState<LatLngExpression>([9.9692, 76.319]);
  const [coordinates, setCoordinates] = useState<Array<[number, number]>>([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axiosInstance.get(`/location/`);
        console.log('Coordinates:', response.data);
        const schedules = response.data?.schedules || [];
        const allCoordinates = schedules.flatMap((schedule: any) => schedule.stops_coordinates);

        setCoordinates(allCoordinates);
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };
    fetchCoordinates();
  }, []);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={4}>
        <Typography variant="h4" flexGrow={1}>
          Location Tracking
        </Typography>
      </Box>

      <MapContainer
        center={position}
        zoom={13}
        ref={mapRef as React.RefObject<L.Map>}
        style={{ height: '75vh', width: '75vw' }}
        id="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position} ref={markerRef} />
        <Routing markerRef={markerRef} />
      </MapContainer>
    </DashboardContent>
  );
}
