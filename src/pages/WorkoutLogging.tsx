import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Card,
  CardContent,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Workout {
  id: string;
  name: string;
  duration: number;
  caloriesBurned?: number;
  date: string;
}

const WorkoutLogging: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newWorkout, setNewWorkout] = useState<Partial<Workout>>({
    name: '',
    duration: 0,
    caloriesBurned: 0,
    date: new Date().toISOString().split('T')[0],
  });
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewWorkout({
      name: '',
      duration: 0,
      caloriesBurned: 0,
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleAddWorkout = () => {
    if (!newWorkout.name || !newWorkout.duration) return;

    const workoutWithId = {
      ...newWorkout,
      id: Date.now().toString(),
    } as Workout;

    setWorkouts([workoutWithId, ...workouts]);
    handleCloseDialog();
  };

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkouts(workouts.filter((workout) => workout.id !== workoutId));
  };

  const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCaloriesBurned = workouts.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Workout Logging
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Exercise Time Today
              </Typography>
              <Typography variant="h3" color="primary">
                {totalDuration} min
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Calories Burned Today
              </Typography>
              <Typography variant="h3" color="primary">
                {totalCaloriesBurned} kcal
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Workout List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Workout History</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
              >
                Add Workout
              </Button>
            </Box>

            <List>
              {workouts.map((workout) => (
                <ListItem key={workout.id}>
                  <ListItemText
                    primary={workout.name}
                    secondary={`${workout.duration} minutes • ${workout.caloriesBurned} calories burned • ${workout.date}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteWorkout(workout.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Workout</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Workout Name"
              value={newWorkout.name}
              onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Duration (minutes)"
              type="number"
              value={newWorkout.duration}
              onChange={(e) => setNewWorkout({ ...newWorkout, duration: Number(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Calories Burned"
              type="number"
              value={newWorkout.caloriesBurned}
              onChange={(e) => setNewWorkout({ ...newWorkout, caloriesBurned: Number(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={newWorkout.date}
              onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddWorkout} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkoutLogging; 