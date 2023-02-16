import {useState} from "react";
import {TextInput, Button, SelectSimple} from "grindery-ui";
import {Title, ButtonWrapper, Text} from "./style";
import {useGrinderyNexus} from "use-grindery-nexus";
import {GRTPOOL_CONTRACT_ADDRESS} from "../../../constants";
import {CircularProgress} from "grindery-ui";
import GrtPool from "../Abi/GrtPool.json";

function Deposit() {
  const [grtAmount, setGrtAmount] = useState<string | null>("");
  const [erc20TokenAddrs, setErc20TokenAddrs] = useState<string | null>("");
  const [erc20AmountReq, setERC20AmountReq] = useState<string | null>("");
  const [destinationAddrs, setDestinationAddrs] = useState<string | null>("");
  const [nonce, setNonce] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);
  const {provider, ethers, chain} = useGrinderyNexus();

  const requestTypeOptions = [
    {label: "ERC20 Token", value: "ERC20"},
    {label: "Native Token", value: "Native"},
  ];
  const [requestType, setRequestType] = useState<string>(
    requestTypeOptions[0].value
  );

  const handleClick = async () => {
    const chainId = chain?.toString().split(":").pop();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      GRTPOOL_CONTRACT_ADDRESS,
      GrtPool.abi,
      signer
    );
    const depayWithSigner = contract.connect(signer);
    const tx = await depayWithSigner.depositGRTRequestERC20(
      nonce,
      grtAmount,
      erc20TokenAddrs,
      erc20AmountReq,
      chainId,
      destinationAddrs,
      {gasLimit: 500000}
    );
    setLoading(true);
    const response = await tx.wait();
    console.log(response);
    setLoading(false);
  };

  return (
    <>
      <Title>Deposit</Title>
      <Text>Request Token Type</Text>
      <SelectSimple
        options={requestTypeOptions}
        value={requestType}
        onChange={(e: any) => {
          setRequestType(e.target.value);
        }}
      />
      <TextInput
        onChange={(nonce: string) => setNonce(nonce)}
        label="Nonce"
        required
        value="0"
        placeholder={"0"}
      />
      <TextInput
        onChange={(amount: string) => setGrtAmount(amount)}
        label="GRT Amount"
        required
        value="1"
        placeholder={"1"}
      />
      {requestType === requestTypeOptions[0].value && (
        <TextInput
          onChange={(address: string) => setErc20TokenAddrs(address)}
          label="ERC20 Token Address Request"
          required
          value="0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
          placeholder={"0x326C977E6efc84E512bB9C30f76E30c160eD06FB"}
        />
      )}
      <TextInput
        onChange={(erc20Amount: string) => setERC20AmountReq(erc20Amount)}
        label="ERC20 Amount Required"
        required
        value="1"
        placeholder={"1"}
      />
      <TextInput
        onChange={(destinationAddrs: string) =>
          setDestinationAddrs(destinationAddrs)
        }
        label="Destination Address"
        required
        value="0x710f35C7c7CEC6B4f80D63ED506c356160eB58d1"
        placeholder={"0x710f35C7c7CEC6B4f80D45ED506c356160eB58d1"}
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
          <Button value="Deposit" size="small" onClick={handleClick} />
        </ButtonWrapper>
      )}
    </>
  );
}

export default Deposit;
