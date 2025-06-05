import jwt_decode from "jwt-decode";

export const getUserRoleFromToken=()=>{
    const token=localStorage.getItem("token");
    if(!token) return null;

    try{
        const decoded=jwt_decode(token);
        return decoded.role || null;

    }catch{
        return null;
    }
};