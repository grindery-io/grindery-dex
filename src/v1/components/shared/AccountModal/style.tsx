import styled from "styled-components";

export const Container = styled.div`
  padding: 40px;
  position: relative;
  background: #ffffff;

  & button {
    transition: box-shadow 0.1s ease-in-out;

    &:hover {
      box-shadow: 0px 4px 8px rgba(106, 71, 147, 0.1);
    }

    &:disabled {
      background: #706e6e;
      border: 1px solid #706e6e;
      opacity: 0.4;
      cursor: not-allowed;
      color: #ffffff;
    }
  }
`;

export const CloseButton = styled.button`
  display: block;
  top: 40px;
  right: 40px;
  position: absolute;
  background: none;
  box-shadow: none;
  width: auto;
  padding: 0;
  margin: 0;
  border: none;
  cursor: pointer;

  &:hover {
    box-shadow: none !important;
  }

  & img {
    display: block;
  }
`;

export const Title = styled.h2`
  font-weight: 700;
  font-size: 24px;
  line-height: 120%;
  color: #363636;
  margin: 0 0 24px;
  padding: 0;
`;

export const Text = styled.div`
  & p,
  & li {
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    color: #363636;
  }

  & p {
    margin: 0 0 24px;
    padding: 0;
  }

  & ul {
    margin: 0 0 24px;
    padding: 0 0 0 20px;

    & li {
      margin: 0;
      padding: 0 0 0 0;
      list-style-type: disc;
    }
  }
`;

export const BackButton = styled.button`
  background: #ffffff;
  border: 1px solid #0b0d17;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: nowrap;
  cursor: pointer;
  width: auto;
  margin: 0 0 32px;
  padding: 8px 16px;

  & span {
    font-weight: 700;
    font-size: 14px;
    line-height: 150%;
    color: #0b0d17;
  }
`;

export const CancelButton = styled.button`
  background: #ffffff;
  border: 1px solid #0b0d17;
  border-radius: 5px;
  padding: 12px 24px;
  margin: 0;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
`;

export const SaveButton = styled.button`
  background: #0b0d17;
  border-radius: 5px;
  padding: 12px;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  border: none;
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #ffffff;

  &:disabled {
    background: #706e6e;
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const ConfirmDeleteButton = styled.button`
  background: #ea5230;
  border-radius: 5px;
  border: 1px solid #ea5230;
  padding: 12px 24px;
  margin: 0;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #ffffff;

  &:disabled {
    background: #706e6e;
    border: 1px solid #706e6e;
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const InputWrapper = styled.label`
  display: block;
  margin: 0 0 24px;
  & span {
    display: block;
    font-weight: 700;
    font-size: 16px;
    line-height: 150%;
    color: #0b0d17;
    padding: 0;
    margin: 0 0 4px;
  }
`;

export const Input = styled.input`
  background: #f4f5f7;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: #000000;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border: 1px solid #dcdcdc;
    outline: none;
  }
`;

export const DeleteAccountButton = styled.button`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  padding: 16px;
  margin: 0 0 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  gap: 10px;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;

  & div {
    text-align: left;
  }

  & strong {
    display: block;
    font-weight: 700;
    font-size: 16px;
    line-height: 150%;
    color: #0b0d17;
    margin: 0;
    padding: 0;
  }

  & span {
    font-weight: 400;
    font-size: 12px;
    line-height: 160%;
    color: #758796;
    margin: 0;
    padding: 0;
  }
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: nowrap;
`;

export const ErrorMessage = styled.p`
  margin: 24px 0 0;
  text-align: center;
  padding: 0;
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  color: #ff5858;
`;
