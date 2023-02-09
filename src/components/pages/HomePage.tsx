import React from "react";
import styled from "styled-components";
import AppHeader from "../shared/AppHeader";

const Container = styled.div`
  padding: 120px 20px 60px;
`;

const HomePage = () => {
  return (
    <Container>
      <AppHeader />
    </Container>
  );
};

export default HomePage;
