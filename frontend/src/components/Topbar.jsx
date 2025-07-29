import { Badge, Box,Icon,IconButton,useTheme } from "@mui/material"
import { useContext,useEffect,useState } from "react"
import { ColorModeContext,themeSettings,tokens } from "../theme"
import InputBase from "@mui/material/InputBase"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useSearch } from "../pages/dashboards/features/SearchContext"

import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import SearchIcon from "@mui/icons-material/Search";


const Topbar = () => {
    const theme=useTheme();
    const colors=tokens(theme.palette.mode);
    const colorMode= useContext(ColorModeContext);
    const navigate = useNavigate();
    const{query,setQuery}=useSearch();
    const [pendingCount,setPendingCount]=useState(0);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const role = storedUser?.role;

    useEffect(()=>{
      const token=localStorage.getItem("token");
      axios.get("http://localhost:3000/api/prof/appointments/count",{
        headers:{Authorization:`Bearer ${token}`},
      })
      .then((res)=>setPendingCount(res.data.pending||0))
      .catch((err)=>console.error("Error fetching appointment count:",err));
    },[]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      height="64px"
      width="100%"
      boxShadow={1}
    >
      {/* search bar */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
        alignItems="center"
        px={1}
      >
        <InputBase
          sx={{ ml: 2, flex: 1, color: colors.grey[100] }}
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      {/*icons */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>

        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>

        <IconButton
          onClick={() => navigate("/dashboard/features/prof-appointments")}
        >
          <Badge badgeContent={pendingCount} color="error">
            <AccountBoxOutlinedIcon />
          </Badge>
        </IconButton>
      </Box>
    </Box>
  );
  
}

export default Topbar;