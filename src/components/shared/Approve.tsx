import {TextInput, Button} from "grindery-ui";
import {useEffect, useState} from "react";
import styled from "styled-components";
import {SCREEN} from "../../constants";
import Web3Modal from "web3modal";
import {providers, ethers} from "ethers";
import {useGrinderyNexus} from "use-grindery-nexus";
import {CircularProgress, Alert} from "grindery-ui";

const ButtonWrapper = styled.div`
  margin: 32px 0 0;
  text-align: right;
`;

const Title = styled.p`
  font-weight: 700;
  font-size: 25px;
  line-height: 120%;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
  padding: 0 50px;
  margin: 0 0 15px;
  @media (min-width: ${SCREEN.TABLET}) {
    padding: 0;
    max-width: 576px;
    margin: 0 auto 15px;
  }
`;

function Approve() {
  const {address, provider, ethers} = useGrinderyNexus();

  const [spenderAddress, setSpenderAddress] = useState<string | null>("");
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const ERC20_ABI = [
    "function approve(address spender, uint256 amount) public virtual override returns (bool)",
  ];

  const handleClick = async () => {
    const contractAddress = "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844";
    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
    const signer = provider.getSigner();

    const daiWithSigner = contract.connect(signer);

    const tx = await daiWithSigner.approve(spenderAddress, amount);
    setLoading(true);
    await tx.wait();
    setLoading(false);
  };

  return (
    <>
      <Title>Approve</Title>
      <TextInput
        value={address}
        onChange={(address: string) => setSpenderAddress(address)}
        label="Spender Address"
        required
      />
      <TextInput
        value={amount}
        onChange={(amount: number) => setAmount(amount)}
        label="Amount"
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
          <Button value="Approve" size="small" onClick={handleClick} />
        </ButtonWrapper>
      )}
    </>
  );
}

export default Approve;
