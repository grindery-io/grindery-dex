import {useState} from "react";
import {TextInput, Button, CircularProgress} from "grindery-ui";
import {Title, ButtonWrapper} from "./style";
import GrtSatellite from "../Abi/GrtSatellite.json";
import {useGrinderyNexus} from "use-grindery-nexus";
import {GRTSATELLITE_CONTRACT_ADDRESS} from "../../../constants";
import AlertBox from "../AlertBox";

type HonourCrossOnChainProps = {
  tokenAddress: string | null;
  toAddress: string | null;
  amount: string | null;
};

function HonourOfferCrossChain(props: HonourCrossOnChainProps) {
  const {provider, ethers} = useGrinderyNexus();
  const [tokenAddress, setTokenAddress] = useState(props.tokenAddress);
  const [toAddress, setToAddress] = useState(props.toAddress);
  const [amount, setAmount] = useState(props.amount);
  const [loading, setLoading] = useState<boolean>(false);
  const [trxHash, setTrxHash] = useState<string | null>("");
  const [error, setError] = useState<boolean>(false);

  const handleClick = async () => {
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      GRTSATELLITE_CONTRACT_ADDRESS,
      GrtSatellite.abi,
      signer
    );
    const contractWithSigner = contract.connect(signer);
    const tx = await contractWithSigner.payOfferCrossChainERC20(
      tokenAddress,
      toAddress,
      amount,
      {
        gasLimit: 500000,
      }
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

  return (
    <>
      <Title>Honour Offer Cross-chain</Title>
      <TextInput
        onChange={(tokenAddress: string) => setTokenAddress(tokenAddress)}
        label="Token Address"
        required
        placeholder={"0x1e3C935E9A45aBd04430236DE959d12eD9763162"}
        value={tokenAddress}
      />
      <TextInput
        onChange={(toAddress: string) => setToAddress(toAddress)}
        label="To"
        required
        placeholder={"0x1e3C935E9A45aBd04430236DE959d12eD9763162"}
        value={toAddress}
      />
      <TextInput
        onChange={(amount: string) => setAmount(amount)}
        label="Amount"
        required
        placeholder={"1"}
        value={amount}
      />
      {loading && (
        <>
          <div
            style={{
              bottom: "32px",
              left: 0,
              textAlign: "center",
              color: "#8C30F5",
              width: "100%",
              margin: "10px",
            }}
          >
            <CircularProgress color="inherit" />
          </div>
        </>
      )}
      {trxHash && <AlertBox trxHash={trxHash} isError={error} />}
      {!loading && (
        <ButtonWrapper>
          <Button value="Honour" size="small" onClick={handleClick} />
        </ButtonWrapper>
      )}
    </>
  );
}

export default HonourOfferCrossChain;
