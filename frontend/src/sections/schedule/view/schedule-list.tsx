import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { ScheduleTableRow } from '../schedule-table-row';
import { ScheduleTableHead } from '../schedule-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { ScheduleTableToolbar } from '../schedule-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { ScheduleProps } from '../schedule-table-row';
import SearchForm from '../SearchForm';

// ----------------------------------------------------------------------

export function ScheduleView() {
  const [schedules, setSchedules] = useState([]);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Schedules
        </Typography>
      </Box>

      <Card>
        {/* <ScheduleTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        /> */}

        <SearchForm setSchedules={setSchedules} />

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
                  { id: '' },
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
      </Card>
    </DashboardContent>
  );
}
