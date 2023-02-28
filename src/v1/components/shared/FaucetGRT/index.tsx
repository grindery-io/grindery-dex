import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {useGrinderyNexus} from "use-grindery-nexus";
import {CircularProgress} from "grindery-ui";
import {ButtonWrapper, Title} from "./style";
import {GRT_CONTRACT_ADDRESS} from "../../../constants";
import Grt from "../Abi/Grt.json";
import AlertBox from "../AlertBox";

function FaucetGRT() {
  const {provider, ethers} = useGrinderyNexus();
  const [userAddress, setUserAddress] = useState<string | null>(
    "0x1e3C935E9A45aBd04430236DE959d12eD9763162"
  );
  const [amountGRT, setAmountGRT] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [trxHash, setTrxHash] = useState<string | null>("");
  const [error, setError] = useState<boolean>(false);

  const handleClick = async () => {
    const signer = provider.getSigner();
    const _grtContract = new ethers.Contract(
      GRT_CONTRACT_ADDRESS,
      Grt.abi,
      signer
    );
    const grtContract = _grtContract.connect(signer);
    const tx = await grtContract.mint(
      userAddress,
      ethers.utils.parseEther(amountGRT)
    );
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
      <Title>Get GRT Tokens</Title>
      <TextInput
        onChange={(userAddress: string) => setUserAddress(userAddress)}
        label="User address"
        required
      />
      <TextInput
        onChange={(amountGRT: number) => setAmountGRT(amountGRT)}
        label="Token amount (GRT)"
        required
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
          <Button value="Get GRT" size="small" onClick={handleClick} />
        </ButtonWrapper>
      )}
    </>
  );
}

export default FaucetGRT;
