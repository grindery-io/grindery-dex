import styled from 'styled-components';

export const UserContainer = styled.div`
  position: relative;
`;

export const UserWrapper = styled.div`
  border: 1px solid #dcdcdc;
  border-radius: 34px;
  padding: 7px 12px 7px 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 8px;
  cursor: pointer;

  transition: border-color 0.2s ease-in-out;

  &:hover,
  &.opened {
    border-color: #0b0d17 !important;
  }

  &.dark:hover,
  &.dark.opened {
    border-color: #ffffff !important;
  }
`;

export const UserStatus = styled.div`
  background: #f4f5f7;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  box-sizing: border-box;
  padding: 2px;
`;

export const UserId = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  margin: 0;
  padding: 0;

  &.dark {
    color: #ffffff;
  }
`;

export const UserDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  padding-top: 4px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-in-out;
  transform: translateY(-10px);
  z-index: 99;

  &.opened {
    opacity: 1;
    visibility: visible;
    transform: translateY(0px);
  }
`;

export const UserDropdownContent = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  box-shadow: 2px 2px 24px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 10px;

  & button {
    font-family: Roboto;
    background: transparent;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    border-radius: 5px;
    border: none;
    gap: 10px;
    cursor: pointer;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;

    img {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background: #fdfbff;
    }

    & span {
      font-weight: 400;
      font-size: 14px;
      line-height: 160%;
      color: #141416;
      white-space: nowrap;
    }
  }
`;
