/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useContext } from "react";

const AppContext = createContext();
axios.defaults.withCredentials = true;

export const AppContextProvider = ({ children }) => {
  const value = {};
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};
