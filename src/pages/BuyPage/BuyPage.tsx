import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DexCard from '../../components/grindery/DexCard/DexCard';
import DexPageContainer from '../../components/grindery/DexPageContainer/DexPageContainer';
import DexWorkInProgress from '../../components/grindery/DexWorkInProgress/DexWorkInProgress';

type Props = {};

const BuyPage = (props: Props) => {
  return (
    <div>
      <DexPageContainer>
        <DexCard>
          <DexWorkInProgress text={'Work in progress'} />
        </DexCard>
      </DexPageContainer>
    </div>
  );
};

export default BuyPage;
