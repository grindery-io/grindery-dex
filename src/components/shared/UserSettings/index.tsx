import {useState} from "react";
import {TextInput, Button, SelectSimple, Text} from "grindery-ui";
import {ButtonWrapper} from "../AcceptOffer/style";
import {Title} from "../AccountModal/style";
import {useGrinderyNexus} from "use-grindery-nexus";
import {DEPAY_CONTRACT_ADDRESS, GRT_CONTRACT_ADDRESS} from "../../../constants";
import GrtPool from "../Abi/GrtPool.json";
import Grt from "../Abi/Grt.json";
import {ResponseWrapper} from "./style";

function UserSettings() {
  const operationOptions = [
    {label: "Mint GRT (GRT Token)", value: "mintGRT"},
    {label: "Get owner (GRT pool)", value: "getOwnerPool"},
    {label: "Get GRT Token address (GRT pool)", value: "getGRTAddress"},
    {label: "Get GRT Token chain Id (GRT pool)", value: "getGRTChainId"},
    {label: "Get Reality contract address (GRT pool)", value: "getRealityAddress"},
    {label: "Get nonce for a user (GRT pool)", value: "getNonce"},
    {label: "Get requester address (GRT pool)", value: "getRequester"},
    {label: "Get request recipient address (GRT pool)", value: "getRecipient"},
    {label: "Get deposit token address (GRT pool)", value: "getDepositToken"},
    {label: "Get deposit amount (GRT pool)", value: "getDepositAmount"},
    {label: "Get deposit chain id (GRT pool)", value: "getDepositChainId"},
    {label: "Get request token (GRT pool)", value: "getRequestToken"},
    {label: "Get request amount (GRT pool)", value: "getRequestAmount"},
    {label: "Get request chain id (GRT pool)", value: "getRequestChainId"},
    {label: "Get offer creator address (GRT pool)", value: "getOfferCreator"},
    {label: "Get offer amount (GRT pool)", value: "getOfferAmount"},
    {label: "Number offers for a request (GRT pool)", value: "nbrOffersRequest"},
  ];
  const {provider, ethers} = useGrinderyNexus();
  const [operation, setOperations] = useState<string>("getNonce");
  const [userAddress, setUserAddress] = useState<string>("");
  const [nonce, setNonce] = useState<number>(0);
  const [requestId, setRequestId] = useState<string>("");
  const [addressRequester, setAddressRequester] = useState<string>("");
  const [addressRecipient, setAddressRecipient] = useState<string>("");
  const [depositTokenAddrs, setDepositTokenAddrs] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [depositChainId, setDepositChainId] = useState<number>();
  const [requestToken, setRequestToken] = useState<string>("");
  const [requestAmount, setRequestAmount] = useState<number>(0);
  const [requestChainId, setRequestChainId] = useState<number>(0);
  const [offerAddrsCreator, setOfferAddrsCreator] = useState<string>("");
  const [offerId, setOfferId] = useState<number>(0);
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [nbrOffersRequest, setNbrOffersRequest] = useState<number>(0);
  const [grtToMint, setGrtToMint] = useState<number>(0);
  const [grtAddress, setGrtAddress] = useState<string>("");
  const [grtChainId, setGrtChainId] = useState<number>(0);
  const [realityAddress, setRealityAddress] = useState<string>("");
  const [ownerPool, setOwnerPool] = useState<string>("");

  const signer = provider.getSigner();
  const _grtPoolContract = new ethers.Contract(
    DEPAY_CONTRACT_ADDRESS,
    GrtPool.abi,
    signer
  );
  const grtPoolContract = _grtPoolContract.connect(signer);

  const _grtContract = new ethers.Contract(
    GRT_CONTRACT_ADDRESS,
    Grt.abi,
    signer
  );
  const grtContract = _grtContract.connect(signer);

  const resetState = async () => {
    setUserAddress("");
    setNonce(0);
    setRequestId("");
    setAddressRequester("");
    setAddressRecipient("");
    setDepositTokenAddrs("");
    setDepositAmount(0);
    setDepositChainId(0);
    setRequestToken("");
    setRequestAmount(0);
    setRequestChainId(0);
    setOfferAddrsCreator("");
    setOfferId(0);
    setOfferAmount(0);
    setNbrOffersRequest(0);
    setGrtToMint(0);
    setGrtAddress("");
    setGrtChainId(0);
    setRealityAddress("");
    setOwnerPool("");
  }

  const handleClick = async () => {

    switch (operation) {
      case "getNonce":
        setNonce(
          (await grtPoolContract.getNonce(userAddress))
          .toString()
        );
        break;
      case "getRequester":
        setAddressRequester(
          await grtPoolContract.getRequester(
            ethers.utils.formatBytes32String(requestId)
          )
        );
        break;
      case "getRecipient":
        setAddressRecipient(
          await grtPoolContract.getRecipient(
            ethers.utils.formatBytes32String(requestId)
          )
        );
        break;
      case "getDepositToken":
        setDepositTokenAddrs(
          await grtPoolContract.getDepositToken(
            ethers.utils.formatBytes32String(requestId)
          )
        );
        break;
      case "getDepositAmount":
        setDepositAmount(
          await grtPoolContract.getDepositAmount(
            ethers.utils.formatBytes32String(requestId)
          )
        );
        break;
      case "getDepositChainId":
        setDepositChainId(
          await grtPoolContract.getDepositChainId(
            ethers.utils.formatBytes32String(requestId)
          )
        );
        break;
      case "getRequestToken":
        setRequestToken(
          await grtPoolContract.getRequestToken(
            ethers.utils.formatBytes32String(requestId)
          )
        );
        break;
      case "getRequestAmount":
        setRequestAmount(
          await grtPoolContract.getRequestAmount(
            ethers.utils.formatBytes32String(requestId)
          )
        );
        break;
      case "getRequestChainId":
        setRequestChainId(
          await grtPoolContract.getRequestChainId(
            ethers.utils.formatBytes32String(requestId)
          )
        );
        break;
      case "getOfferCreator":
        setOfferAddrsCreator(
          await grtPoolContract.getOfferCreator(
            ethers.utils.formatBytes32String(requestId),
            offerId
          )
        );
        break;
      case "getOfferAmount":
        setOfferAmount(
          await grtPoolContract.getOfferAmount(
            ethers.utils.formatBytes32String(requestId),
            offerId
          )
        );
        break;
      case "nbrOffersRequest":
        setNbrOffersRequest(
          await grtPoolContract.nbrOffersRequest(
            ethers.utils.formatBytes32String(requestId)
          )
        );
        break;
      case "mintGRT":
        setGrtToMint(
          await grtContract.mint(
            userAddress,
            grtToMint
          )
        );
        break;
      case "getGRTAddress":
        setGrtAddress(
          await grtPoolContract.grtAddress()
        );
        break;
      case "getGRTChainId":
        setGrtChainId(
          await grtPoolContract.grtChainId()
        );
        break;
      case "getRealityAddress":
        setRealityAddress(
          await grtPoolContract.realityAddress()
        );
        break;
      case "getOwnerPool":
        setOwnerPool(
          await grtPoolContract.owner()
        );
        break;

    }
  };

  return (
    <>
      <Title>User Settings</Title>
      <SelectSimple
        options={operationOptions}
        value={operation}
        onChange={(e: any) => {
          resetState();
          setOperations(e.target.value);
        }}
      />
      {operation === "getNonce" && (
        <>
          <TextInput
            onChange={(userAddress: string) => setUserAddress(userAddress)}
            label="User Address"
            required
            placeholder={"0x710f35C7c7CEC6B4f80D63ED506c354360eB58d1"}
          />
          <ResponseWrapper>
            <Text value={"User nonce " + nonce} variant="subtitle1" />
          </ResponseWrapper>
        </>
      )}
      {operation === "getRequester" && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
            placeholder={"0x3693c58d1bc68755bb4598d8a176e111308f2106403795117daadb3135a498b4"}
          />
          <ResponseWrapper>
            <Text
              value={"User address requester " + addressRequester}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "getRecipient" && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
            placeholder={"0x3693c58d1bc68755bb4598d8a176e111308f2106403795117daadb3135a498b4"}
          />
          <ResponseWrapper>
            <Text
              value={"User address recipient " + addressRecipient}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "getDepositToken" && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
            placeholder={"0x3693c58d1bc68755bb4598d8a176e111308f2106403795117daadb3135a498b4"}
          />
          <ResponseWrapper>
            <Text
              value={"Deposit token address " + depositTokenAddrs}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "getDepositAmount" && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
            placeholder={"0x3693c58d1bc68755bb4598d8a176e111308f2106403795117daadb3135a498b4"}
          />
          <ResponseWrapper>
            <Text
              value={"Deposit amount " + depositAmount}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "getDepositChainId" && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
            placeholder={"0x3693c58d1bc68755bb4598d8a176e111308f2106403795117daadb3135a498b4"}
          />
          <ResponseWrapper>
            <Text
              value={"Deposit chain id " + depositChainId}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "getRequestToken" && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
            placeholder={"0x3693c58d1bc68755bb4598d8a176e111308f2106403795117daadb3135a498b4"}
          />
          <ResponseWrapper>
            <Text
              value={"Request token address " + requestToken}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "getRequestAmount" && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
            placeholder={"0x3693c58d1bc68755bb4598d8a176e111308f2106403795117daadb3135a498b4"}
          />
          <ResponseWrapper>
            <Text
              value={"Request amount " + requestAmount}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "getRequestChainId" && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
            placeholder={"0x3693c58d1bc68755bb4598d8a176e111308f2106403795117daadb3135a498b4"}
          />
          <ResponseWrapper>
            <Text
              value={"Request chain id " + requestChainId}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "getOfferCreator" && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
            placeholder={"0x3693c58d1bc68755bb4598d8a176e111308f2106403795117daadb3135a498b4"}
          />
          <TextInput
            onChange={(offerId: number) => setOfferId(offerId)}
            label="Offer Id"
            required
            placeholder={"2"}
          />
          <ResponseWrapper>
            <Text
              value={"Offer address creator " + offerAddrsCreator}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "getOfferAmount" && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
            placeholder={"0x3693c58d1bc68755bb4598d8a176e111308f2106403795117daadb3135a498b4"}
          />
          <TextInput
            onChange={(offerId: number) => setOfferId(offerId)}
            label="Offer Id"
            required
            placeholder={"2"}
          />
          <ResponseWrapper>
            <Text
              value={"Offer address amount " + offerAmount}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "nbrOffersRequest" && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
            placeholder={"0x3693c58d1bc68755bb4598d8a176e111308f2106403795117daadb3135a498b4"}
          />
          <ResponseWrapper>
            <Text
              value={"Number offers request " + nbrOffersRequest}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "mintGRT" && (
        <>
          <TextInput
            onChange={(userAddress: string) => setUserAddress(userAddress)}
            label="User Address"
            required
            placeholder={"0x710f35C7c7CEC6B4f80D63ED506c354360eB58d1"}
          />
          <TextInput
            onChange={(grtToMint: number) => setGrtToMint(grtToMint)}
            label="Amount (GRT)"
            required
            placeholder={"10"}
          />
          <ResponseWrapper>
            <Text
              value={"Amount of minted GRT " + grtToMint}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "getGRTAddress" && (
        <>
          <ResponseWrapper>
            <Text
              value={"GRT address " + grtAddress}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "getGRTChainId" && (
        <>
          <ResponseWrapper>
            <Text
              value={"GRT chain ID " + grtChainId}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "getRealityAddress" && (
        <>
          <ResponseWrapper>
            <Text
              value={"Reality.eth contract address " + realityAddress}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === "getOwnerPool" && (
        <>
          <ResponseWrapper>
            <Text
              value={"Owner GRT Pool " + ownerPool}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      <ButtonWrapper>
        <Button value="Run" size="small" onClick={handleClick} />
      </ButtonWrapper>
    </>
  );
}

export default UserSettings;
