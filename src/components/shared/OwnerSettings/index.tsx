import {useState} from "react";
import {TextInput, Button, SelectSimple, CircularProgress} from "grindery-ui";
import {ButtonWrapper} from "../AcceptOffer/style";
import {Title} from "../AccountModal/style";
import {useGrinderyNexus} from "use-grindery-nexus";
import {GRTPOOL_CONTRACT_ADDRESS} from "../../../constants";
import GrtPool from "../Abi/GrtPool.json";
import AlertBox from "../AlertBox";

function OwnerSettings() {
  const operationOptions = [
    {label: "Set GRT address (GRT pool)", value: "setGRTAddr"},
    {label: "Set GRT chain id (GRT pool)", value: "setGRTChainId"},
    {label: "Set Reality address (GRT pool)", value: "setAddrReality"},
  ];
  const {provider, ethers} = useGrinderyNexus();
  const [operation, setOperations] = useState<string>(
    operationOptions[0].value
  );
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number>(0);
  const [trxHash, setTrxHash] = useState<string | null>("");
  const [error, setError] = useState<boolean>(false);

  const signer = provider.getSigner();

  const _grtPoolContract = new ethers.Contract(
    GRTPOOL_CONTRACT_ADDRESS,
    GrtPool.abi,
    signer
  );
  const grtPoolContract = _grtPoolContract.connect(signer);

  const handleClick = async () => {
    let tx: any;

    try {
      switch (operation) {
        case "setGRTAddr":
          tx = await grtPoolContract.setGRTAddr(address, {
            gasLimit: 100000,
          });
          break;

        case "setGRTChainId":
          tx = await grtPoolContract.setGRTChainId(chainId, {
            gasLimit: 100000,
          });
          break;

        case "setAddrReality":
          tx = await grtPoolContract.setAddrReality(address, {
            gasLimit: 100000,
          });
          break;
      }

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
      <Title>Owner Settings</Title>
      <SelectSimple
        options={operationOptions}
        value={operation}
        onChange={(e: any) => {
          setOperations(e.target.value);
        }}
      />
      {operation === "setGRTAddr" && (
        <>
          <TextInput
            onChange={(grtAddrs: string) => setAddress(grtAddrs)}
            label="GRT Address"
            required
            placeholder={"0x1e3C935E9A45aBd04430236DE959d12eD9763162"}
          />
        </>
      )}
      {operation === "setGRTChainId" && (
        <>
          <TextInput
            onChange={(grtChainId: number) => setChainId(grtChainId)}
            label="GRT Chain Id"
            required
            placeholder={"5"}
          />
        </>
      )}
      {operation === "setAddrReality" && (
        <>
          <TextInput
            onChange={(address: string) => setAddress(address)}
            label="Reality Address"
            required
            placeholder={"0x6F80C5cBCF9FbC2dA2F0675E56A5900BB70Df72f"}
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
      {trxHash && <AlertBox trxHash={trxHash} isError={error} />}
      {!loading && (
        <ButtonWrapper>
          <Button value="Run" size="small" onClick={handleClick} />
        </ButtonWrapper>
      )}
    </>
  );
}

export default OwnerSettings;
