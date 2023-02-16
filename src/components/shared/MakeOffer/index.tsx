import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {ButtonWrapper, Title} from "./style";
import {useGrinderyNexus} from "use-grindery-nexus";
import {GRTPOOL_CONTRACT_ADDRESS} from "../../../constants";
import GrtPool from "../Abi/GrtPool.json";

function MakeOffer() {
  const [amount, setAmount] = useState<string | null>("");
  const [requestId, setRequestId] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);
  const {address, provider, ethers, chain} = useGrinderyNexus();

  const handleClick = async () => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      GRTPOOL_CONTRACT_ADDRESS,
      GrtPool.abi,
      signer
    );
    const depayWithSigner = contract.connect(signer);
    const tx = await depayWithSigner.createOffer(
      requestId,
      amount,
      {gasLimit: 500000,}
    );
    setLoading(true);
    const response = await tx.wait();
    console.log(response);
    setLoading(false);
  };

  return (
    <>
      <Title>Make Offer</Title>
      <TextInput
        onChange={(amount: string) => setAmount(amount)}
        label="Amount"
        required
        placeholder={"1"}
      />
      <TextInput
        onChange={(requestId: string) => setRequestId(requestId)}
        label="Request Id"
        required
        placeholder={"0xd2b8dbec86dba5f9b5c34f84d0dc19bf715f984e3c78051e5ffa813a1d29dd73"}
      />
      <ButtonWrapper>
        <Button value="Offer" size="small" onClick={handleClick} />
      </ButtonWrapper>
    </>
  );
}

export default MakeOffer;
