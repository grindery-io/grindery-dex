import { cardHeaderClasses } from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';
import { CardHeader } from '../Card/CardHeader';

export const ChainTokenBox = styled(CardHeader, {
  shouldForwardProp: (prop) =>
    !['selected', 'compact'].includes(prop as string),
})<{ selected?: boolean; compact?: boolean }>(
  ({ theme, selected, compact }) => ({
    height: 64,
    overflow: 'hidden',
    [`.${cardHeaderClasses.content}`]: {
      overflow: 'hidden',
    },
    [`.${cardHeaderClasses.title}`]: {
      color: selected
        ? theme.palette.text.primary
        : theme.palette.text.secondary,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      width: compact ? (selected ? 92 : 142) : 256,
      fontWeight: selected ? 500 : 400,
      fontSize: compact && !selected ? '1rem' : '1.125rem',
      '& > div': {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
    },
    [`.${cardHeaderClasses.subheader}`]: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      width: compact ? 92 : 256,
    },
  })
);
