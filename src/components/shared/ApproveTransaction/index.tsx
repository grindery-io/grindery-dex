import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {useGrinderyNexus} from "use-grindery-nexus";
import {CircularProgress} from "grindery-ui";
import {ButtonWrapper, Title} from "./style";
import {DEPAY_ABI, DEPAY_CONTRACT_ADDRESS} from "../../../constants";

function ApproveTransaction() {
  const {address, provider, ethers} = useGrinderyNexus();

  const [spenderAddress, setSpenderAddress] = useState<string | null>("");
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async () => {
    const contract = new ethers.Contract(
      DEPAY_CONTRACT_ADDRESS,
      DEPAY_ABI,
      provider
    );
    const signer = provider.getSigner();

    const depayWithSigner = contract.connect(signer);

    const tx = await depayWithSigner.approve(spenderAddress, amount);
    setLoading(true);
    await tx.wait();
    setLoading(false);
  };

  return (
    <>
      <Title>Approve</Title>
      <TextInput
        value={address}
        onChange={(address: string) => setSpenderAddress(address)}
        label="Spender Address"
        required
      />
      <TextInput
        value={amount}
        onChange={(amount: number) => setAmount(amount)}
        label="Amount"
        required
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
      {!loading && (
        <ButtonWrapper>
          <Button value="Approve" size="small" onClick={handleClick} />
        </ButtonWrapper>
      )}
    </>
  );
}

export default ApproveTransaction;
