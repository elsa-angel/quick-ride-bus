import React, { useState, useEffect } from 'react'
import PrimaryButton from '@/Components/PrimaryButton'
import '../Components/seat_availability.css'
import axios from 'axios'

interface Props {
  updateCurrentStep: (step: number) => void
  bookingId: number
  fare: number
  totalSeats: number
}

const SeatAvailability: React.FC<Props> = ({
  updateCurrentStep,
  bookingId,
  fare,
  totalSeats
}) => {
  // Algorithm
  // 1. Get total no. of seats in the bus
  // 2. Build seatlayout

  interface ISeat {
    id: string
    occupied: boolean
    selected: boolean
  }

  // Calculate number of rows and columns
  const rows = Math.ceil(totalSeats / 4) // Assuming 4 seats per row
  const columns = ['A', 'B', 'C', 'D']

  const [seats, setSeats] = useState<ISeat[]>([])
  const [reservedSeats, setReservedSeats] = useState<string[]>([])
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([])

  useEffect(() => {
    const fetchReservedSeats = async () => {
      try {
        const response = await axios.get(`/reserved_seats/${bookingId}`)
        setOccupiedSeats(response?.data?.reserved_seats)

        const booking = await axios.get(`/bookings/${bookingId}`)
        setReservedSeats(booking?.data?.reserved_seats)
      } catch (error) {
        console.error('Error fetching reserved seats:', error)
      }
    }

    fetchReservedSeats()
  }, [bookingId])

  useEffect(() => {
    const layout = seatLayout()
    setSeats(layout)
  }, [reservedSeats])

  const seatLayout = (): ISeat[] => {
    const layout: ISeat[] = []
    for (let rowIndex = 1; rowIndex <= rows; rowIndex++) {
      for (const column of columns) {
        const seatId = `${rowIndex}${column}`
        layout.push({
          id: seatId,
          occupied: isSeatOccupied(seatId),
          selected: reservedSeats.includes(seatId) ?? false
        })
      }
    }
    return layout
  }

  const isSeatOccupied = (seat: string): boolean => {
    return occupiedSeats?.includes(seat)
  }

  const handleSeatChange = (id: string) => {
    setSeats(
      seats.map((seat) =>
        seat.id === id && !seat.occupied
          ? { ...seat, selected: !seat.selected }
          : seat
      )
    )
  }

  const numOfSeatsSelected = seats.filter((seat) => seat.selected).length

  const onClickPayNow = async () => {
    const selectedSeats = seats
      .filter((seat: ISeat) => seat.selected)
      .map((seat: ISeat) => seat.id)
      .join(',')

    try {
      await axios.patch(`/bookings/${bookingId}`, {
        reserved_seats: selectedSeats
        // amount: numOfSeatsSelected * fare
      })
      updateCurrentStep(2)
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  return (
    <div className='p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg '>
      <div className='bus'>
        <div className='flex justify-center mb-2'>
          <PrimaryButton
            className='ms-4 bg-blue-700 hover:bg-blue-900'
            onClick={onClickPayNow}
            disabled={numOfSeatsSelected == 0}
          >
            Book Now
          </PrimaryButton>
        </div>
        {numOfSeatsSelected > 0 && (
          <span className='flex justify-center mb-2'>
            Total Amount : {fare * numOfSeatsSelected}
          </span>
        )}
        <div className='front'>
          <h1>Please Select seats</h1>
        </div>
        <div className='exit exit--front fuselage'></div>
        <ol className='cabin fuselage'>
          {Array.from({ length: totalSeats / 4 }, (_, rowIndex) => (
            <li key={rowIndex} className={`row row--${rowIndex + 1}`}>
              <ol className='seats' type='A'>
                {['A', 'B', 'C', 'D'].map((letter) => {
                  const seatId = `${rowIndex + 1}${letter}`
                  const seat = seats.find((s: any) => s.id === seatId)
                  return (
                    <li key={seatId} className='seat'>
                      <input
                        type='checkbox'
                        id={seatId}
                        checked={seat?.selected || false}
                        onChange={() => handleSeatChange(seatId)}
                        disabled={seat?.occupied}
                      />
                      <label htmlFor={seatId}>
                        {seat?.occupied ? 'Occupied' : seatId}
                      </label>
                    </li>
                  )
                })}
              </ol>
            </li>
          ))}
        </ol>
        <div className='exit exit--back fuselage'></div>
      </div>
    </div>
  )
}

export default SeatAvailability
