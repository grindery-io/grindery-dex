import {useState} from "react";
import {TextInput, Button, Text} from "grindery-ui";
import {ButtonWrapper} from "../AcceptOffer/style";
import {Title} from "../AccountModal/style";
import {useGrinderyNexus} from "use-grindery-nexus";
import {GRTPOOL_CONTRACT_ADDRESS, GRT_CONTRACT_ADDRESS} from "../../../constants";
import GrtPool from "../Abi/GrtPool.json";
import Grt from "../Abi/Grt.json";
import {ResponseWrapper} from "./style";

function DecodeEvents() {

  type Event = {
    name: string;
    arguments: ArgumentsEvent[];
  };
  type ArgumentsEvent = {
    name: string;
    value: string;
  };

  const {provider, ethers} = useGrinderyNexus();
  const [txhash, setTxHash] = useState<string>("0xe21bbf73c0a2eb43e3597572752f995af6df27fbb44c6b878ace5a160ea1047e");
  const [events, setEvents] = useState([{}]);

  const signer = provider.getSigner();
  const _grtPoolContract = new ethers.Contract(
    GRTPOOL_CONTRACT_ADDRESS,
    GrtPool.abi,
    signer
  );
  const grtPoolContract = _grtPoolContract.connect(signer);



  const handleClick = async () => {
    const tx = await provider.getTransactionReceipt(txhash);
    let event = [] as Event[];
    tx.logs.map(async (log: any, index: number) => {
      if (
        ethers.utils.getIcapAddress(log.address) === ethers.utils.getIcapAddress(GRTPOOL_CONTRACT_ADDRESS)
      ) {
        const parseLog = await grtPoolContract.interface.parseLog(log);
        let args = [] as ArgumentsEvent[];
        parseLog.args.map((arg: any, id: number) =>
          args.push({
            name: parseLog.eventFragment.inputs[id].name,
            value: arg.toString()
          })
        );
        event.push({
          name: parseLog.name,
          arguments: args
        });
      }
      setEvents(event);
    })
  };

  const displayEvent = async () => {

    return "toto";

  };

  return (
    <>
      <Title>Decode events</Title>
        <>
          <TextInput
            value={txhash}
            onChange={(txhash: string) => setTxHash(txhash)}
            label="Transaction hash"
            required
          />
          <ResponseWrapper>
            <Text value={"Events " + displayEvent} variant="subtitle1" />
          </ResponseWrapper>
        </>
      <ButtonWrapper>
        <Button value="Run" size="small" onClick={handleClick} />
      </ButtonWrapper>
    </>
  );
}

export default DecodeEvents;
