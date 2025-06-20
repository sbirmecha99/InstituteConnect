import * as React from "react";
import {
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { TransitionGroup } from "react-transition-group";

const TodoList = () => {
  const [tasks, setTasks] = React.useState([]);
  const [newTask, setNewTask] = React.useState("");

  const handleAddTask = () => {
    const trimmed = newTask.trim();
    if (trimmed && !tasks.includes(trimmed)) {
      setTasks((prev) => [trimmed, ...prev]);
      setNewTask("");
    }
  };

  const handleRemoveTask = (task) => {
    setTasks((prev) => prev.filter((t) => t !== task));
  };

  return (
    <div>
      <Stack spacing={2} direction="row" alignItems="center" mb={2}>
        <TextField
          fullWidth
          size="medium"
          label="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "text.primary",
              backgroundColor: "background.paperwhite",
              "& fieldset": {
                borderColor: "rgb(137, 169, 196)",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#90caf9",
              },
            },
            "& label": {
              color: "text.secondary",
            },
            "& label.Mui-focused": {
              color: "#90caf9",
            },
          }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={handleAddTask}
          disabled={!newTask.trim()}
        >
          <strong>Add</strong>
        </Button>
      </Stack>

      <List sx={{ mt: 2 }}>
        <TransitionGroup>
          {tasks.map((task) => (
            <Collapse key={task}>
              <ListItem
                secondaryAction={
                  <IconButton
                    size="3"
                    edge="end"
                    onClick={() => handleRemoveTask(task)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "1rem", // or "16px"
                    fontWeight: 500, // slightly bold
                    fontFamily: "Poppins, sans-serif", // change font
                    letterSpacing: "0.5px",
                  }}
                  primary={task}
                />
              </ListItem>
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
    </div>
  );
};

export default TodoList;
