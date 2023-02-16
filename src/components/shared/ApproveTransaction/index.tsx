import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {useGrinderyNexus} from "use-grindery-nexus";
import {CircularProgress} from "grindery-ui";
import {ButtonWrapper, Title} from "./style";
import {GRTPOOL_CONTRACT_ADDRESS} from "../../../constants";
import ERC20 from "../Abi/ERC20.json";
import AlertBox from "../AlertBox";

function ApproveTransaction() {
  const {provider, ethers} = useGrinderyNexus();
  const [tokenAddress, setTokenAddress] = useState<string | null>(
    "0x1e3C935E9A45aBd04430236DE959d12eD9763162"
  );
  const [spenderAddress, setSpenderAddress] = useState<string>(
    GRTPOOL_CONTRACT_ADDRESS
  );
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [trxHash, setTrxHash] = useState<string | null>("");
  const [error, setError] = useState<boolean>(false);

  const handleClick = async () => {
    const contract = new ethers.Contract(tokenAddress, ERC20, provider);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    const tx = await contractWithSigner.approve(spenderAddress, amount);

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
      {trxHash && <AlertBox trxHash={trxHash} isError={error} />}
      {!loading && (
        <ButtonWrapper>
          <Button value="Approve" size="small" onClick={handleClick} />
        </ButtonWrapper>
      )}
    </>
  );
}

export default ApproveTransaction;
