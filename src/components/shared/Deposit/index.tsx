import {useEffect, useState} from "react";
import {TextInput, Button, SelectSimple} from "grindery-ui";
import {Title, ButtonWrapper, Text} from "./style";
import {useGrinderyNexus} from "use-grindery-nexus";
import {GRTPOOL_CONTRACT_ADDRESS} from "../../../constants";
import {CircularProgress} from "grindery-ui";
import GrtPool from "../Abi/GrtPool.json";
import AlertBox from "../AlertBox";

function Deposit() {
  const {address, provider, ethers, chain} = useGrinderyNexus();
  const [grtAmount, setGrtAmount] = useState<string | null>("1");
  const [erc20TokenAddrs, setErc20TokenAddrs] = useState<string | null>(
    "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
  );
  const [erc20AmountReq, setERC20AmountReq] = useState<string | null>("1");
  const [destinationAddrs, setDestinationAddrs] = useState<string | null>(
    address
  );
  const [nonce, setNonce] = useState<number | null>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [trxHash, setTrxHash] = useState<string | null>("");
  const [error, setError] = useState<boolean>(false);

  const requestTypeOptions = [
    {label: "ERC20 Token", value: "ERC20"},
    {label: "Native Token", value: "Native"},
  ];
  const [requestType, setRequestType] = useState<string>(
    requestTypeOptions[0].value
  );
  let tx: any;

  const handleClick = async () => {
    const chainId = chain?.toString().split(":").pop();
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      GRTPOOL_CONTRACT_ADDRESS,
      GrtPool.abi,
      signer
    );
    const depayWithSigner = contract.connect(signer);

    switch (requestType) {
      case requestTypeOptions[0].value:
        tx = await depayWithSigner.depositGRTRequestERC20(
          nonce,
          grtAmount,
          erc20TokenAddrs,
          erc20AmountReq,
          chainId,
          destinationAddrs,
          {gasLimit: 500000}
        );
        break;

      case requestTypeOptions[1].value:
        tx = await depayWithSigner.depositGRTRequestNative(
          nonce,
          grtAmount,
          erc20AmountReq,
          chainId,
          destinationAddrs,
          {gasLimit: 500000}
        );
        break;

      default:
        break;
    }

    setTrxHash(tx.hash);

    try {
      setLoading(true);
      await tx.wait();
      setLoading(false);
    } catch (e) {
      setError(true);
      setLoading(false);
    }
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
        onChange={(nonce: number) => setNonce(nonce)}
        label="Nonce"
        required
        value={nonce}
        placeholder={nonce}
      />
      <TextInput
        onChange={(amount: string) => setGrtAmount(amount)}
        label="GRT Amount"
        required
        value={grtAmount}
        placeholder={grtAmount}
      />
      {requestType === requestTypeOptions[0].value && (
        <TextInput
          onChange={(address: string) => setErc20TokenAddrs(address)}
          label="ERC20 Token Address Request"
          required
          value={erc20TokenAddrs}
          placeholder={erc20TokenAddrs}
        />
      )}
      <TextInput
        onChange={(erc20Amount: string) => setERC20AmountReq(erc20Amount)}
        label="ERC20 Amount Required"
        required
        value={erc20AmountReq}
        placeholder={erc20AmountReq}
      />
      <TextInput
        onChange={(destinationAddrs: string) =>
          setDestinationAddrs(destinationAddrs)
        }
        label="Destination Address"
        required
        placeholder={destinationAddrs}
        value={destinationAddrs}
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
          <Button value="Deposit" size="small" onClick={handleClick} />
        </ButtonWrapper>
      )}
    </>
  );
}

export default Deposit;
