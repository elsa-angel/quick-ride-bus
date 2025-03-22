import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import ReservationSuccessView from 'src/sections/reservation/view/reservation_success';
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Reservation - ${CONFIG.appName}`}</title>
      </Helmet>

      <ReservationSuccessView />
    </>
  );
}
