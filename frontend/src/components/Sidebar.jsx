import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "react-router-dom";
import { tokens } from "../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutline";
import defaultPfp from "../assets/guestuser.jpeg";

const storedUser = JSON.parse(localStorage.getItem("user"));
const role = storedUser?.role;

const logout = async () => {
  try {
    await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include", // important to send the cookie!
    });
  } catch (err) {
    console.error("Logout failed", err);
  }

  localStorage.clear(); // clear user state
  window.location.href = "/";
};


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
        <Typography>{title}</Typography>
      </Link>
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const [_, forceUpdate] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      if (
        updatedUser?.name !== storedUser?.name ||
        updatedUser?.profile_picture !== storedUser?.profile_picture
      ) {
        window.location.reload(); // Reload to re-render sidebar with new name/image
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!storedUser) {
    return <Typography sx={{ m: 2 }}>Not Logged In</Typography>;
  }

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon": {
          marginRight: "10px !important",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  Profile
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={
                    storedUser?.profile_picture
                      ? `http://localhost:3000${storedUser.profile_picture}`
                      : defaultPfp
                  }
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {storedUser?.name || "Guest"}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {role === "Student" && (
              <>
                <Item
                  title="Dashboard"
                  to="/student/dashboard"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="My Profile"
                  to="/dashboard/features/my-profile"
                  icon={<PersonOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Appointments"
                  to="/dashboard/features/book-appointments"
                  icon={<AccountBoxOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Notifications"
                  to="/notifications"
                  icon={<NotificationsOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Edit Profile"
                  to="/dashboard/features/edit-profile"
                  icon={<EditOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            {role === "Prof" && (
              <>
                <Item
                  title="Dashboard"
                  to="/prof/dashboard"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="My Profile"
                  to="/dashboard/features/my-profile"
                  icon={<PersonOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Assigned Rooms"
                  to="/rooms"
                  icon={<RoomOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Appointments"
                  to="/appointments"
                  icon={<AccountBoxOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Post Notification"
                  to="/notifications/post"
                  icon={<NotificationsOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Edit Profile"
                  to="/dashboard/features/edit-profile"
                  icon={<EditOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            {role === "Admin" && (
              <>
                <Item
                  title="Dashboard"
                  to="/admin/dashboard"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="My Profile"
                  to="/dashboard/features/my-profile"
                  icon={<PersonOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Assign Room"
                  to="/rooms/assign"
                  icon={<MeetingRoomOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Appointments"
                  to="/appointments"
                  icon={<AccountBoxOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Edit Profile"
                  to="features/edit-profile"
                  icon={<EditOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}

            {role === "SuperAdmin" && (
              <>
                <Item
                  title="Dashboard"
                  to="/superadmin/dashboard"
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="My Profile"
                  to="/dashboard/features/my-profile"
                  icon={<PersonOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Manage Users"
                  to="/users/manage"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Edit Profile"
                  to="/dashboard/features/edit-profile"
                  icon={<EditOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
            )}
            <MenuItem icon={<LogoutOutlinedIcon />} onClick={logout}>
              <Typography>Logout</Typography>
            </MenuItem>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
