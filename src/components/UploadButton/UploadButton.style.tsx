import { FormControl as MuiFormControl } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FormControl = styled(MuiFormControl)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 1.5, 0),
}));
