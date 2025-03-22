import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import ReservationFailedView from 'src/sections/reservation/view/reservation_failed';
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Reservation - ${CONFIG.appName}`}</title>
      </Helmet>

      <ReservationFailedView />
    </>
  );
}
