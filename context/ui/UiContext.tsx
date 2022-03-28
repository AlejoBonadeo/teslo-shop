import { createContext, FC, useReducer } from "react";
import { uiReducer } from ".";

interface UiContextProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const UiContext = createContext({} as UiContextProps);

export interface UiState {
  isMenuOpen: boolean;
}

const UI_INIT_STATE: UiState = {
  isMenuOpen: false,
};

export const UiProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INIT_STATE);

  const toggleMenu = () => {
    dispatch({ type: "toggleMenu" });
  };

  return (
    <UiContext.Provider
      value={{
        ...state,
        toggleMenu,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};
