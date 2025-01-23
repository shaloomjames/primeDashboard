import { createContext, useContext, useState } from "react";
import Cookies from 'js-cookie';     // Corrected to js-cookie

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [token,setToken]=useState(Cookies.get("UserAuthToken"))

    const storeTokenInCookies = (UserToken) => {
        setToken(UserToken)
        return Cookies.set("UserAuthToken", UserToken);
    }

    const isLogedIn = !!token

    // logout user functionality
        const LogoutUser = ()=>{
            setToken("");
            Cookies.remove("UserAuthToken")
        }

    return (
        <AuthContext.Provider value={{isLogedIn,storeTokenInCookies,LogoutUser}}>
        {children}
    </AuthContext.Provider>
    )
}

// Ya custom Hook Mera delivery boy hai
export const useAuth = () => {
    return useContext(AuthContext)
}