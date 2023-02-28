import {useState} from "react";
import {TextInput, Button, CircularProgress, SelectSimple} from "grindery-ui";
import {Title, ButtonWrapper} from "./style";
import GrtSatellite from "../Abi/GrtSatellite.json";
import {useGrinderyNexus} from "use-grindery-nexus";
import {GRTSATELLITE_CONTRACT_ADDRESS} from "../../../constants";
import AlertBox from "../AlertBox";
import ERC20 from "../Abi/ERC20.json";

type HonourCrossOnChainProps = {
  requestId: string | null;
  offerId: string | null;
  chainIdDeposit: string | null;
  tokenAddress: string | null;
  toAddress: string | null;
  amount: string | null;
  tokenType: string | null;
};

function HonourOfferCrossChain(props: HonourCrossOnChainProps) {
  const {provider, ethers} = useGrinderyNexus();
  const [requestId, setRequestId] = useState(props.requestId);
  const [offerId, setOfferId] = useState(props.offerId);
  const [chainIdDeposit, setChainIdDeposit] = useState(props.chainIdDeposit);
  const [tokenAddress, setTokenAddress] = useState(props.tokenAddress);
  const [toAddress, setToAddress] = useState(props.toAddress);
  const [amount, setAmount] = useState(props.amount);
  const [loading, setLoading] = useState<boolean>(false);
  const [trxHash, setTrxHash] = useState<string | null>("");
  const [error, setError] = useState<boolean>(false);

  const honourOfferType = [
    {label: "ERC20", value: "ERC20"},
    {label: "Native", value: "Native"},
  ];

  const [honourOffer, setHonourOffer] = useState<string>(
    props.tokenType || honourOfferType[0].label
  );

  const handleClick = async () => {
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      GRTSATELLITE_CONTRACT_ADDRESS,
      GrtSatellite.abi,
      signer
    );
    const contractWithSigner = contract.connect(signer);

    let tx;
    try {
      setLoading(true);
      if (honourOffer === "ERC20") {
        const _erc20Contract = new ethers.Contract(
          tokenAddress,
          ERC20,
          signer
        );
        const erc20Contract = _erc20Contract.connect(signer);

        console.log("requestID", requestId);
        console.log("offerID", offerId);
        console.log("chainId", chainIdDeposit);
        console.log("token", tokenAddress);
        console.log("to", toAddress);
        console.log("amount", ethers.utils.parseUnits(
          amount?.toString(),
          await erc20Contract.decimals()
        ).toString());

        tx = await contractWithSigner.payOfferCrossChainERC20(
          requestId,
          offerId,
          chainIdDeposit,
          tokenAddress,
          toAddress,
          ethers.utils.parseUnits(
            amount?.toString(),
            await erc20Contract.decimals()
          ).toString(),
          {
            gasLimit: 500000,
          }
        );
      }

      if (honourOffer === "Native") {
        tx = await contractWithSigner.payOfferCrossChainNative(
          requestId,
          offerId,
          chainIdDeposit,
          toAddress,
          {
            gasLimit: 500000,
            value: ethers.utils.parseUnits(amount, 18).toString(),
          }
        );
      }
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
      <SelectSimple
        options={honourOfferType}
        value={honourOffer}
        onChange={(e: any) => {
          setHonourOffer(e.target.value);
        }}
      />
      <TextInput
        onChange={(requestId: string) => setRequestId(requestId)}
        label="RequestId"
        required
        placeholder={
          "0xd2b8dbec86dba5f9b5c34f84d0dc19bf715f984e3c78051e5ffa813a1d29dd73"
        }
        value={requestId}
      />
      <TextInput
        onChange={(offerId: string) => setOfferId(offerId)}
        label="OfferId"
        required
        placeholder={"0"}
        value={offerId}
      />
      <TextInput
        onChange={(chainIdDeposit: string) => setChainIdDeposit(chainIdDeposit)}
        label="ChainId (initial deposit)"
        required
        placeholder={"5"}
        value={chainIdDeposit}
      />
      {honourOffer === "ERC20" && (
        <TextInput
          onChange={(tokenAddress: string) => setTokenAddress(tokenAddress)}
          label="Token Address"
          required
          placeholder={"0x1e3C935E9A45aBd04430236DE959d12eD9763162"}
          value={tokenAddress}
        />
      )}
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
