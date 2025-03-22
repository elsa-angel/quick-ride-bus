import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LoadingButton } from '@mui/lab';

import { DashboardContent } from 'src/layouts/dashboard';
import axiosInstance from 'src/api/axios-instance';
import './seat-availability.css';

interface SeatAvailabilityViewProps {
  bookingId: number;
  fare: number;
  totalSeats: number;
  updateCurrentStep: (step: number) => void;
}

// export function SeatAvailabilityView() {
//   const totalSeats = 40;
//   const bookingId = 1;
//   const fare = 10;

export function SeatAvailabilityView({
  bookingId,
  fare,
  totalSeats,
  updateCurrentStep,
}: SeatAvailabilityViewProps) {
  interface ISeat {
    id: string;
    occupied: boolean;
    selected: boolean;
  }

  const rows = Math.ceil(totalSeats / 4);

  const [seats, setSeats] = useState<ISeat[]>([]);
  const [reservedSeats, setReservedSeats] = useState<string[]>([]);
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);

  useEffect(() => {
    const fetchReservedSeats = async () => {
      try {
        const response = await axiosInstance.get(`/reserved_seats/${bookingId}/`);
        setOccupiedSeats(response?.data?.reserved_seats);

        const booking = await axiosInstance.get(`/bookings/${bookingId}/`);
        setReservedSeats(booking?.data?.reserved_seats);
      } catch (error) {
        console.error('Error fetching reserved seats:', error);
      }
    };

    fetchReservedSeats();
  }, [bookingId]);

  const seatLayout = useCallback((): ISeat[] => {
    const layout: ISeat[] = [];
    const isSeatOccupied = (seat: string): boolean => occupiedSeats?.includes(seat);
    Array.from({ length: rows }, (_, rowIndex) =>
      ['A', 'B', 'C', 'D'].forEach((column) => {
        const seatId = `${rowIndex + 1}${column}`;
        layout.push({
          id: seatId,
          occupied: isSeatOccupied(seatId),
          selected: reservedSeats.includes(seatId) ?? false,
        });
      })
    );

    return layout;
  }, [reservedSeats, rows, occupiedSeats]); // Add reservedSeats as a dependency because seatLayout uses it

  const handleSeatChange = (id: string) => {
    setSeats(
      seats.map((seat) =>
        seat.id === id && !seat.occupied ? { ...seat, selected: !seat.selected } : seat
      )
    );
  };

  const numOfSeatsSelected = seats.filter((seat) => seat.selected).length;

  const onClickPayNow = async () => {
    const selectedSeats = seats
      .filter((seat: ISeat) => seat.selected)
      .map((seat: ISeat) => seat.id)
      .join(',');

    try {
      await axiosInstance.patch(`/bookingsupdate/${bookingId}/`, {
        reserved_seats: selectedSeats,
        // amount: numOfSeatsSelected * fare,
      });
      console.log('Selected Seats: ', selectedSeats);
      updateCurrentStep(2);
      console.log('Booking Updated Successfully');
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  useEffect(() => {
    const layout = seatLayout();
    setSeats(layout);
  }, [reservedSeats, seatLayout]);
  return (
    <DashboardContent>
      <Box display="flex" flexDirection="column" alignItems="flex-start" mb={5}>
        <Typography variant="h4" mb={3}>
          Seat Availability
        </Typography>
        <div className="bus">
          <Box display="flex" justifyContent="center" width="100%" mb={2}>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              variant="contained"
              onClick={onClickPayNow}
              sx={{ width: 200, height: '50px' }}
              disabled={numOfSeatsSelected === 0}
            >
              Book Now
            </LoadingButton>
          </Box>
          {numOfSeatsSelected > 0 && (
            <span className="flex justify-center mb-2">
              Total Amount : {fare * numOfSeatsSelected}
            </span>
          )}
          <div className="front">
            <h1>Please Select seats</h1>
          </div>
          <div className="exit exit--front fuselage">.</div>
          <ol className="cabin fuselage">
            {Array.from({ length: totalSeats / 4 }, (_, rowIndex) => (
              <li key={rowIndex} className={`row row--${rowIndex + 1}`}>
                <ol className="seats" type="A">
                  {['A', 'B', 'C', 'D'].map((letter) => {
                    const seatId = `${rowIndex + 1}${letter}`;
                    const seat = seats.find((s: any) => s.id === seatId);
                    return (
                      <li key={seatId} className="seat">
                        <input
                          type="checkbox"
                          id={seatId}
                          checked={seat?.selected || false}
                          onChange={() => handleSeatChange(seatId)}
                          disabled={seat?.occupied}
                        />
                        <label htmlFor={seatId}>{seat?.occupied ? 'Occupied' : seatId}</label>
                      </li>
                    );
                  })}
                </ol>
              </li>
            ))}
          </ol>
          <div className="exit exit--back fuselage">.</div>
        </div>
      </Box>
    </DashboardContent>
  );
}
