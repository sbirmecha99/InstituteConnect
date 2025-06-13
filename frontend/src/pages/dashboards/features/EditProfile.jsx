import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const departments = ["CSE", "ECE", "ME", "EE", "CE", "CH"];
const programs = ["B.Tech", "M.Tech", "Dual"];
const token = localStorage.getItem("token");

const EditProfile = () => {
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/me", { withCredentials: true })
      .then((res) => {
        const user = res.data.user;
        setName(user.name || "");
        setProgram(user.program || "");
        setDepartment(user.department || "");
        setSemester(user.semester || "");
      });
  }, []);

  const getSemesters = () => {
    if (program === "M.Tech") return [1, 2, 3, 4];
    if (program === "B.Tech" || program === "Dual")
      return [1, 2, 3, 4, 5, 6, 7, 8];
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("program", program);
    formData.append("department", department);
    formData.append("semester", semester);
    if (image) formData.append("image", image);

    try {
      await axios.put("http://localhost:3000/api/profile", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      //Update localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const updatedUser = {
        ...user,
        name: name || user.name,
        program,
        department,
        semester,
       //image refresh
        profile_picture: image
          ? `/uploads/${user.id}_${image.name}`
          : user.profile_picture,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4" mb={2}>
        Edit Profile
      </Typography>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        
      />
      <Select
        value={program}
        onChange={(e) => setProgram(e.target.value)}
        displayEmpty
        required
      >
        <MenuItem value="" disabled>
          Select Program
        </MenuItem>
        {programs.map((p) => (
          <MenuItem key={p} value={p}>
            {p}
          </MenuItem>
        ))}
      </Select>
      <Select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        displayEmpty
        required
      >
        <MenuItem value="" disabled>
          Select Department
        </MenuItem>
        {departments.map((dep) => (
          <MenuItem key={dep} value={dep}>
            {dep}
          </MenuItem>
        ))}
      </Select>

      <Select
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
        displayEmpty
        required
      >
        <MenuItem value="" disabled>
          Select Semester
        </MenuItem>
        {getSemesters().map((sem) => (
          <MenuItem key={sem} value={sem}>
            {sem}
          </MenuItem>
        ))}
      </Select>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <Button type="submit" variant="contained">
        Save Changes
      </Button>
    </Box>
  );
};

export default EditProfile;
