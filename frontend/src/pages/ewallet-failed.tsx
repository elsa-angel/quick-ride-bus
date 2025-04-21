import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import EwalletFailedView from 'src/sections/ewallet/view/ewalletfailed';
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Ewallet Success - ${CONFIG.appName}`}</title>
      </Helmet>

      <EwalletFailedView />
    </>
  );
}
