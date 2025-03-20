import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import ReservationView from 'src/sections/reservation/view/reservation';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Reservation - ${CONFIG.appName}`}</title>
      </Helmet>

      <ReservationView />
    </>
  );
}
