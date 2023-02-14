import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {useGrinderyNexus} from "use-grindery-nexus";
import {CircularProgress} from "grindery-ui";
import {ButtonWrapper, Title} from "./style";
import {DEPAY_CONTRACT_ADDRESS, ERC20_ABI} from "../../../constants";

function ApproveTransaction() {
  const {provider, ethers} = useGrinderyNexus();
  const [tokenAddress, setTokenAddress] = useState<string | null>(
    "0x11fe4b6ae13d2a6055c8d9cf65c55bac32b5d844"
  );
  const [spenderAddress, setSpenderAddress] = useState<string>(
    DEPAY_CONTRACT_ADDRESS
  );
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = async () => {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    const tx = await contractWithSigner.approve(spenderAddress, amount);
    setLoading(true);
    await tx.wait();
    setLoading(false);
  };

  return (
    <>
      <Title>Approve</Title>
      <TextInput
        value={tokenAddress}
        onChange={(tokenAddress: string) => setTokenAddress(tokenAddress)}
        label="Token Address"
        required
      />
      <TextInput
        value={spenderAddress}
        onChange={(spenderAddress: string) => setSpenderAddress(spenderAddress)}
        label="Grindery Contract Address"
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
