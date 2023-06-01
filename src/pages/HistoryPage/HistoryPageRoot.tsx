import React, { useCallback, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  PageCardHeader,
  PageCardBody,
  PageCard,
  NotFound,
  Loading,
  OrderHistoryRow,
  OrderPlacingModalV2,
} from '../../components';
import { OrderPlacingStatusType, OrderType } from '../../types';
import {
  useAppSelector,
  selectChainsStore,
  selectOrdersHistoryStore,
  selectUserStore,
} from '../../store';
import { useOrdersHistoryController } from '../../providers';
import Page404 from '../Page404/Page404';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';

type Props = {};

const HistoryPageRoot = (props: Props) => {
  const {
    items: orders,
    loading,
    total,
    refreshing,
  } = useAppSelector(selectOrdersHistoryStore);
  const {
    id: user,
    accessToken,
    address: userWalletAddress,
  } = useAppSelector(selectUserStore);
  const { items: chains } = useAppSelector(selectChainsStore);
  const {
    handleFetchMoreOrdersAction,
    handleOrdersRefreshAction,
    handleEmailSubmitAction,
  } = useOrdersHistoryController();
  const hasMore = orders.length < total;
  const [selectedOrder, setSelectedOrder] = useState<false | OrderType>(false);

  const onEmailSubmit = useCallback(
    async (email: string): Promise<boolean> => {
      if (!selectedOrder) {
        return false;
      }
      const res = await handleEmailSubmitAction(
        email,
        selectedOrder.orderId,
        userWalletAddress
      );
      return res;
    },
    [handleEmailSubmitAction, selectedOrder, userWalletAddress]
  );

  return accessToken ? (
    <>
      <PageCard containerStyle={{ maxWidth: '1024px' }}>
        <PageCardHeader
          sx={{
            padding: '40px 40px 10px !important',
          }}
          title="Orders history"
          endAdornment={
            user && orders.length > 0 ? (
              <Tooltip title={refreshing ? 'Loading...' : 'Refresh'}>
                <div>
                  {refreshing ? (
                    <Loading
                      style={{
                        width: 'auto',
                        margin: 0,
                        padding: '8px 0 8px 8px',
                      }}
                      progressStyle={{
                        width: '20px !important',
                        height: '20px !important',
                      }}
                    />
                  ) : (
                    <IconButton
                      size="medium"
                      edge="end"
                      onClick={() => {
                        handleOrdersRefreshAction();
                      }}
                    >
                      <RefreshIcon sx={{ color: 'black' }} />
                    </IconButton>
                  )}
                </div>
              </Tooltip>
            ) : null
          }
        />
        <PageCardBody
          sx={{ paddingTop: '90px', paddingLeft: '40px', paddingRight: '40px' }}
        >
          {!loading && orders.length < 1 && <NotFound text="No orders found" />}
          {loading ? (
            <Box sx={{ paddingBottom: '24px' }}>
              <Loading />
            </Box>
          ) : (
            <>
              {orders.length > 0 && (
                <Box
                  sx={{
                    width: '100%',
                    overflow: 'hidden',
                    '& .infinite-scroll-component': {
                      overflow: 'initial !important',
                    },
                  }}
                >
                  <TableContainer
                    sx={{ maxHeight: 410 }}
                    id="history-orders-list"
                  >
                    <InfiniteScroll
                      dataLength={orders.length}
                      next={handleFetchMoreOrdersAction}
                      hasMore={hasMore}
                      loader={<Loading />}
                      scrollableTarget="history-orders-list"
                    >
                      <Table
                        sx={{ minWidth: 650 }}
                        aria-label="orders history"
                        stickyHeader
                      >
                        <TableHead>
                          <TableRow
                            sx={{
                              '& th': {
                                color: '#808898',
                                fontWeight: '700',
                              },
                            }}
                          >
                            <TableCell size="small">ID</TableCell>
                            <TableCell size="small">Order Date</TableCell>
                            <TableCell size="small">Pay</TableCell>
                            <TableCell size="small">Receive</TableCell>
                            <TableCell
                              sx={{ textAlign: 'right', paddingRight: '20px' }}
                              size="small"
                            >
                              Status
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orders.map((order: OrderType) => (
                            <OrderHistoryRow
                              key={order._id}
                              chains={chains}
                              order={order}
                              onClick={() => {
                                setSelectedOrder(order);
                              }}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    </InfiniteScroll>
                  </TableContainer>
                  <Box sx={{ height: '16px' }} />
                </Box>
              )}
            </>
          )}
        </PageCardBody>
      </PageCard>
      <OrderPlacingModalV2
        open={Boolean(selectedOrder)}
        chains={chains}
        orderStatus={OrderPlacingStatusType.COMPLETED}
        createdOrder={selectedOrder || undefined}
        errorMessage={{ type: '', text: '' }}
        onClose={() => {
          setSelectedOrder(false);
        }}
        userAmount={
          selectedOrder ? selectedOrder.amountTokenDeposit : undefined
        }
        onEmailSubmit={onEmailSubmit}
      />
    </>
  ) : (
    <Page404 />
  );
};

export default HistoryPageRoot;
