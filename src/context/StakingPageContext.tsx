import React, { createContext, useEffect, useState } from 'react';
import { useGrinderyNexus } from 'use-grindery-nexus';
import { Chain } from '../types/Chain';
import { useNavigate } from 'react-router-dom';
import useGrinderyChains from '../hooks/useGrinderyChains';
import { GRT_CONTRACT_ADDRESS, POOL_CONTRACT_ADDRESS } from '../constants';
import useAbi from '../hooks/useAbi';
import { getErrorMessage } from '../utils/error';
import useStakes from '../hooks/useStakes';
import { Stake } from '../types/Stake';

function isNumeric(value: string) {
  return /^\d*(\.\d+)?$/.test(value);
}

// Context props
type ContextProps = {
  VIEWS: {
    [key: string]: {
      path: string;
      fullPath: string;
    };
  };
  amountGRT: string;
  amountAdd: string;
  loading: boolean;
  errorMessage: { type: string; text: string };
  chain: string | number;
  selectedStake: string;
  approved: boolean;
  currentChain: Chain | null;
  setAmountGRT: React.Dispatch<React.SetStateAction<string>>;
  setAmountAdd: React.Dispatch<React.SetStateAction<string>>;
  setErrorMessage: React.Dispatch<
    React.SetStateAction<{ type: string; text: string }>
  >;
  setChain: React.Dispatch<React.SetStateAction<string | number>>;
  setSelectedStake: React.Dispatch<React.SetStateAction<string>>;
  handleStakeClick: () => void;
  handleWithdrawClick: () => void;
};

// Context provider props
type StakingPageContextProps = {
  children: React.ReactNode;
};

// Init context
export const StakingPageContext = createContext<ContextProps>({
  VIEWS: {},
  amountGRT: '',
  amountAdd: '',
  loading: false,
  errorMessage: { type: '', text: '' },
  chain: '',
  selectedStake: '',
  approved: false,
  currentChain: null,
  setAmountGRT: () => {},
  setAmountAdd: () => {},
  setErrorMessage: () => {},
  setChain: () => {},
  setSelectedStake: () => {},
  handleStakeClick: () => {},
  handleWithdrawClick: () => {},
});

export const StakingPageContextProvider = ({
  children,
}: StakingPageContextProps) => {
  const VIEWS = {
    ROOT: { path: '/', fullPath: '/sell/staking' },
    STAKE: { path: '/stake', fullPath: '/sell/staking/stake' },
    SELECT_CHAIN: {
      path: '/select-chain',
      fullPath: '/sell/staking/select-chain',
    },
    WITHDRAW: { path: '/withdraw', fullPath: '/sell/staking/withdraw' },
  };

  const { chain: selectedChain, provider, ethers } = useGrinderyNexus();
  let navigate = useNavigate();
  const { poolAbi, tokenAbi } = useAbi();
  const [amountGRT, setAmountGRT] = useState<string>('');
  const [amountAdd, setAmountAdd] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });
  const [chain, setChain] = useState(selectedChain || '');
  const { chains } = useGrinderyChains();
  const [selectedStake, setSelectedStake] = useState('');
  const { stakes, setStakes, addStake, updateStake } = useStakes();
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
    if (!poolAbi) {
      setErrorMessage({
        type: 'tx',
        text: 'Contract ABI not found.',
      });

      return;
    }
    if (!tokenAbi) {
      setErrorMessage({
        type: 'tx',
        text: 'Token contract ABI not found.',
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
    if (!GRT_CONTRACT_ADDRESS[chain.toString()]) {
      setErrorMessage({
        type: 'tx',
        text: 'Token contract address for this chain not found.',
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
        tokenAbi,
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
        poolAbi,
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
      poolAbi,
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
    <StakingPageContext.Provider
      value={{
        amountGRT,
        amountAdd,
        loading,
        errorMessage,
        chain,
        selectedStake,
        approved,
        currentChain,
        setAmountGRT,
        setAmountAdd,
        setErrorMessage,
        setChain,
        setSelectedStake,
        handleStakeClick,
        handleWithdrawClick,
        VIEWS,
      }}
    >
      {children}
    </StakingPageContext.Provider>
  );
};

export default StakingPageContextProvider;
