import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import EwalletSuccessView from 'src/sections/ewallet/view/ewalletsuccess';
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Ewallet Success - ${CONFIG.appName}`}</title>
      </Helmet>

      <EwalletSuccessView />
    </>
  );
}
