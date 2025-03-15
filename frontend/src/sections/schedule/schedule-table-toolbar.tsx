import Toolbar from '@mui/material/Toolbar';

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
    ></Toolbar>
  );
}
