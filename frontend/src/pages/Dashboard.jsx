import { useEffect } from "react"
import { useNavigate,useLocation } from "react-router-dom"

function Dashboard(){
    const navigate=useNavigate();
    const location= useLocation();

    useEffect(()=>{
        const params=new URLSearchParams(location.search);
        const token = params.get("token");
        if(token){
            localStorage.setItem("token",token);
            navigate("/dashboard",{replace:true});
        }
    },[location,navigate]);
    return(
        <div>
            welcome to dashboard
        </div>
    )
}

export default Dashboard