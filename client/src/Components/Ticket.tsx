import React from 'react'
import QRCode from 'react-qr-code'
import '../Components/ticket.css'

interface TicketProps {
  reservation: object
  onClose: () => void
  user: any
}

const Ticket: React.FC<TicketProps> = ({ user, reservation, onClose }) => {
  return (
    <div>
      <div className='flex-container'>
        <button className='item-1' onClick={onClose}>
          <span className='inner'>
            <span className='label'>Close</span>
          </span>
        </button>
      </div>
      <div className='ticket'>
        <div className='ticket-top'>
          <div className='ticket-header'>
            <div className='head-logo'>Yathra-Mithra</div>
            <div className='head-flight'>
              {(reservation as any)?.schedule?.bus?.bus_name}
            </div>
          </div>
          <div className='ticket-body'>
            <div className='locations'>
              <div className='loc-depart'>
                {(reservation as any)?.departure_stop}
                <h1>{(reservation as any)?.departure_stop}</h1>
                {(reservation as any)?.departure_time}
              </div>
              <div className='loc-direction'>
                <div className='arrow'></div>
              </div>
              <div className='loc-arrive'>
                {(reservation as any)?.arrival_stop}
                <h1>{(reservation as any)?.arrival_stop}</h1>
                {(reservation as any)?.arrival_time}
              </div>
            </div>

            <div className='body-info'>
              <div className='info'>
                <div className='info-name'>
                  Passenger
                  <h2>{user.name}</h2>
                </div>
                <div className='info-seat'>
                  Seat(s)
                  <h2>{(reservation as any)?.reserved_seats}</h2>
                </div>
              </div>
              <div className='flight'>
                {/* <div className='flight-info'>
                  Bus
                  <h2>{(reservation as any)?.schedule?.bus?.bus_name}</h2>
                </div> */}
                <div className='flight-depart-date'>
                  Depart
                  <h2>{(reservation as any)?.booking_date}</h2>
                </div>
                <div className='flight-depart-time'>
                  Amount
                  <h2>{(reservation as any)?.amount}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='ticket-bottom'>
          <div className='bottom-info'>
            {/* <div className='depart'> */}
            {/* <div className='depart-terminal'>
                Terminal
                <h2>1</h2>
              </div> */}
            {/* <div className='depart-gate'>
                Gate
                <h2>51</h2>
              </div> */}
            {/* <div className='depart-boarding'>
                Boarding
                <h2>09:00 am</h2>
              </div> */}
            {/* </div> */}

            <p className='text-center'>Scan QR Code</p>
            <div
              className='pt-10'
              style={{
                height: 'auto',
                margin: '0 auto',
                maxWidth: 128,
                width: '100%'
              }}
            >
              <QRCode
                size={256}
                style={{
                  height: 'auto',
                  maxWidth: '100%',
                  width: '100%'
                }}
                value={(reservation as any)?.payment_id}
                viewBox={`0 0 256 256`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Ticket
