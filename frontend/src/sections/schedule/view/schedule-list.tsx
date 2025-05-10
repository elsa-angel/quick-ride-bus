import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';

import { ScheduleTableRow } from '../schedule-table-row';
import { ScheduleTableHead } from '../schedule-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { TableNoData } from '../table-no-data';

import SearchForm from '../SearchForm';

// ----------------------------------------------------------------------
interface Schedule {
  id: string;
  user_id: string;
  bus_name: string;
  from: string;
  to: string;
  date: string;
  from_time: string;
  to_time: string;
  time_difference: string;
  fare: string;
}

export function ScheduleView() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isScheduleAvailable, setisScheduleAvailable] = useState<boolean>(false);

  const handleSearch = (newSchedules: any[], query: string) => {
    setSchedules(newSchedules);
    setSearchQuery(query);
    setisScheduleAvailable(true);
  };

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Schedules
        </Typography>
      </Box>

      <Card>
        <SearchForm setSchedules={handleSearch} />

        {isScheduleAvailable && schedules?.length > 0 ? (
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <ScheduleTableHead
                  headLabel={[
                    { id: 'bus_name', label: 'Bus Name' },
                    { id: 'from', label: 'Departure' },
                    { id: 'to', label: 'Arrival' },
                    { id: 'date', label: 'Date' },
                    { id: 'from_time', label: 'Departure Time' },
                    { id: 'to_time', label: 'Arrival Time' },
                    { id: 'time_difference', label: 'Total Duration' },
                    { id: 'fare', label: 'Fare' },
                    { id: '', label: 'Book' },
                  ]}
                />
                <TableBody>
                  {schedules.map((row: any) => (
                    <ScheduleTableRow key={row.id} row={row} />
                  ))}

                  <TableEmptyRows emptyRows={schedules?.length} height={68} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        ) : isScheduleAvailable && schedules?.length === 0 ? (
          <Table>
            <TableBody>
              <TableNoData searchQuery="" />
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">Start searching to see available schedules</Typography>
          </Box>
        )}
      </Card>
    </DashboardContent>
  );
}
