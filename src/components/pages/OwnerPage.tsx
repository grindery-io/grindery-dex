import styled from "styled-components";
import ConfigEdit from "../shared/ConfigEdit";

const RootWrapper = styled.div`
  margin 30px;
`;

function OwnerPage() {
  return (
    <RootWrapper>
      <ConfigEdit />
    </RootWrapper>
  );
}

export default OwnerPage;
