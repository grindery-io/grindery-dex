import { useContext } from 'react';
import { AutomationsPageContext } from '../context/AutomationsPageContext';

const useAutomationsPage = () => useContext(AutomationsPageContext);

export default useAutomationsPage;
