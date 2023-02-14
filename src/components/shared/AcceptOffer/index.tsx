import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {ButtonWrapper, Title} from "./style";
import {DEPAY_ABI, DEPAY_CONTRACT_ADDRESS} from "../../../constants";
import {useGrinderyNexus} from "use-grindery-nexus";

function AcceptOffer() {
  const [offerId, setOfferId] = useState<string | null>("");
  const [requestId, setRequestId] = useState<string | null>("");
  const {provider, ethers} = useGrinderyNexus();

  const handleClick = async () => {
    const contract = new ethers.Contract(
      DEPAY_CONTRACT_ADDRESS,
      DEPAY_ABI,
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
      />
      <TextInput
        onChange={(requestId: string) => setRequestId(requestId)}
        label="Request Id"
        required
      />
      <ButtonWrapper>
        <Button value="Accept" size="small" onClick={handleClick} />
      </ButtonWrapper>
    </>
  );
}

export default AcceptOffer;
