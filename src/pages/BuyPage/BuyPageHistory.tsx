import React, { useEffect } from 'react';
import { Box } from '@mui/system';
import DexCard from '../../components/DexCard/DexCard';
import DexCardHeader from '../../components/DexCard/DexCardHeader';
import Loading from '../../components/Loading/Loading';
import useBuyPage from '../../hooks/useBuyPage';
import DexCardBody from '../../components/DexCard/DexCardBody';
import NotFound from '../../components/NotFound/NotFound';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import useTrades from '../../hooks/useTrades';
import { Trade as TradeType } from '../../types/Trade';
import Trade from '../../components/Trade/Trade';

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
          <Loading />
        ) : (
          <>
            {sortedTrades && sortedTrades.length > 0 ? (
              <>
                {sortedTrades.map((trade: TradeType) => (
                  <Trade key={trade._id} trade={trade} />
                ))}
                <Box height="10px" />
              </>
            ) : (
              <NotFound text="No trades found" />
            )}
          </>
        )}
      </DexCardBody>
    </DexCard>
  );
};

export default BuyPageHistory;
