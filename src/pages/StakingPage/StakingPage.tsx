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
import DexStake from '../../components/grindery/DexStake/DexStake';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import DexTextInput from '../../components/grindery/DexTextInput/DexTextInput';
import DexSelectChainButton from '../../components/grindery/DexSelectChainButton/DexSelectChainButton';
import DexChainsList from '../../components/grindery/DexChainsList/DexChainsList';
import { Chain } from '../../types/Chain';
import { Stake } from '../../types/Stake';
import DexAlertBox from '../../components/grindery/DexAlertBox/DexAlertBox';
import { getErrorMessage } from '../../utils/error';
import Grt from '../../components/grindery/Abi/Grt.json';
import useAbi from '../../hooks/useAbi';
import useGrinderyChains from '../../hooks/useGrinderyChains';
import { GRT_CONTRACT_ADDRESS, POOL_CONTRACT_ADDRESS } from '../../constants';
import { Route, Routes, useNavigate } from 'react-router-dom';
import useStakes from '../../hooks/useStakes';
import { update } from 'lodash';

function isNumeric(value: string) {
  return /^\d*(\.\d+)?$/.test(value);
}

const VIEWS = {
  ROOT: { path: '/', fullPath: '/sell/staking' },
  STAKE: { path: '/stake', fullPath: '/sell/staking/stake' },
  SELECT_CHAIN: {
    path: '/select-chain',
    fullPath: '/sell/staking/select-chain',
  },
  WITHDRAW: { path: '/withdraw', fullPath: '/sell/staking/withdraw' },
};

function StakingPage() {
  const {
    user,
    connect,
    chain: selectedChain,
    provider,
    ethers,
    //address,
  } = useGrinderyNexus();
  let navigate = useNavigate();
  const { stakingAbi, isLoading: abiIsLoading } = useAbi();
  const [amountGRT, setAmountGRT] = useState<string>('');
  const [amountAdd, setAmountAdd] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });
  const [chain, setChain] = useState(selectedChain || '');

  const { chains, isLoading: chainsIsLoading } = useGrinderyChains();
  const [selectedStake, setSelectedStake] = useState('');
  const {
    stakes,
    isLoading: stakesIsLoading,
    setStakes,
    addStake,
    updateStake,
  } = useStakes();
  const [approved, setApproved] = useState<boolean>(false);
  const filteredChain = chains.find((c) => c.value === chain);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentChain: Chain | null =
    chain && filteredChain
      ? {
          id:
            chain && typeof chain === 'string'
              ? `0x${parseFloat(chain.split(':')[1]).toString(16)}`
              : '',
          value: filteredChain?.value || '',
          label: filteredChain?.label || '',
          icon: filteredChain?.icon || '',
          rpc: filteredChain?.rpc || [],
          nativeToken: filteredChain?.token || '',
        }
      : null;

  // Stake GRT
  const handleStakeClick = async () => {
    // clear error message
    setErrorMessage({
      type: '',
      text: '',
    });

    // validate before executing
    if (!amountGRT) {
      setErrorMessage({
        type: 'amountGRT',
        text: 'Amount is required',
      });
      return;
    }
    if (!isNumeric(amountGRT)) {
      setErrorMessage({
        type: 'amountGRT',
        text: 'Must be a number',
      });
      return;
    }
    if (!chain) {
      setErrorMessage({
        type: 'chain',
        text: 'Blockchain is required',
      });
      return;
    }
    if (!stakingAbi) {
      setErrorMessage({
        type: 'tx',
        text: 'Contract ABI not found.',
      });

      return;
    }
    if (!POOL_CONTRACT_ADDRESS[chain.toString()]) {
      setErrorMessage({
        type: 'tx',
        text: 'Contract address for this chain not found.',
      });

      return;
    }
    // end validation

    // start executing
    setLoading(true);

    // get signer
    const signer = provider.getSigner();

    // approve tokens first
    if (!approved) {
      // set GRT contract
      const _grtContract = new ethers.Contract(
        GRT_CONTRACT_ADDRESS[chain.toString()],
        Grt.abi,
        signer
      );

      // connect signer
      const grtContract = _grtContract.connect(signer);

      // approve GRT
      const txApprove = await grtContract
        .approve(
          POOL_CONTRACT_ADDRESS[chain.toString()],
          ethers.utils.parseEther(amountGRT)
        )
        .catch((error: any) => {
          setErrorMessage({
            type: 'tx',
            text: getErrorMessage(error.error, 'Approval transaction error'),
          });
          console.error('approve error', error.error);
          setLoading(false);
          return;
        });

      // stop executing if approval failed
      if (!txApprove) {
        setLoading(false);
        return;
      }

      // wait for approval transaction
      try {
        await txApprove.wait();
      } catch (error: any) {
        setErrorMessage({
          type: 'tx',
          text: error?.message || 'Transaction error',
        });
        console.error('txApprove.wait error', error);
        setLoading(false);
        return;
      }
      setLoading(false);
      setApproved(true);

      // stake if tokens were approved
    } else {
      // set pool contract
      const _poolContract = new ethers.Contract(
        POOL_CONTRACT_ADDRESS[chain.toString()],
        stakingAbi,
        signer
      );

      // connect signer
      const poolContract = _poolContract.connect(signer);

      // stake GRT
      const tx = await poolContract
        .stakeGRT(
          ethers.utils.parseEther(amountGRT),
          parseFloat(chain.toString().split(':')[1])
        )
        .catch((error: any) => {
          setErrorMessage({
            type: 'tx',
            text: getErrorMessage(error.error, 'Staking transaction error'),
          });
          console.error('stakeGRT error', error.error);
          setLoading(false);
          return;
        });

      // stop execution if stake failed
      if (!tx) {
        setLoading(false);
        return;
      }

      // wait for stake transaction
      try {
        await tx.wait();
      } catch (error: any) {
        setErrorMessage({
          type: 'tx',
          text: error?.message || 'Transaction error',
        });
        console.error('tx.wait error', error);
        setLoading(false);
        return;
      }

      // Add new stake if stake for the chain doesn't exist
      if (
        ![...stakes]
          .map((stake) => stake.chainId)
          .includes(chain.toString().split(':')[1])
      ) {
        const newStake = await addStake({
          chainId: chain.toString().split(':')[1],
          amount: amountGRT,
        });
        if (newStake && typeof newStake !== 'boolean') {
          // update stakes state
          setStakes([
            {
              ...newStake,
              new: true,
            },
            ...[...stakes],
          ]);
        } else {
          // handle error
        }
      } else {
        // update existing stake if stake for the chain exists
        const stakeUpdated = await updateStake({
          chainId: chain.toString().split(':')[1],
          amount: (
            parseInt(
              stakes.find(
                (s: Stake) => s.chainId === chain.toString().split(':')[1]
              )?.amount || '0'
            ) + parseInt(amountGRT)
          ).toString(),
        });
        if (stakeUpdated) {
          // update stakes state
          setStakes(
            [...stakes].map((stake: Stake) => {
              if (stake.chainId === chain.toString().split(':')[1]) {
                return {
                  ...stake,
                  amount: (
                    parseInt(stake.amount) + parseInt(amountGRT)
                  ).toString(),
                  updated: true,
                };
              }
              return stake;
            })
          );
        } else {
          // handle error
        }
      }

      // clear amount field
      setAmountGRT('');

      // complete execution
      setLoading(false);
      setApproved(false);

      // change view
      navigate(VIEWS.ROOT.fullPath);
    }
  };

  // Withdraw tokens
  const handleWithdrawClick = async () => {
    // clear error message
    setErrorMessage({
      type: '',
      text: '',
    });

    // validate data
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
      parseFloat(stakes.find((s) => selectedStake === s._id)?.amount || '0')
    ) {
      setErrorMessage({
        type: 'amountAdd',
        text: `You can withdraw maximum ${
          stakes.find((s) => selectedStake === s._id)?.amount
        } tokens`,
      });
      return;
    }
    // end validation

    // start executing
    setLoading(true);

    // get signer
    const signer = provider.getSigner();

    // set pool contract
    const _poolContract = new ethers.Contract(
      POOL_CONTRACT_ADDRESS[chain.toString()],
      stakingAbi,
      signer
    );

    // connect signer
    const poolContract = _poolContract.connect(signer);

    // unstake GRT
    const tx = await poolContract
      .unstakeGRT(
        ethers.utils.parseEther(amountAdd),
        parseFloat(chain.toString().split(':')[1])
      )
      .catch((error: any) => {
        setErrorMessage({
          type: 'tx',
          text: getErrorMessage(error.error, 'Withdrawal transaction error'),
        });
        console.error('unstakeGRT error', error.error);
        setLoading(false);
        return;
      });

    // stop execution if unstake failed
    if (!tx) {
      setLoading(false);
      return;
    }

    // wait for unstake transaction
    try {
      await tx.wait();
    } catch (error: any) {
      setErrorMessage({
        type: 'tx',
        text: error?.message || 'Transaction error',
      });
      console.error('tx.wait error', error);
      setLoading(false);
      return;
    }

    const stakeUpdated = await updateStake({
      chainId: chain.toString().split(':')[1],
      amount: (
        parseFloat(
          stakes.find((s: Stake) => s._id === selectedStake)?.amount || '0'
        ) - parseFloat(amountAdd)
      ).toString(),
    });
    if (stakeUpdated) {
      // update stakes state
      setStakes((_stakes) => [
        ..._stakes.map((s: Stake) => {
          if (s._id === selectedStake) {
            return {
              ...s,
              amount: (parseFloat(s.amount) - parseFloat(amountAdd)).toString(),
              updated: true,
            };
          } else {
            return s;
          }
        }),
      ]);
    } else {
      // handle error
    }

    // clear amount input
    setAmountAdd('');

    // clear selected stake id
    setSelectedStake('');

    // complete execution
    setLoading(false);

    // change view
    navigate(VIEWS.ROOT.fullPath);
  };

  // update chain state when switched in Metamask
  useEffect(() => {
    setChain(selectedChain || '');
  }, [selectedChain]);

  // Switch chain in Metamask when new chain selected in UI
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
                  title="Staking"
                  endAdornment={
                    user && stakes.length > 4 ? (
                      <Tooltip title="Stake">
                        <IconButton
                          size="medium"
                          edge="end"
                          onClick={() => {
                            navigate(VIEWS.STAKE.fullPath);
                          }}
                        >
                          <AddCircleOutlineIcon sx={{ color: 'black' }} />
                        </IconButton>
                      </Tooltip>
                    ) : null
                  }
                />
                <DexCardBody>
                  {user &&
                    stakes.map((stake: Stake) => {
                      const stakeChain = {
                        icon: chains.find(
                          (c) => c.value === `eip155:${stake.chainId}`
                        )?.icon,
                        label: chains.find(
                          (c) => c.value === `eip155:${stake.chainId}`
                        )?.label,
                        nativeToken: chains.find(
                          (c) => c.value === `eip155:${stake.chainId}`
                        )?.nativeToken,
                      };
                      return (
                        <DexStake
                          key={stake._id}
                          stake={stake}
                          stakeChain={stakeChain}
                          onWithdrawClick={(s: any) => {
                            setSelectedStake(stake._id);
                            navigate(VIEWS.WITHDRAW.fullPath);
                          }}
                        />
                      );
                    })}
                  {stakesIsLoading && <DexLoading />}
                  {errorMessage &&
                    errorMessage.type === 'getStakes' &&
                    errorMessage.text && (
                      <DexAlertBox color="error">
                        <p>{errorMessage.text}</p>
                      </DexAlertBox>
                    )}
                  <DexCardSubmitButton
                    label={user ? 'Stake' : 'Connect wallet'}
                    onClick={
                      user
                        ? () => {
                            navigate(VIEWS.STAKE.fullPath);
                          }
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
            path={VIEWS.STAKE.path}
            element={
              <>
                <DexCardHeader
                  title="Stake"
                  titleSize={18}
                  titleAlign="center"
                  startAdornment={
                    <IconButton
                      size="medium"
                      edge="start"
                      onClick={() => {
                        setAmountGRT('');
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
                      navigate(VIEWS.SELECT_CHAIN.fullPath);
                    }}
                  />

                  <DexTextInput
                    label="GRT Amount"
                    value={amountGRT}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setErrorMessage({
                        type: '',
                        text: '',
                      });
                      setAmountGRT(event.target.value);
                    }}
                    name="amountGRT"
                    placeholder="Enter amount of tokens"
                    disabled={loading}
                    error={errorMessage}
                  />
                  {approved && (
                    <DexAlertBox color="success">
                      <p>
                        Tokens have been approved.
                        <br />
                        You can stake now.
                      </p>
                    </DexAlertBox>
                  )}
                  {loading && <DexLoading />}
                  {errorMessage &&
                    errorMessage.type === 'tx' &&
                    errorMessage.text && (
                      <DexAlertBox color="error">
                        <p>{errorMessage.text}</p>
                      </DexAlertBox>
                    )}

                  <DexCardSubmitButton
                    disabled={loading}
                    label={
                      loading
                        ? 'Waiting transaction'
                        : user
                        ? approved
                          ? 'Stake'
                          : 'Approve'
                        : 'Connect wallet'
                    }
                    onClick={
                      user
                        ? handleStakeClick
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
                        setSelectedStake('');
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
                    label="GRT Amount"
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
                              stakes.find((s) => s._id === selectedStake)
                                ?.amount || '0'
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
                        navigate(VIEWS.STAKE.fullPath);
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
                    chains={chains}
                    onClick={(blockchain: any) => {
                      setChain(blockchain.value);
                      navigate(VIEWS.STAKE.fullPath);
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

export default StakingPage;
