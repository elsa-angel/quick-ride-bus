import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EWallet } from 'src/sections/ewallet/view';
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Ewallet - ${CONFIG.appName}`}</title>
      </Helmet>

      <EWallet />
    </>
  );
}
