import {useState} from "react";
import {TextInput, Button, SelectSimple} from "grindery-ui";
import {Title, ButtonWrapper, Text} from "./style";
import {useGrinderyNexus} from "use-grindery-nexus";
import {GRTPOOL_CONTRACT_ADDRESS} from "../../../constants";
import {CircularProgress} from "grindery-ui";
import GrtPool from "../Abi/GrtPool.json";
import AlertBox from "../AlertBox";

type DepositProps = {
  requestType: string | null;
  nonce: string | null;
  grtAmount: number | null;
  erc20TokenAddress: string | null;
  erc20TokenAmount: number | null;
  address: string | null;
  chain: string | null;
};

function Deposit(props: DepositProps) {
  const {provider, ethers} = useGrinderyNexus();
  const [grtAmount, setGrtAmount] = useState<number | null>(props.grtAmount);
  const [erc20TokenAddrs, setErc20TokenAddrs] = useState<string | null>(
    props.erc20TokenAddress
  );
  const [erc20AmountReq, setERC20AmountReq] = useState<number | null>(
    props.erc20TokenAmount
  );
  const [destinationAddrs, setDestinationAddrs] = useState<string | null>(
    props.address
  );
  const [nonce, setNonce] = useState<string | null>(props.nonce);
  const [loading, setLoading] = useState<boolean>(false);
  const [trxHash, setTrxHash] = useState<string | null>("");
  const [error, setError] = useState<boolean>(false);

  const requestTypeOptions = [
    {label: "ERC20 Token", value: "ERC20"},
    {label: "Native Token", value: "Native"},
  ];
  const [requestType, setRequestType] = useState<string>(
    props.requestType || requestTypeOptions[0].value
  );
  const chainOptions = [
    {label: "Goerli", value: "5"},
    {label: "BSC - Testnet", value: "97"},
  ];
  const [chain, setChain] = useState<string>(
    props.chain || chainOptions[0].value
  );
  let tx: any;

  const handleClick = async () => {
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
          ethers.utils.parseUnits(grtAmount, 18).toString(),
          erc20TokenAddrs,
          ethers.utils.parseUnits(erc20AmountReq, 18).toString(),
          chain,
          destinationAddrs,
          {gasLimit: 500000}
        );
        break;

      case requestTypeOptions[1].value:
        tx = await depayWithSigner.depositGRTRequestNative(
          nonce,
          ethers.utils.parseUnits(grtAmount, 18).toString(),
          ethers.utils.parseUnits(erc20AmountReq, 18).toString(),
          chain,
          destinationAddrs,
          {gasLimit: 500000}
        );
        break;

      default:
        break;
    }

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
      <Title>Deposit</Title>
      <Text>Request Token Type</Text>
      <SelectSimple
        options={requestTypeOptions}
        value={requestType}
        onChange={(e: any) => {
          setRequestType(e.target.value);
        }}
      />
      <Text>Request Chain</Text>
      <SelectSimple
        options={chainOptions}
        value={chain}
        onChange={(e: any) => {
          setChain(e.target.value);
        }}
      />
      <TextInput
        onChange={(nonce: string) => setNonce(nonce)}
        label="Nonce"
        required
        value={nonce}
        placeholder="0"
      />
      <TextInput
        onChange={(amount: number) => setGrtAmount(amount)}
        label="GRT Amount"
        required
        value={grtAmount}
        placeholder="10"
      />
      {requestType === requestTypeOptions[0].value && (
        <TextInput
          onChange={(address: string) => setErc20TokenAddrs(address)}
          label="ERC20 Token Address Request"
          required
          value={erc20TokenAddrs}
          placeholder="0x2166903c38b4883b855ea2c77a02430a27cdfede"
        />
      )}
      <TextInput
        onChange={(erc20Amount: number) => setERC20AmountReq(erc20Amount)}
        label="ERC20 Amount Required"
        required
        value={erc20AmountReq}
        placeholder="20"
      />
      <TextInput
        onChange={(destinationAddrs: string) =>
          setDestinationAddrs(destinationAddrs)
        }
        label="Destination Address"
        required
        placeholder="0x2166903c38b4883b855ea2c77a02430a27cdfede"
        value={destinationAddrs}
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
          <Button value="Deposit" size="small" onClick={handleClick} />
        </ButtonWrapper>
      )}
    </>
  );
}

export default Deposit;
