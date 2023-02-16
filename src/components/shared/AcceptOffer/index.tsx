import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {ButtonWrapper, Title} from "./style";
import {GRTPOOL_CONTRACT_ADDRESS} from "../../../constants";
import {useGrinderyNexus} from "use-grindery-nexus";
import GrtPool from "../Abi/GrtPool.json";

function AcceptOffer() {
  const [offerId, setOfferId] = useState<string | null>("");
  const [requestId, setRequestId] = useState<string | null>("");
  const {provider, ethers} = useGrinderyNexus();

  const handleClick = async () => {
    const contract = new ethers.Contract(
      GRTPOOL_CONTRACT_ADDRESS,
      GrtPool.abi,
      provider
    );
    const signer = provider.getSigner();
    const depayWithSigner = contract.connect(signer);
    const tx = await depayWithSigner.acceptOffer(requestId, offerId);
    await tx.wait();
    console.log(tx);
  };

  return (
    <>
      <Title>Accept Offer</Title>
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
        placeholder={"0xd2b8dbec86dba5f9b5c34f84d0dc19bf715f984e3c78051e5ffa813a1d29dd73"}
      />
      <ButtonWrapper>
        <Button value="Accept" size="small" onClick={handleClick} />
      </ButtonWrapper>
    </>
  );
}

export default AcceptOffer;
