import {useState} from "react";
import {TextInput, Button} from "grindery-ui";
import {Title, ButtonWrapper} from "./style";

function Deposit() {
  const [grtAmount, setGrtAmount] = useState<string | null>("");
  const [erc20TokenAddress, setErc20TokenAddress] = useState<string | null>("");
  const [erc20Amount, setERC20Amount] = useState<string | null>("");
  const [address, setAddress] = useState<string | null>("");

  const handleClick = async () => {};

  return (
    <>
      <Title>Deposit</Title>
      <TextInput
        onChange={(grtAmount: string) => setGrtAmount(grtAmount)}
        label="GRT Amount"
        required
      />
      <TextInput
        onChange={(erc20TokenAddress: string) =>
          setErc20TokenAddress(erc20TokenAddress)
        }
        label="ERC20 Token Address"
        required
      />
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
