import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import axiosInstance from 'src/api/axios-instance';
import { MapContainer, Marker, TileLayer, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L, { LatLngExpression, Marker as LeafletMarker } from 'leaflet';
import 'leaflet-routing-machine';
import { useEffect, useRef, useState } from 'react';

// Component for handling routing and animation
interface RoutingProps {
  markerRef: React.RefObject<LeafletMarker>;
  coordinates: [number, number][];
  timings: string[];
}

const Routing: React.FC<RoutingProps> = ({ markerRef, coordinates, timings: timingList }) => {
  const map = useMapEvent('moveend', () => {
    if (coordinates.length > 1) {
      const waypoints = coordinates.map((coord) => L.latLng(coord));

      const routeControl = (L as any).Routing.control({
        waypoints,
        createMarker: () => null, // Don't create additional markers
        routeWhileDragging: true,
        showAlternatives: false,
      });

      routeControl.addTo(map);

      routeControl.on('routesfound', (event: any) => {
        const route = event.routes[0];
        const routeCoordinates = route.coordinates;
        animateMarkerAlongRoute(routeCoordinates);
      });
      routeControl.on('routingerror', (error: any) => {
        console.error('Routing error:', error);
        alert('There was an error with the route calculation. Please try again later.');
      });
    }
  });

  const animateMarkerAlongRoute = (routeCoordinates: any[]) => {
    if (!markerRef.current) return;

    let currentIndex = 0;

    // Get the current time in IST and log it (already in 24-hour format)
    const currentTime = new Date(); // Get current time in UTC
    const currentTimeIST = currentTime.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
    });
    console.log(`Current Time (IST - 24hr format): ${currentTimeIST}`);

    const moveMarkerToNext = () => {
      if (currentIndex < routeCoordinates.length - 1) {
        const startCoord = routeCoordinates[currentIndex];
        const endCoord = routeCoordinates[currentIndex + 1];

        const startLatLng = L.latLng(startCoord.lat, startCoord.lng);
        const endLatLng = L.latLng(endCoord.lat, endCoord.lng);

        // Get the stop time from the schedule for the current stop
        const stopTime = timingList[currentIndex];
        const stopTimeDate = new Date();
        const [hours, minutes] = stopTime.split(':').map((x) => parseInt(x, 10));
        stopTimeDate.setHours(hours);
        stopTimeDate.setMinutes(minutes);
        stopTimeDate.setSeconds(0);

        // Convert stopTimeDate to IST (this will already be in 24-hour format)
        const stopTimeDateIST = stopTimeDate.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
        });
        console.log(`Stop Time (IST - 24hr format) for stop ${currentIndex}: ${stopTimeDateIST}`);

        // Check if the current time is within a margin before the stop time (e.g., 5 minutes)
        const timeDifference = stopTimeDate.getTime() - currentTime.getTime();
        const marginBeforeStop = 5 * 60 * 1000; // 5 minutes in milliseconds

        if (timeDifference > marginBeforeStop) {
          console.log(
            `It's too early to start the animation for stop ${currentIndex}, current time is too far from stop time.`
          );
          return;
        }

        // If we are close enough to the stop time, proceed with the animation
        console.log(`Starting animation for stop ${currentIndex}`);

        // Calculate the duration for the animation (based on the time difference)
        const duration = Math.max(timeDifference, 0); // Duration in milliseconds
        const stepCount = 50; // Number of steps in the animation
        let stepIndex = 0;

        // Keep track of the current position and update it incrementally
        const interval = setInterval(() => {
          stepIndex += 1;

          // Move the marker by calculating a fractional distance to the next point
          const latLng = L.latLng(
            startLatLng.lat + (endLatLng.lat - startLatLng.lat) * (stepIndex / stepCount),
            startLatLng.lng + (endLatLng.lng - startLatLng.lng) * (stepIndex / stepCount)
          );

          if (markerRef.current) {
            markerRef.current.setLatLng(latLng);
            console.log(`Marker Position: ${latLng.lat}, ${latLng.lng}`);
          }

          if (stepIndex >= stepCount) {
            clearInterval(interval);
            currentIndex += 1;
            console.log(`Moving to next stop (index ${currentIndex})`);
            moveMarkerToNext(); // Move to the next segment
          }
        }, duration / stepCount);
      }
    };

    moveMarkerToNext(); // Start the animation
  };

  return null;
};

export default function LocationTrackingView() {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<LeafletMarker>(null);
  const [position] = useState<LatLngExpression>([9.9692, 76.319]);
  const [coordinates, setCoordinates] = useState<Array<[number, number]>>([]);
  const [timings, setTimings] = useState<string[]>([]);
  const [selectedBus, setSelectedBus] = useState<string>('');
  const [buses, setBuses] = useState<any[]>([]);
  const [busDetailsAvailable, setBusDetailsAvailable] = useState<boolean>(false);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await axiosInstance.get(`/buses/`);
        const fetchedBuses = response.data?.buses || [];
        setBuses(fetchedBuses);
      } catch (error) {
        console.error('Error fetching buses:', error);
      }
    };
    fetchBuses();
  }, []);

  const handleBusChange = async (event: any) => {
    const selectedBusId = event.target.value as string;
    setSelectedBus(selectedBusId);

    try {
      const response = await axiosInstance.get(`/bus_details/${selectedBusId}/`);
      const busSchedule = response.data.schedules[0];

      if (busSchedule) {
        setBusDetailsAvailable(true);
        const busCoordinates = busSchedule.coordinates;
        setCoordinates(busCoordinates);
        setTimings(busSchedule.stops_timings.split(','));
      } else {
        setBusDetailsAvailable(false);
      }
    } catch (error) {
      console.error('Error fetching bus schedule:', error);
      setBusDetailsAvailable(false);
    }
  };

  useEffect(() => {
    if (mapRef.current && coordinates.length > 0 && markerRef.current) {
      const firstCoord = coordinates[0];
      markerRef.current.setLatLng([firstCoord[0], firstCoord[1]]);
    }
  }, [coordinates]);

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
          {/* Create static markers for stops */}
          {coordinates.map((coord, index) => (
            <Marker key={index} position={coord} />
          ))}
          <Routing markerRef={markerRef} coordinates={coordinates} timings={timings} />
        </MapContainer>
      )}
    </DashboardContent>
  );
}
