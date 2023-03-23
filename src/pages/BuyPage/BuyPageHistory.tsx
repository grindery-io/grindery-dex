import React, { useEffect } from 'react';
import { Box } from '@mui/system';
import DexCard from '../../components/grindery/DexCard/DexCard';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import useBuyPage from '../../hooks/useBuyPage';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexTokensNotFound from '../../components/grindery/DexTokensNotFound/DexTokensNotFound';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import useTrades from '../../hooks/useTrades';
import { Trade } from '../../types/Trade';
import DexTrade from '../../components/grindery/DexTrade/DexTrade';

type Props = {};

const BuyPageHistory = (props: Props) => {
  const { VIEWS } = useBuyPage();
  const { trades, getTrades, isLoading } = useTrades();

  const sortedTrades = trades?.sort((a: any, b: any) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  let navigate = useNavigate();

  useEffect(() => {
    getTrades();
  }, []);

  return (
    <DexCard>
      <DexCardHeader
        title="Trades history"
        titleSize={18}
        titleAlign="center"
        startAdornment={
          <IconButton
            size="medium"
            edge="start"
            onClick={() => {
              navigate(VIEWS.ROOT.fullPath);
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        }
        endAdornment={<Box width={28} height={40} />}
      />
      <DexCardBody maxHeight="540px">
        {isLoading ? (
          <DexLoading />
        ) : (
          <>
            {sortedTrades && sortedTrades.length > 0 ? (
              <>
                {sortedTrades.map((trade: Trade) => (
                  <DexTrade key={trade._id} trade={trade} />
                ))}
                <Box height="10px" />
              </>
            ) : (
              <DexTokensNotFound text="No trades found" />
            )}
          </>
        )}
      </DexCardBody>
    </DexCard>
  );
};

export default BuyPageHistory;
