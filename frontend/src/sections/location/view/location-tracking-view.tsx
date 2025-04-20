import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';

import axiosInstance from 'src/api/axios-instance';

import { MapContainer, Marker, TileLayer, useMapEvent, MapContainerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import L, { LatLngExpression, Marker as LeafletMarker } from 'leaflet';
import 'leaflet-routing-machine';
import { useEffect, useRef, useState } from 'react';

// Component for handling routing and animation on map click
interface RoutingProps {
  markerRef: React.RefObject<LeafletMarker>;
  coordinates: [number, number][];
}

const Routing: React.FC<RoutingProps> = ({ markerRef, coordinates }) => {
  const map = useMapEvent('click', (e) => {
    // const destination = e.latlng;
    const destination = L.latLng(coordinates[coordinates.length - 1]);

    (L as any).Routing.control({
      waypoints: [L.latLng(markerRef.current?.getLatLng()!), destination],
      createMarker: () => null, // Do not place default markers
      showAlternatives: false,
    })
      .on('routesfound', (event: any) => {
        const route = event.routes[0];
        const routeCoordinates = route.coordinates;

        routeCoordinates.forEach((coord: any, index: number) => {
          setTimeout(() => {
            if (markerRef.current) {
              markerRef.current.setLatLng([coord.lat, coord.lng]);
            }
          }, 500 * index);
        });
      })
      .addTo(map);
  });

  return null;
};

export default function LocationTrackingView() {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<LeafletMarker>(null);
  const [position] = useState<LatLngExpression>([9.9692, 76.319]);
  const [coordinates, setCoordinates] = useState<Array<[number, number]>>([]);
  const [selectedBus, setSelectedBus] = useState<string>('');
  const [buses, setBuses] = useState<any[]>([]);
  const [busDetailsAvailable, setBusDetailsAvailable] = useState<boolean>(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axiosInstance.get(`/buses/`);
        const fetchedBuses = response.data?.buses || [];
        setBuses(fetchedBuses);
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };
    fetchCoordinates();
  }, []);

  const handleBusChange = async (event: any) => {
    const selectedBusId = event.target.value as string;
    setSelectedBus(selectedBusId);
    try {
      const response = await axiosInstance.get(`/bus_details/${selectedBusId}/`);
      console.log('Bus schedule:', response.data);

      if (response.data.schedules.length > 0) {
        setBusDetailsAvailable(true);
      } else {
        setBusDetailsAvailable(false);
      }
    } catch (error) {
      console.error('Error fetching bus schedule:', error);
      setBusDetailsAvailable(false);
    }
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={4}>
        <Typography variant="h4" flexGrow={1}>
          Location Tracking
        </Typography>
      </Box>

      {/* Dropdown for selecting bus */}
      <FormControl fullWidth sx={{ mb: 2, maxWidth: 300 }}>
        <InputLabel id="bus-select-label">Select Bus</InputLabel>
        <Select
          labelId="bus-select-label"
          id="bus-select"
          value={selectedBus}
          label="Select Bus"
          onChange={handleBusChange}
        >
          {buses.map((bus) => (
            <MenuItem key={bus.id} value={bus.id}>
              {bus.bus_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedBus && busDetailsAvailable && (
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
          <Routing markerRef={markerRef} coordinates={coordinates} />
        </MapContainer>
      )}
    </DashboardContent>
  );
}
