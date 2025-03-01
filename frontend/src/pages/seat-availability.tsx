import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SeatAvailabilityView } from 'src/sections/reservation/view/seat-availability';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`SeatAvailable - ${CONFIG.appName}`}</title>
      </Helmet>

      <SeatAvailabilityView />
    </>
  );
}
