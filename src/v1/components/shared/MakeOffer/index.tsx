import {useState} from "react";
import {TextInput, Button, CircularProgress} from "grindery-ui";
import {ButtonWrapper, Title} from "./style";
import {useGrinderyNexus} from "use-grindery-nexus";
import {GRTPOOL_CONTRACT_ADDRESS} from "../../../constants";
import GrtPool from "../Abi/GrtPool.json";
import AlertBox from "../AlertBox";
import ERC20 from "../Abi/ERC20.json";

type MakeOfferProps = {
  requestId: string | null;
  amount: string | null;
};

function MakeOffer(props: MakeOfferProps) {
  const [amount, setAmount] = useState<string | null>(props.amount);
  const [requestId, setRequestId] = useState<string | null>(props.requestId);
  const [loading, setLoading] = useState<boolean>(false);
  const {provider, ethers} = useGrinderyNexus();
  const [trxHash, setTrxHash] = useState<string | null>("");
  const [error, setError] = useState<boolean>(false);

  const chainOptions = [
    {label: "Goerli", value: "5", ankr: "https://rpc.ankr.com/eth_goerli"},
    {
      label: "BSC - Testnet",
      value: "97",
      ankr: "https://rpc.ankr.com/bsc_testnet_chapel",
    },
  ];

  const handleClick = async () => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      GRTPOOL_CONTRACT_ADDRESS,
      GrtPool.abi,
      signer
    );
    const depayWithSigner = contract.connect(signer);

    const tokenAddress = await depayWithSigner.getRequestToken(requestId);
    const chainId = await depayWithSigner.getRequestChainId(requestId);

    let operationAmount;
    if (tokenAddress === "0x0000000000000000000000000000000000000000") {
      operationAmount = ethers.utils.parseUnits(amount, 18).toString();
    } else {
      const requestProvider = new ethers.providers.JsonRpcProvider(
        chainOptions.find((e) => {
          return e.value === chainId.toString();
        })?.ankr
      );
      const _requestToken = new ethers.Contract(
        tokenAddress,
        ERC20,
        requestProvider
      );
      const requestToken = _requestToken.connect(requestProvider);
      const decimals = await requestToken.decimals();

      operationAmount = ethers.utils.parseUnits(amount, decimals).toString();
    }

    const createOfferTx = await depayWithSigner.createOffer(
      requestId,
      operationAmount,
      {
        gasLimit: 500000,
      }
    );

    try {
      setLoading(true);
      await createOfferTx.wait();
      setLoading(false);
    } catch (e) {
      setError(true);
      setLoading(false);
    }

    setTrxHash(createOfferTx.hash);
  };

  return (
    <>
      <Title>Make Offer</Title>
      <TextInput
        onChange={(amount: string) => setAmount(amount)}
        label="Amount"
        required
        placeholder={"1"}
        value={amount}
      />
      <TextInput
        onChange={(requestId: string) => setRequestId(requestId)}
        label="Request Id"
        required
        placeholder={
          "0xd2b8dbec86dba5f9b5c34f84d0dc19bf715f984e3c78051e5ffa813a1d29dd73"
        }
        value={requestId}
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
          <Button value="Offer" size="small" onClick={handleClick} />
        </ButtonWrapper>
      )}
    </>
  );
}

export default MakeOffer;
