import {useState} from "react";
import {TextInput, Button, CircularProgress} from "grindery-ui";
import {Title, ButtonWrapper} from "./style";
import {useGrinderyNexus} from "use-grindery-nexus";
import {GRTPOOL_CONTRACT_ADDRESS} from "../../../constants";
import GrtPool from "../Abi/GrtPool.json";
import AlertBox from "../AlertBox";

function ClaimReward() {
  const [offerId, setOfferId] = useState<string | null>("");
  const [requestId, setRequestId] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);
  const {provider, ethers} = useGrinderyNexus();
  const [trxHash, setTrxHash] = useState<string | null>("");
  const [error, setError] = useState<boolean>(false);

  const handleClick = async () => {
    const contract = new ethers.Contract(
      GRTPOOL_CONTRACT_ADDRESS,
      GrtPool.abi,
      provider
    );
    const signer = provider.getSigner();
    const depayWithSigner = contract.connect(signer);
    const tx = await depayWithSigner.claimGRTWithoutDispute(
      requestId,
      offerId,
      {
        gasLimit: 500000,
      }
    );

    try {
      setLoading(true);
      await tx.wait();
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }

    setTrxHash(tx.hash);
  };

  return (
    <>
      <Title>Claim Reward</Title>
      <TextInput
        onChange={(offerId: string) => setOfferId(offerId)}
        label="Offer Id"
        required
        placeholder={"0"}
      />
      <TextInput
        onChange={(requestId: string) => setRequestId(requestId)}
        label="Request Id"
        required
        placeholder={
          "0xd2b8dbec86dba5f9b5c34f84d0dc19bf715f984e3c78051e5ffa813a1d29dd73"
        }
      />
      {loading && (
        <>
          <div style={{textAlign: "center", margin: "0 0 20px"}}>
            Grindery DePay is now waiting to complete the operation
          </div>
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
          <Button value="Claim" size="small" onClick={handleClick} />
        </ButtonWrapper>
      )}
    </>
  );
}

export default ClaimReward;
