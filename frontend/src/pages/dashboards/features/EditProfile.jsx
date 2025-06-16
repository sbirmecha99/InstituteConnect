import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

const departments = ["CSE", "ECE", "ME", "EE", "CE", "CH"];
const programs = ["B.Tech", "M.Tech", "Dual"];

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/me", { withCredentials: true })
      .then((res) => {
        const userData = res.data.user;
        setUser(userData);
        setName(userData.name || "");
        setProgram(userData.program || "");
        setDepartment(userData.department || "");
        setSemester(userData.semester || "");
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
      })
      .finally(() => setLoading(false));
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
        },
      });

      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h6">Failed to load user data</Typography>
      </Box>
    );
  }

  const { role } = user;

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

      {(role === "Student" || role === "Prof" || role === "Admin") && (
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
      )}

      {role === "Student" && (
        <>
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
        </>
      )}

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
