import {useState} from "react";
import {TextInput, Button, SelectSimple} from "grindery-ui";
import {Title, ButtonWrapper, Text} from "./style";
import {useGrinderyNexus} from "use-grindery-nexus";
import {DEPAY_ABI, DEPAY_CONTRACT_ADDRESS} from "../../../constants";
import {CircularProgress} from "grindery-ui";

function Deposit() {
  const [grtAmount, setGrtAmount] = useState<string | null>("");
  const [erc20TokenAddrs, setErc20TokenAddrs] = useState<string | null>("");
  const [erc20AmountReq, setERC20AmountReq] = useState<string | null>("");
  const [destinationAddrs, setDestinationAddrs] = useState<string | null>("");
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
    console.log(chain?.toString().split(":").pop());

    const contract = new ethers.Contract(
      DEPAY_CONTRACT_ADDRESS,
      DEPAY_ABI,
      provider
    );
    const signer = provider.getSigner();
    const depayWithSigner = contract.connect(signer);

    const tx = await depayWithSigner.depositGRTRequestERC20(
      100,
      10,
      erc20TokenAddrs,
      1000,
      5,
      destinationAddrs,
      {
        gasLimit: 30000,
      }
    );
    setLoading(true);
    const response = await tx.wait();
    console.log(response);
    // setLoading(false);
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
        onChange={(amount: string) => setGrtAmount(amount)}
        label="GRT Amount"
        required
      />
      {requestType === requestTypeOptions[0].value && (
        <TextInput
          onChange={(address: string) => setErc20TokenAddrs(address)}
          label="ERC20 Token Address Request"
          required
        />
      )}
      <TextInput
        onChange={(erc20Amount: string) => setERC20AmountReq(erc20Amount)}
        label="ERC20 Amount Required"
        required
      />
      <TextInput
        onChange={(destinationAddrs: string) =>
          setDestinationAddrs(destinationAddrs)
        }
        label="Destination Address"
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
          <Button value="Deposit" size="small" onClick={handleClick} />
        </ButtonWrapper>
      )}
    </>
  );
}

export default Deposit;
