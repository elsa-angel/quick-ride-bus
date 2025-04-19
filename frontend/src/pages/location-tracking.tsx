import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import LocationTrackingView from 'src/sections/location/view';
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Location Tracking - ${CONFIG.appName}`}</title>
      </Helmet>

      <LocationTrackingView />
    </>
  );
}
