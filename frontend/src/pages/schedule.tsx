import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ScheduleView } from 'src/sections/schedule/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Schedules - ${CONFIG.appName}`}</title>
      </Helmet>

      <ScheduleView />
    </>
  );
}
