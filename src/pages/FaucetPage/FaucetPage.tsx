import { useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import { useGrinderyNexus } from 'use-grindery-nexus';
import Grt from '../../components/grindery/Abi/Grt.json';
import AlertBox from '../../components/grindery/AlertBox';
import { Box } from '@mui/system';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DexCardHeader from '../../components/grindery/DexCard/DexCardHeader';
import DexCard from '../../components/grindery/DexCard/DexCard';
import DexCardBody from '../../components/grindery/DexCard/DexCardBody';
import DexLoading from '../../components/grindery/DexLoading/DexLoading';
import DexCardSubmitButton from '../../components/grindery/DexCard/DexCardSubmitButton';
import DexSelectChainButton from '../../components/grindery/DexSelectChainButton/DexSelectChainButton';
import DexTextInput from '../../components/grindery/DexTextInput/DexTextInput';
import DexChainsList from '../../components/grindery/DexChainsList/DexChainsList';
import { Chain } from '../../types/Chain';
import { GRT_CONTRACT_ADDRESS } from '../../constants';
import { Route, Routes, useNavigate } from 'react-router-dom';
import useGrinderyChains from '../../hooks/useGrinderyChains';

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

const VIEWS = {
  ROOT: {
    path: '/',
    fullPath: '/faucet',
  },
  SELECT_CHAIN: {
    path: '/select-chain',
    fullPath: '/faucet/select-chain',
  },
};

function FaucetPage() {
  const {
    user,
    address,
    provider,
    ethers,
    connect,
    chain: selectedChain,
  } = useGrinderyNexus();
  let navigate = useNavigate();
  const [userAddress, setUserAddress] = useState<string | null>(address || '');
  const [amountGRT, setAmountGRT] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [trxHash, setTrxHash] = useState<string | null>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState({ type: '', text: '' });

  const [chain, setChain] = useState(selectedChain || '');
  //const [view, setView] = useState(VIEWS.ROOT);
  const { chains, isLoading: chainsIsLoading } = useGrinderyChains();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentChain =
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

  const handleClick = async () => {
    setTrxHash('');
    setErrorMessage({
      type: '',
      text: '',
    });
    if (!userAddress) {
      setErrorMessage({
        type: 'userAddress',
        text: 'Wallet address is required',
      });
      return;
    }
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
    const signer = provider.getSigner();
    const _grtContract = new ethers.Contract(
      GRT_CONTRACT_ADDRESS[chain.toString()],
      Grt.abi,
      signer
    );
    const grtContract = _grtContract.connect(signer);
    const tx = await grtContract.mint(
      userAddress,
      ethers.utils.parseEther(amountGRT)
    );
    try {
      setLoading(true);
      await tx.wait();
      setLoading(false);
    } catch (e) {
      setError(true);
      setLoading(false);
    }

    setTrxHash(tx.hash);
  };

  useEffect(() => {
    if (address) {
      setUserAddress(address);
      setChain(selectedChain || '');
    }
  }, [address, selectedChain]);

  useEffect(() => {
    const formattedChain =
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
    if (formattedChain && formattedChain.id) {
      window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: formattedChain.id,
            chainName: formattedChain.label,
            rpcUrls: formattedChain.rpc,
            nativeCurrency: {
              name: formattedChain.nativeToken,
              symbol: formattedChain.nativeToken,
              decimals: 18,
            },
          },
        ],
      });
    }
  }, [chain, chains]);

  return (
    <>
      <DexCard>
        <Routes>
          <Route
            path={VIEWS.ROOT.path}
            element={
              <>
                <DexCardHeader title="Get GRT Tokens" />

                <DexCardBody>
                  <DexSelectChainButton
                    title="Blockchain"
                    onClick={() => {
                      navigate(VIEWS.SELECT_CHAIN.fullPath);
                    }}
                    chain={currentChain}
                  />

                  <DexTextInput
                    label="Wallet address"
                    value={userAddress || ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setErrorMessage({
                        type: '',
                        text: '',
                      });
                      setUserAddress(event.target.value);
                    }}
                    name="userAddress"
                    placeholder="0x"
                    disabled={false}
                    error={errorMessage}
                  />

                  <DexTextInput
                    label="Amount"
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
                    disabled={false}
                    error={errorMessage}
                  />

                  {loading && <DexLoading />}
                  {trxHash && <AlertBox trxHash={trxHash} isError={error} />}

                  <DexCardSubmitButton
                    disabled={loading}
                    label={
                      loading
                        ? 'Waiting transaction'
                        : user
                        ? 'Get GRT'
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
                        navigate(VIEWS.ROOT.fullPath);
                      }}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  }
                  endAdornment={<Box width={28} height={40} />}
                />
                <Box pb="20px">
                  <DexChainsList
                    chains={chains}
                    chain={chain}
                    onClick={(blockchain: Chain) => {
                      setChain(blockchain.value);
                      navigate(VIEWS.ROOT.fullPath);
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

export default FaucetPage;
