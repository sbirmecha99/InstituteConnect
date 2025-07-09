import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
} from "@mui/material";
import { ExpandLess, ExpandMore, Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useSearch } from "./dashboards/features/SearchContext";

const ManageUsers = () => {
  const [professors, setProfessors] = useState([]);
  const [students, setStudents] = useState([]);
  const [openProf, setOpenProf] = useState({});
  const [openStud, setOpenStud] = useState({});
  const [editUser, setEditUser] = useState(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null); // track user to delete
  const [deleteDelay, setDeleteDelay] = useState(5); // countdown timer

  const { query } = useSearch();
  const theme = useTheme();

  const fetchUsers = async () => {
    try {
      const [profRes, studRes] = await Promise.all([
        axios.get("http://localhost:3000/api/professors", {
          withCredentials: true,
        }),
        axios.get("http://localhost:3000/api/users", { withCredentials: true }),
      ]);
      setProfessors(profRes.data);
      const studentsOnly = studRes.data.filter((u) => u.role === "Student");
      setStudents(studentsOnly);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = (id, type) => {
    if (type === "prof") setOpenProf((prev) => ({ ...prev, [id]: !prev[id] }));
    else setOpenStud((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`, {
        withCredentials: true,
      });
      fetchUsers();
      setConfirmDeleteUser(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // Countdown timer for delete confirmation button
  useEffect(() => {
    if (confirmDeleteUser && deleteDelay > 0) {
      const timer = setTimeout(() => setDeleteDelay((d) => d - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!confirmDeleteUser) {
      setDeleteDelay(5); // reset timer on dialog close
    }
  }, [confirmDeleteUser, deleteDelay]);

  // Filter professors by query (case-insensitive name or email match)
  const filteredProfessors = professors.filter((p) =>
    query.trim() === ""
      ? true
      : [p.name, p.email].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  // Filter students by query (case-insensitive name or email match)
  const filteredStudents = students.filter((s) =>
    query.trim() === ""
      ? true
      : [s.name, s.email].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Manage Users
      </Typography>

      <Typography variant="h6" mt={3} mb={1}>
        Professors
      </Typography>
      <List disablePadding>
        {filteredProfessors.map((p) => (
          <React.Fragment key={p.id}>
            <ListItem
              button
              onClick={() => handleToggle(p.id, "prof")}
              sx={{
                backgroundColor: openProf[p.id]
                  ? theme.palette.action.hover
                  : "inherit",
              }}
            >
              <ListItemText primary={p.name} />
              {openProf[p.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openProf[p.id]} timeout="auto" unmountOnExit>
              <Box pl={4} py={1}>
                <Typography variant="body2">
                  <strong>Email:</strong> {p.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Department:</strong> {p.department || "N/A"}
                </Typography>
                <Box mt={1}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<Edit />}
                    sx={{ mr: 1 }}
                    onClick={() => setEditUser(p)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => setConfirmDeleteUser(p)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Collapse>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      <Typography variant="h6" mt={5} mb={1}>
        Students
      </Typography>
      <List disablePadding>
        {filteredStudents.map((s) => (
          <React.Fragment key={s.ID}>
            <ListItem
              button
              onClick={() => handleToggle(s.ID, "stud")}
              sx={{
                backgroundColor: openStud[s.ID]
                  ? theme.palette.action.hover
                  : "inherit",
              }}
            >
              <ListItemText primary={s.name} />
              {openStud[s.ID] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openStud[s.ID]} timeout="auto" unmountOnExit>
              <Box pl={4} py={1}>
                <Typography variant="body2">
                  <strong>Email:</strong> {s.email}
                </Typography>
                <Typography variant="body2">
                  <strong>Department:</strong> {s.department || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Semester:</strong> {s.semester || "N/A"}
                </Typography>
                <Box mt={1}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<Edit />}
                    sx={{ mr: 1 }}
                    onClick={() => setEditUser(s)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => setConfirmDeleteUser(s)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Collapse>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={Boolean(confirmDeleteUser)}
        onClose={() => setConfirmDeleteUser(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography mb={2}>
            Are you sure you want to delete user{" "}
            <strong>{confirmDeleteUser?.name}</strong>?
          </Typography>

          <Box sx={{ position: "relative", height: 8, mb: 1 }}>
            <Box
              sx={{
                position: "absolute",
                width: `${((5 - deleteDelay) / 5) * 100}%`,
                height: "100%",
                bgcolor: "error.main",
                borderRadius: 1,
                transition: "width 1s linear",
              }}
            />
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
            display="block"
          >
            {deleteDelay > 0
              ? `Please wait ${deleteDelay}s...`
              : "You can now confirm deletion."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteUser(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={deleteDelay > 0}
            onClick={() =>
              handleDelete(confirmDeleteUser.id || confirmDeleteUser.ID)
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={Boolean(editUser)}
        onClose={() => setEditUser(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editUser && (
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="Name"
                value={editUser.name}
                onChange={(e) =>
                  setEditUser((prev) => ({ ...prev, name: e.target.value }))
                }
                fullWidth
              />
              <TextField
                label="Email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser((prev) => ({ ...prev, email: e.target.value }))
                }
                fullWidth
              />
              {editUser.role === "Student" && (
                <>
                  <TextField
                    label="Department"
                    value={editUser.department || ""}
                    onChange={(e) =>
                      setEditUser((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                  <TextField
                    label="Semester"
                    type="number"
                    value={editUser.semester || ""}
                    onChange={(e) =>
                      setEditUser((prev) => ({
                        ...prev,
                        semester: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                </>
              )}
              {editUser.role === "Prof" && (
                <TextField
                  label="Department"
                  value={editUser.department || ""}
                  onChange={(e) =>
                    setEditUser((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  fullWidth
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              try {
                const payload = {
                  name: editUser.name,
                  email: editUser.email,
                };
                if (editUser.role === "Student") {
                  payload.department = editUser.department;
                  payload.semester = Number(editUser.semester);
                }
                if (editUser.role === "Prof") {
                  payload.department = editUser.department;
                }
                await axios.put(
                  `http://localhost:3000/api/users/${
                    editUser.id || editUser.ID
                  }`,
                  payload,
                  { withCredentials: true }
                );
                fetchUsers();
                setEditUser(null);
              } catch (error) {
                console.error("Failed to update user:", error);
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageUsers;
