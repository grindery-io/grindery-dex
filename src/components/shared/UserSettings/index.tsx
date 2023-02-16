import {useState} from "react";
import {TextInput, Button, SelectSimple, Text} from "grindery-ui";
import {ButtonWrapper} from "../AcceptOffer/style";
import {Title} from "../AccountModal/style";
import {useGrinderyNexus} from "use-grindery-nexus";
import {DEPAY_CONTRACT_ADDRESS} from "../../../constants";
import GrtPool from "../Abi/GrtPool.json";
import {ResponseWrapper} from "./style";

function UserSettings() {
  const operationOptions = [
    {label: "Get nonce for a user (GRT pool)", value: "getNounce"},
    {label: "Get user address requester (GRT pool)", value: "getRequester"},
    {label: "Get user address recipient (GRT pool)", value: "getRecipient"},
    {label: "Get deposit token address (GRT pool)", value: "getDepositToken"},
    {label: "Get deposit amount (GRT pool)", value: "getDepositAmount"},
    {label: "Get deposit chain id (GRT pool)", value: "getDepositChainId"},
    {label: "Get request token (GRT pool)", value: "getRequestToken"},
    {label: "Get request amount (GRT pool)", value: "getRequestAmount"},
    {label: "Get request chain id (GRT pool)", value: "getRequestChainId"},
    {label: "Get offer address creator (GRT pool)", value: "getOfferCreator"},
    {label: "Get offer amount (GRT pool)", value: "getOfferAmount"},
    {label: "Number offer request (GRT pool)", value: "nbrOffersRequest"},
  ];
  const {provider, ethers} = useGrinderyNexus();
  const [operation, setOperations] = useState<string>(
    operationOptions[0].value
  );
  const [userAddress, setUserAddress] = useState<string>("");
  const [nounce, setNounce] = useState<number>(0);
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

  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    DEPAY_CONTRACT_ADDRESS,
    GrtPool.abi,
    signer
  );
  const contractWithSigner = contract.connect(signer);

  const handleClick = async () => {
    let response;

    if (operation === operationOptions[0].value) {
      response = await contractWithSigner.getNonce(userAddress);
      setNounce(response.toString());
    }
    if (operation === operationOptions[1].value) {
      response = await contractWithSigner.getRequester(
        ethers.utils.formatBytes32String(requestId)
      );
      setAddressRequester(response);
    }
    if (operation === operationOptions[2].value) {
      response = await contractWithSigner.getRecipient(
        ethers.utils.formatBytes32String(requestId)
      );
      setAddressRecipient(response);
    }
    if (operation === operationOptions[3].value) {
      response = await contractWithSigner.getDepositToken(
        ethers.utils.formatBytes32String(requestId)
      );
      setDepositTokenAddrs(response);
    }
    if (operation === operationOptions[4].value) {
      response = await contractWithSigner.getDepositAmount(
        ethers.utils.formatBytes32String(requestId)
      );
      setDepositAmount(response);
    }
    if (operation === operationOptions[5].value) {
      response = await contractWithSigner.getDepositChainId(
        ethers.utils.formatBytes32String(requestId)
      );
      setDepositChainId(response);
    }
    if (operation === operationOptions[6].value) {
      response = await contractWithSigner.getRequestToken(
        ethers.utils.formatBytes32String(requestId)
      );
      setRequestToken(response);
    }
    if (operation === operationOptions[7].value) {
      response = await contractWithSigner.getRequestAmount(
        ethers.utils.formatBytes32String(requestId)
      );
      setRequestAmount(response);
    }
    if (operation === operationOptions[8].value) {
      response = await contractWithSigner.getRequestChainId(
        ethers.utils.formatBytes32String(requestId)
      );
      setRequestChainId(response);
    }
    if (operation === operationOptions[9].value) {
      response = await contractWithSigner.getOfferCreator(
        ethers.utils.formatBytes32String(requestId),
        offerId
      );
      setOfferAddrsCreator(response);
    }
    if (operation === operationOptions[10].value) {
      response = await contractWithSigner.getOfferAmount(
        ethers.utils.formatBytes32String(requestId),
        offerId
      );
      setOfferAmount(response);
    }
    if (operation === operationOptions[11].value) {
      response = await contractWithSigner.nbrOffersRequest(
        ethers.utils.formatBytes32String(requestId)
      );
      setNbrOffersRequest(response);
    }
  };

  return (
    <>
      <Title>User Settings</Title>
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
            onChange={(userAddress: string) => setUserAddress(userAddress)}
            label="User Address"
            required
          />
          <ResponseWrapper>
            <Text value={"User nounce " + nounce} variant="subtitle1" />
          </ResponseWrapper>
        </>
      )}
      {operation === operationOptions[1].value && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
          />
          <ResponseWrapper>
            <Text
              value={"User address requester " + addressRequester}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === operationOptions[2].value && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
          />
          <ResponseWrapper>
            <Text
              value={"User address recipient " + addressRecipient}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === operationOptions[3].value && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
          />
          <ResponseWrapper>
            <Text
              value={"Deposit token address " + depositTokenAddrs}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === operationOptions[4].value && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
          />
          <ResponseWrapper>
            <Text
              value={"Deposit amount " + depositAmount}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === operationOptions[5].value && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
          />
          <ResponseWrapper>
            <Text
              value={"Deposit chain id " + depositChainId}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === operationOptions[6].value && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
          />
          <ResponseWrapper>
            <Text
              value={"Request token address " + requestToken}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === operationOptions[7].value && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
          />
          <ResponseWrapper>
            <Text
              value={"Request amount " + requestAmount}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === operationOptions[8].value && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
          />
          <ResponseWrapper>
            <Text
              value={"Request chain id " + requestChainId}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === operationOptions[9].value && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
          />
          <TextInput
            onChange={(offerId: number) => setOfferId(offerId)}
            label="Offer Id"
            required
          />
          <ResponseWrapper>
            <Text
              value={"Offer address creator " + offerAddrsCreator}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === operationOptions[10].value && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
          />
          <TextInput
            onChange={(offerId: number) => setOfferId(offerId)}
            label="Offer Id"
            required
          />
          <ResponseWrapper>
            <Text
              value={"Offer address amount " + offerAmount}
              variant="subtitle1"
            />
          </ResponseWrapper>
        </>
      )}
      {operation === operationOptions[11].value && (
        <>
          <TextInput
            onChange={(requestId: string) => setRequestId(requestId)}
            label="Request Id"
            required
          />
          <ResponseWrapper>
            <Text
              value={"Number offers request " + nbrOffersRequest}
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
