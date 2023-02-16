import {useState} from "react";
import {TextInput, Button, SelectSimple, CircularProgress} from "grindery-ui";
import {ButtonWrapper} from "../AcceptOffer/style";
import {Title} from "../AccountModal/style";
import {useGrinderyNexus} from "use-grindery-nexus";
import {
  DEPAY_CONTRACT_ADDRESS,
  DEPAY_DISPUTE_ADDRESS,
} from "../../../constants";
import GrtPool from "../Abi/GrtPool.json";
import GrtDispute from "../Abi/GrtDispute.json";

function OwnerSettings() {
  const operationOptions = [
    {label: "Set GRT address (GRT pool)", value: "setGRTAddr"},
    {label: "Set GRT chain id (GRT pool)", value: "setGRTChainId"},
    {label: "Set Reality address (GRT Satellite)", value: "setAddrReality"},
  ];
  const {provider, ethers} = useGrinderyNexus();
  const [operation, setOperations] = useState<string>(
    operationOptions[0].value
  );
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number>(0);

  const signer = provider.getSigner();

  const contract = new ethers.Contract(
    DEPAY_CONTRACT_ADDRESS,
    GrtPool.abi,
    signer
  );
  const contractWithSigner = contract.connect(signer);

  const grtSatellite = new ethers.Contract(
    DEPAY_DISPUTE_ADDRESS,
    GrtDispute.abi,
    signer
  );
  const grtSatelliteWithSigner = grtSatellite.connect(signer);

  const handleClick = async () => {
    if (operation === operationOptions[0].value) {
      const tx = await contractWithSigner.setGRTAddr(address, {
        gasLimit: 100000,
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
    }
    if (operation === operationOptions[1].value) {
      const tx = await contractWithSigner.setGRTChainId(chainId, {
        gasLimit: 100000,
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
    }
    if (operation === operationOptions[2].value) {
      const tx = await grtSatelliteWithSigner.setAddrReality(address, {
        gasLimit: 100000,
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
    }
  };

  return (
    <>
      <Title>Owner Settings</Title>
      <SelectSimple
        options={operationOptions}
        value={operation}
        onChange={(e: any) => {
          setOperations(e.target.value);
        }}
      />
      {operation === operationOptions[0].value && (
        <>
          <TextInput
            onChange={(grtAddrs: string) => setAddress(grtAddrs)}
            label="GRT Address"
            required
          />
        </>
      )}
      {operation === operationOptions[1].value && (
        <>
          <TextInput
            onChange={(grtChainId: number) => setChainId(grtChainId)}
            label="GRT Chain Id"
            required
          />
        </>
      )}
      {operation === operationOptions[2].value && (
        <>
          <TextInput
            onChange={(address: string) => setAddress(address)}
            label="Reality Address"
            required
          />
        </>
      )}
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
          <Button value="Run" size="small" onClick={handleClick} />
        </ButtonWrapper>
      )}
    </>
  );
}

export default OwnerSettings;
