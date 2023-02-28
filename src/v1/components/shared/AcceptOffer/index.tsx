import {useState} from "react";
import {TextInput, Button, CircularProgress} from "grindery-ui";
import {ButtonWrapper, Title} from "./style";
import {GRTPOOL_CONTRACT_ADDRESS} from "../../../constants";
import {useGrinderyNexus} from "use-grindery-nexus";
import GrtPool from "../Abi/GrtPool.json";
import AlertBox from "../AlertBox";

type AcceptOfferProps = {
  requestId: string | null;
  offerId: string | null;
};

function AcceptOffer(props: AcceptOfferProps) {
  const [offerId, setOfferId] = useState<string | null>(props.offerId);
  const [requestId, setRequestId] = useState<string | null>(props.requestId);
  const [loading, setLoading] = useState<boolean>(false);
  const [trxHash, setTrxHash] = useState<string | null>("");
  const [error, setError] = useState<boolean>(false);
  const {provider, ethers} = useGrinderyNexus();

  const handleClick = async () => {
    const contract = new ethers.Contract(
      GRTPOOL_CONTRACT_ADDRESS,
      GrtPool.abi,
      provider
    );
    const signer = provider.getSigner();
    const depayWithSigner = contract.connect(signer);
    const tx = await depayWithSigner.acceptOffer(requestId, offerId, {
      gasLimit: 500000,
    });

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
      <Title>Accept Offer</Title>
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
          <Button value="Accept" size="small" onClick={handleClick} />
        </ButtonWrapper>
      )}
    </>
  );
}

export default AcceptOffer;
