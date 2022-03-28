import axios from "axios";
import Cookies from "js-cookie";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, FC, useReducer, useEffect } from "react";
import { authReducer } from ".";
import { tesloApi } from "../../api";
import { User } from "../../interfaces";

interface AuthContextProps {
  isLoggedIn: boolean;
  user?: User;

  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    name: string,
    password: string
  ) => Promise<string | void>;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export interface AuthState {
  isLoggedIn: boolean;
  user?: User;
}

const AUTH_INIT_STATE: AuthState = {
  isLoggedIn: false,
};

export const AuthProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INIT_STATE);
  const router = useRouter();

  const { data, status } = useSession()


  useEffect(() => {
    if(status === 'authenticated') {
      dispatch({ type: 'login', payload: data.user as User });
    }
  },[status, data])

  // useEffect(() => {
  //   const token = Cookies.get("token");
  //   if (token) {
  //     tesloApi
  //       .get("/user/renew")
  //       .then(({ data }) => {
  //         dispatch({ type: "login", payload: data.user });
  //         Cookies.set("token", data.token);
  //       })
  //       .catch((err) => Cookies.remove("token"));
  //   }
  // }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post("/user/login", { email, password });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({
        type: "login",
        payload: user,
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  const register = async (
    email: string,
    name: string,
    password: string
  ): Promise<string | void> => {
    try {
      const { data } = await tesloApi.post("/user/register", {
        email,
        name,
        password,
      });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "login", payload: user });
      return "";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.data.message;
      }
    }
  };

  const logout = () => {
    Cookies.remove("cart");
    Cookies.remove("firstName");
    Cookies.remove("lastName");
    Cookies.remove("phone");
    Cookies.remove("address");
    Cookies.remove("address2");
    Cookies.remove("city");
    Cookies.remove("zip");
    Cookies.remove("country");
    signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
