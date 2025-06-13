/*import { Children, createContext,useEffect,useState } from "react"
import { jwtDecode } from "jwt-decode"
import { json, useFetcher } from "react-router-dom";

export const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const[token,setToken]=useState(()=>localStorage.getItem("token"));
    const [user,setUser]=useState(()=>{
        const storedUser=localStorage.getItem("user");
        return storedUser?JSON.parse(storedUser):null;
    });

    useEffect(()=>{
        if (token){
            localStorage.setItem("token",token);
        }else{
            localStorage.removeItem("token");
        }
        if(user){
            localStorage.setItem("user",JSON.stringify(user));
                    }else{
                        localStorage.removeItem("user")
                    }
    },[token,user]);

    const login=(token,user)=>{
        setToken(token);
        setUser(user);
    };
    const logout=()=>{
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");

    };
    const role=user?.role||(token?jwtDecode(token).role:null);
    return(
        <AuthContext.Provider value={{user,token,login,logout,role}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext*/