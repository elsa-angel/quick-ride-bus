import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

import { TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SearchForm from './SearchForm';
// ----------------------------------------------------------------------

type ScheduleTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ScheduleTableToolbar({
  numSelected,
  filterName,
  onFilterName,
}: ScheduleTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {/* <OutlinedInput
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Search user..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
        sx={{ maxWidth: 320 }}
      /> */}
      {/* <TextField
        fullWidth
        name="from"
        label="From"
        placeholder="Your Departure City"
        InputLabelProps={{ shrink: true }}
        // sx={{ mb: 3 }}
        sx={{ maxWidth: 300 }}
      />
      &nbsp;
      <TextField
        fullWidth
        name="to"
        label="To"
        placeholder="Your Destination City"
        InputLabelProps={{ shrink: true }}
        // sx={{ mb: 3 }}
        sx={{ maxWidth: 300 }}
      />
      &nbsp;
      <TextField
        fullWidth
        name="date"
        label="Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        sx={{ maxWidth: 300 }}
        inputProps={{
          min: new Date().toISOString().split('T')[0],
        }}
      />
      &nbsp;
      <TextField
        fullWidth
        name="time"
        label="Time"
        type="time"
        InputLabelProps={{ shrink: true }}
        sx={{ maxWidth: 300 }}
        inputProps={{
          min: new Date().toTimeString().slice(0, 5),
        }}
      />
      &nbsp;
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        sx={{ maxWidth: 300 }}

        // onClick={handleSubmit}
      >
        Search
      </LoadingButton> */}
      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton></IconButton>
        </Tooltip>
      )} */}
      {/* <SearchForm /> */}
    </Toolbar>
  );
}
