import {useState} from "react";
import {TextInput, Button, CircularProgress, SelectSimple} from "grindery-ui";
import {Title, ButtonWrapper} from "./style";
import {GRTPOOL_CONTRACT_ADDRESS} from "../../../constants";
import GrtPool from "../Abi/GrtPool.json";
import {useGrinderyNexus} from "use-grindery-nexus";
import AlertBox from "../AlertBox";

type HonourOfferOnChainProps = {
  requestId: string | null;
  offerId: string | null;
  tokenType: string | null;
};

function HonourOfferOnChain(props: HonourOfferOnChainProps) {
  const [offerId, setOfferId] = useState<string | null>(props.offerId);
  const [requestId, setRequestId] = useState<string | null>(props.requestId);
  const [amount, setAmount] = useState<number>(0);
  const {provider, ethers} = useGrinderyNexus();
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
    const contract = new ethers.Contract(
      GRTPOOL_CONTRACT_ADDRESS,
      GrtPool.abi,
      provider
    );
    const signer = provider.getSigner();
    const depayWithSigner = contract.connect(signer);
    let tx;

    if (honourOffer === "ERC20") {
      tx = await depayWithSigner.payOfferOnChainERC20(requestId, offerId, {
        gasLimit: 500000,
      });
    }

    if (honourOffer === "Native") {
      tx = await depayWithSigner.payOfferOnChainNative(requestId, offerId, {
        value: ethers.utils.parseEther(amount),
        gasLimit: 50000,
      });
    }

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
      <Title>Honour Offer On-chain</Title>
      <SelectSimple
        options={honourOfferType}
        value={honourOffer}
        onChange={(e: any) => {
          setHonourOffer(e.target.value);
        }}
      />
      <TextInput
        onChange={(offerId: string) => setOfferId(offerId)}
        label="Offer Id"
        required
        placeholder={"0"}
        value={offerId}
      />
      <TextInput
        onChange={(requestId: string) => setRequestId(requestId)}
        label="Request Id"
        required
        placeholder={
          "0xd2b8dbec86dba5f9b5c34f84d0dc19bf715f984e3c78051e5ffa813a1d29dd73"
        }
        value={requestId}
      />
      {honourOffer === "Native" && (
        <TextInput
          onChange={(amount: number) => setAmount(amount)}
          label="Amount"
          required
          placeholder={"10"}
          value={amount}
        />
      )}
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
        <>
          <ButtonWrapper>
            <Button value="Honour Offer" size="small" onClick={handleClick} />
          </ButtonWrapper>
        </>
      )}
    </>
  );
}

export default HonourOfferOnChain;
