import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export type ScheduleProps = {
  id: string;
  bus_name: string;
  from: string;
  to: string;
  date: string;
  from_time: string;
  to_time: string;
  time_difference: string;
  fare: string;
};

type ScheduleTableRowProps = {
  row: ScheduleProps;
};

export function ScheduleTableRow({ row }: ScheduleTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);
  const handleBookNow = async (schedule: any) => {
    window.location.href = `/seats`;
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell component="th" scope="row">
          {row.bus_name}
        </TableCell>
        <TableCell>{row.from}</TableCell>
        <TableCell>{row.to}</TableCell>
        <TableCell>{row.date}</TableCell>
        <TableCell>{row.from_time}</TableCell>
        <TableCell>{row.to_time}</TableCell>
        <TableCell>{row.time_difference}</TableCell>
        <TableCell>{row.fare}</TableCell>
        <TableCell>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            color="primary"
            variant="contained"
            onClick={handleBookNow}
            sx={{ width: 265, height: '56px' }}
          >
            Book Now
          </LoadingButton>
        </TableCell>

        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell> */}

        {/* <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.name} src={row.avatarUrl} />
            {row.name}
          </Box>
        </TableCell>

        <TableCell>{row.company}</TableCell>

        <TableCell>{row.role}</TableCell>

        <TableCell align="center">
          {row.isVerified ? (
            <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
          ) : (
            '-'
          )}
        </TableCell>

        <TableCell>
          <Label color={(row.status === 'banned' && 'error') || 'success'}>{row.status}</Label>
        </TableCell> */}

        {/* <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      {/* <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleClosePopover}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover> */}
    </>
  );
}
