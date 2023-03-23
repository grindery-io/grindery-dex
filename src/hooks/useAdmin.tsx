import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';

const useAdmin = () => useContext(AdminContext);

export default useAdmin;
