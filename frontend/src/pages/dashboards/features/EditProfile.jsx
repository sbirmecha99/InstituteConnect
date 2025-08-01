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
  Snackbar,
  Alert,
} from "@mui/material";
import { Upload, CheckCircle2 } from "lucide-react";
import BASE_URL from "../../../api/config";

const departments = ["CSE", "ECE", "ME", "EE", "CE", "CH", "MC", "BT", "MME"];
const programs = ["B.Tech", "M.Tech", "Dual"];

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [image, setImage] = useState(null);
  const [media, setMedia] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/me`, { withCredentials: true })
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
    if (media.length > 0) formData.append("image", media[0]);

    try {
      await axios.put(`${BASE_URL}/api/profile`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const res = await axios.get(`${BASE_URL}/api/me`, {
        withCredentials: true,
      });
      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSnackbarMessage("Profile updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to update profile");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setImage(e.target.files[0]);
    if (selectedFile) {
      setMedia([selectedFile]); // updates preview
      setImage(selectedFile); // updates the file actually sent to backend
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
        required
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
      {/* Media Upload UI */}
      <Box>
        <Typography fontWeight="bold" mb={1}>
          Upload Profile Picture (Optional)
        </Typography>

        <label
          htmlFor="media"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #ccc",
            borderRadius: "12px",
            padding: "24px",
            cursor: "pointer",
            transition: "border-color 0.3s, background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#00897B")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")}
        >
          <Upload color="#999" size={32} />
          <Typography variant="body2" color="textSecondary">
            <strong style={{ color: "#00897B" }}>Click to upload</strong> or
            drag and drop
          </Typography>
          <Typography variant="caption" color="textSecondary">
            PNG, JPG up to 10MB
          </Typography>
          <input
            id="media"
            type="file"
            accept="image/*"
            onChange={(e) => {
              // ✅ Only store the first file for single profile picture
              if (e.target.files?.[0]) setMedia([e.target.files[0]]);
            }}
            style={{ display: "none" }}
          />
        </label>

        {media.length > 0 && (
          <Box mt={2}>
            {media.map((file, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                border="1px solid #c8e6c9"
                borderRadius="8px"
                bgcolor="#e8f5e9"
                p={1}
                mb={1}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircle2 size={16} color="#43a047" />
                  <Typography variant="body2" color="green">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                </Box>
                <Button onClick={() => setMedia([])} size="small" color="error">
                  Remove
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Button type="submit" variant="contained" color="secondary">
        Save Changes
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProfile;
