import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ContactUsView } from 'src/sections/contact/contact-us';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Contact - ${CONFIG.appName}`}</title>
      </Helmet>

      <ContactUsView />
    </>
  );
}
