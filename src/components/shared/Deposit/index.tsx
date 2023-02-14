import {useState} from "react";
import {TextInput, Button, SelectSimple} from "grindery-ui";
import {Title, ButtonWrapper, Text} from "./style";

function Deposit() {
  const [grtAmount, setGrtAmount] = useState<string | null>("");
  const [erc20TokenAddress, setErc20TokenAddress] = useState<string | null>("");
  const [erc20Amount, setERC20Amount] = useState<string | null>("");
  const [address, setAddress] = useState<string | null>("");
  const requestTypeOptions = [
    {label: "ERC20 Token", value: "ERC20"},
    {label: "Native Token", value: "Native"},
  ];
  const [requestType, setRequestType] = useState<string>(
    requestTypeOptions[0].value
  );

  const handleClick = async () => {};

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
        onChange={(grtAmount: string) => setGrtAmount(grtAmount)}
        label="GRT Amount"
        required
      />
      {requestType === requestTypeOptions[0].value && (
        <TextInput
          onChange={(erc20TokenAddress: string) =>
            setErc20TokenAddress(erc20TokenAddress)
          }
          label="ERC20 Token Address"
          required
        />
      )}
      <TextInput
        onChange={(erc20Amount: string) => setERC20Amount(erc20Amount)}
        label="ERC20 Amount Required"
        required
      />
      <TextInput
        onChange={(address: string) => setAddress(address)}
        label="Destination Address"
        required
      />
      <ButtonWrapper>
        <Button value="Deposit" size="small" onClick={handleClick} />
      </ButtonWrapper>
    </>
  );
}

export default Deposit;
