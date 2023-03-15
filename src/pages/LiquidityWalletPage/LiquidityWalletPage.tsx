import { useEffect, useState } from 'react';
import { IconButton, Tooltip, Button as MuiButton } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Box } from '@mui/system';
import {
  ArrowBack as ArrowBackIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from '@mui/icons-material';
import DexCard from '../../components/grindery/DexCard/DexCard';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import DexTextInput from '../../components/grindery/DexTextInput/DexTextInput';
import DexSelectChainButton from '../../components/grindery/DexSelectChainButton/DexSelectChainButton';
import DexChainsList from '../../components/grindery/DexChainsList/DexChainsList';
import { Chain } from '../../types/Chain';
import { LiquidityWallet } from '../../types/LiquidityWallet';
import DexLiquidityWallet from '../../components/grindery/DexLiquidityWallet/DexLiquidityWallet';
import { Route, Routes, useNavigate } from 'react-router-dom';
import useGrinderyChains from '../../hooks/useGrinderyChains';

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

const VIEWS = {
  ROOT: { path: '/', fullPath: '/sell/wallets' },
  CREATE: { path: '/create', fullPath: '/sell/wallets/create' },
  SELECT_CHAIN: {
    path: '/select-chain',
    fullPath: '/sell/wallets/select-chain',
  },
  ADD: { path: '/add', fullPath: '/sell/wallets/add' },
  WITHDRAW: { path: 'withdraw', fullPath: '/sell/wallets/withdraw' },
};

function LiquidityWalletPage() {
  const { user, connect, chain: selectedChain } = useGrinderyNexus();
  let navigate = useNavigate();
  const [amountAdd, setAmountAdd] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });
  const [chain, setChain] = useState(selectedChain || '');

  const { chains, isLoading: chainsIsLoading } = useGrinderyChains();
  const [selectedWallet, setSelectedWallet] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentChain: Chain | null =
    chain && chains.find((c) => c.value === chain)
      ? {
          id:
            chain && typeof chain === 'string'
              ? `0x${parseFloat(chain.split(':')[1]).toString(16)}`
              : '',
          value: chains.find((c) => c.value === chain)?.value || '',
          label: chains.find((c) => c.value === chain)?.label || '',
          icon: chains.find((c) => c.value === chain)?.icon || '',
          rpc: chains.find((c) => c.value === chain)?.rpc || [],
          nativeToken: chains.find((c) => c.value === chain)?.token || '',
        }
      : null;

  const [wallets, setWallets] = useState<LiquidityWallet[]>([
    {
      id: '1',
      chain: 'eip155:5',
      balance: '2000',
    },
  ]);

  const handleClick = async () => {
    setErrorMessage({
      type: '',
      text: '',
    });

    if (!chain) {
      setErrorMessage({
        type: 'chain',
        text: 'Blockchain is required',
      });
      return;
    }
    if (
      chain &&
      wallets.map((wallet: LiquidityWallet) => wallet.chain).includes(chain)
    ) {
      setErrorMessage({
        type: 'chain',
        text: `You already have wallet for ${currentChain?.label} chain. Please, select another.`,
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setWallets([
        {
          id:
            wallets.length > 0
              ? (parseFloat(wallets[wallets.length - 1].id) + 1).toString()
              : '1',
          chain: chain,
          balance: '0',
          new: true,
        },
        ...[...wallets],
      ]);
      setLoading(false);
      navigate(VIEWS.ROOT.fullPath);
    }, 1500);
  };

  const handleWithdrawClick = async () => {
    setErrorMessage({
      type: '',
      text: '',
    });

    if (!amountAdd) {
      setErrorMessage({
        type: 'amountAdd',
        text: 'Amount is required',
      });
      return;
    }
    if (!isNumeric(amountAdd)) {
      setErrorMessage({
        type: 'amountAdd',
        text: 'Must be a number',
      });
      return;
    }
    if (
      parseFloat(amountAdd) >
      parseFloat(
        wallets.find((wallet: LiquidityWallet) => selectedWallet === wallet.id)
          ?.balance || '0'
      )
    ) {
      setErrorMessage({
        type: 'amountAdd',
        text: `You can withdraw maximum ${
          wallets.find(
            (wallet: LiquidityWallet) => selectedWallet === wallet.id
          )?.balance
        } tokens`,
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setWallets((_wallets) => [
        ..._wallets.map((wallet: LiquidityWallet) => {
          if (wallet.id === selectedWallet) {
            return {
              ...wallet,
              balance: (
                parseFloat(wallet.balance) - parseFloat(amountAdd)
              ).toString(),
              updated: true,
            };
          } else {
            return wallet;
          }
        }),
      ]);
      setAmountAdd('');
      setSelectedWallet('');
      setLoading(false);
      navigate(VIEWS.ROOT.fullPath);
    }, 1500);
  };

  const handleAddClick = async () => {
    setErrorMessage({
      type: '',
      text: '',
    });

    if (!amountAdd) {
      setErrorMessage({
        type: 'amountAdd',
        text: 'Amount is required',
      });
      return;
    }
    if (!isNumeric(amountAdd)) {
      setErrorMessage({
        type: 'amountAdd',
        text: 'Must be a number',
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setWallets((_wallets) => [
        ..._wallets.map((wallet: LiquidityWallet) => {
          if (wallet.id === selectedWallet) {
            return {
              ...wallet,
              balance: (
                parseFloat(wallet.balance) + parseFloat(amountAdd)
              ).toString(),
              updated: true,
            };
          } else {
            return wallet;
          }
        }),
      ]);
      setAmountAdd('');
      setSelectedWallet('');
      setLoading(false);
      navigate(VIEWS.ROOT.fullPath);
    }, 1500);
  };

  useEffect(() => {
    setChain(selectedChain || '');
  }, [selectedChain]);

  useEffect(() => {
    if (currentChain && currentChain.id) {
      window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: currentChain.id,
            chainName: currentChain.label,
            rpcUrls: currentChain.rpc,
            nativeCurrency: {
              name: currentChain.nativeToken,
              symbol: currentChain.nativeToken,
              decimals: 18,
            },
          },
        ],
      });
    }
  }, [currentChain]);

  return (
    <>
      <DexCard>
        <Routes>
          <Route
            path={VIEWS.ROOT.path}
            element={
              <>
                <DexCardHeader
                  title="Liquidity wallets"
                  endAdornment={
                    user &&
                    wallets.length > 0 &&
                    wallets.length < chains.length ? (
                      <Tooltip title="Create wallet">
                        <IconButton
                          size="medium"
                          edge="end"
                          onClick={() => {
                            navigate(VIEWS.CREATE.fullPath);
                          }}
                        >
                          <AddCircleOutlineIcon sx={{ color: 'black' }} />
                        </IconButton>
                      </Tooltip>
                    ) : null
                  }
                />
                <DexCardBody>
                  <>
                    {user &&
                      wallets.map((wallet: LiquidityWallet) => {
                        const walletChain = {
                          icon: chains.find((c) => c.value === wallet.chain)
                            ?.icon,
                          label: chains.find((c) => c.value === wallet.chain)
                            ?.label,
                          nativeToken: chains.find(
                            (c) => c.value === wallet.chain
                          )?.nativeToken,
                        };
                        return (
                          <DexLiquidityWallet
                            key={wallet.id}
                            wallet={wallet}
                            walletChain={walletChain}
                            onWithdrawClick={(w: LiquidityWallet) => {
                              setSelectedWallet(w.id);
                              navigate(VIEWS.WITHDRAW.fullPath);
                            }}
                            onAddClick={(w: LiquidityWallet) => {
                              setSelectedWallet(w.id);
                              navigate(VIEWS.ADD.fullPath);
                            }}
                          />
                        );
                      })}
                    {wallets.length < chains.length ? (
                      <DexCardSubmitButton
                        label={user ? 'Create wallet' : 'Connect wallet'}
                        onClick={
                          user
                            ? () => {
                                navigate(VIEWS.CREATE.fullPath);
                              }
                            : () => {
                                connect();
                              }
                        }
                      />
                    ) : (
                      <Box pb="20px"></Box>
                    )}
                  </>
                </DexCardBody>
              </>
            }
          />
          <Route
            path={VIEWS.CREATE.path}
            element={
              <>
                <DexCardHeader
                  title="Create wallet"
                  titleSize={18}
                  titleAlign="center"
                  startAdornment={
                    <IconButton
                      size="medium"
                      edge="start"
                      onClick={() => {
                        setAmountAdd('');
                        navigate(VIEWS.ROOT.fullPath);
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  }
                  endAdornment={<Box width={28} height={40} />}
                />

                <DexCardBody>
                  <DexSelectChainButton
                    title="Blockchain"
                    chain={currentChain}
                    onClick={() => {
                      setErrorMessage({
                        type: '',
                        text: '',
                      });
                      navigate(VIEWS.SELECT_CHAIN.fullPath);
                    }}
                    error={errorMessage}
                  />

                  {loading && <DexLoading />}
                  <DexCardSubmitButton
                    disabled={loading}
                    label={
                      loading
                        ? 'Waiting transaction'
                        : user
                        ? 'Create wallet'
                        : 'Connect wallet'
                    }
                    onClick={
                      user
                        ? handleClick
                        : () => {
                            connect();
                          }
                    }
                  />
                </DexCardBody>
              </>
            }
          />
          <Route
            path={VIEWS.WITHDRAW.path}
            element={
              <>
                <DexCardHeader
                  title="Withdraw"
                  titleSize={18}
                  titleAlign="center"
                  startAdornment={
                    <IconButton
                      size="medium"
                      edge="start"
                      onClick={() => {
                        setAmountAdd('');
                        setSelectedWallet('');
                        navigate(VIEWS.ROOT.fullPath);
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  }
                  endAdornment={<Box width={28} height={40} />}
                />

                <DexCardBody>
                  <DexTextInput
                    label="Amount"
                    value={amountAdd}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setErrorMessage({
                        type: '',
                        text: '',
                      });
                      setAmountAdd(event.target.value);
                    }}
                    name="amountAdd"
                    placeholder="Enter amount of tokens"
                    disabled={false}
                    endAdornment={
                      <Box
                        sx={{
                          '& button': {
                            fontSize: '14px',
                            padding: '4px 8px 5px',
                            display: 'inline-block',
                            width: 'auto',
                            margin: '0 16px 0 0',
                            background: 'rgba(63, 73, 225, 0.08)',
                            color: 'rgb(63, 73, 225)',
                            borderRadius: '8px',
                            minWidth: 0,
                            '&:hover': {
                              background: 'rgba(63, 73, 225, 0.12)',
                              color: 'rgb(63, 73, 225)',
                            },
                          },
                        }}
                      >
                        <MuiButton
                          disableElevation
                          size="small"
                          variant="contained"
                          onClick={() => {
                            setAmountAdd(
                              wallets.find(
                                (wallet: LiquidityWallet) =>
                                  wallet.id === selectedWallet
                              )?.balance || '0'
                            );
                          }}
                        >
                          max
                        </MuiButton>
                      </Box>
                    }
                    error={errorMessage}
                  />

                  {loading && <DexLoading />}
                  <DexCardSubmitButton
                    disabled={loading}
                    label={
                      loading
                        ? 'Waiting transaction'
                        : user
                        ? 'Withdraw'
                        : 'Connect wallet'
                    }
                    onClick={
                      user
                        ? handleWithdrawClick
                        : () => {
                            connect();
                          }
                    }
                  />
                </DexCardBody>
              </>
            }
          />
          <Route
            path={VIEWS.ADD.path}
            element={
              <>
                <DexCardHeader
                  title="Add funds"
                  titleSize={18}
                  titleAlign="center"
                  startAdornment={
                    <IconButton
                      size="medium"
                      edge="start"
                      onClick={() => {
                        setAmountAdd('');
                        setSelectedWallet('');
                        navigate(VIEWS.ROOT.fullPath);
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  }
                  endAdornment={<Box width={28} height={40} />}
                />

                <DexCardBody>
                  <DexTextInput
                    label="Amount"
                    value={amountAdd}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setErrorMessage({
                        type: '',
                        text: '',
                      });
                      setAmountAdd(event.target.value);
                    }}
                    name="amountAdd"
                    placeholder="Enter amount of tokens"
                    disabled={false}
                    error={errorMessage}
                  />

                  {loading && <DexLoading />}
                  <DexCardSubmitButton
                    disabled={loading}
                    label={
                      loading
                        ? 'Waiting transaction'
                        : user
                        ? 'Add funds'
                        : 'Connect wallet'
                    }
                    onClick={
                      user
                        ? handleAddClick
                        : () => {
                            connect();
                          }
                    }
                  />
                </DexCardBody>
              </>
            }
          />
          <Route
            path={VIEWS.SELECT_CHAIN.path}
            element={
              <>
                <DexCardHeader
                  title="Select blockchain"
                  titleSize={18}
                  titleAlign="center"
                  startAdornment={
                    <IconButton
                      size="medium"
                      edge="start"
                      onClick={() => {
                        navigate(VIEWS.CREATE.fullPath);
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  }
                  endAdornment={<Box width={28} height={40} />}
                />
                <Box pb="20px">
                  <DexChainsList
                    chain={chain}
                    chains={chains.filter(
                      (chain: Chain) =>
                        !wallets
                          .map((wallet: LiquidityWallet) => wallet.chain)
                          .includes(chain.value)
                    )}
                    onClick={(blockchain: any) => {
                      setChain(blockchain.value);
                      navigate(VIEWS.CREATE.fullPath);
                    }}
                  />
                </Box>
              </>
            }
          />
        </Routes>
      </DexCard>
    </>
  );
}

export default LiquidityWalletPage;
