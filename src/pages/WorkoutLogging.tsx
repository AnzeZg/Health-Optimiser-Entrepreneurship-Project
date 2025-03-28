import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListItemSecondaryAction,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { format, subDays } from 'date-fns';

interface Workout {
  id: string;
  name: string;
  duration: number;
  caloriesBurned?: number;
  date: string;
  completed?: boolean;
  type: 'strength' | 'cardio' | 'flexibility';
  exercises?: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }[];
}

const WorkoutLogging: React.FC = () => {
  const { routine, workouts, addWorkout, deleteWorkout, updateWorkoutStatus } = useStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newWorkout, setNewWorkout] = useState<Partial<Workout>>({
    name: '',
    duration: 0,
    caloriesBurned: 0,
    date: new Date().toISOString().split('T')[0],
    exercises: [],
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewWorkout({
      name: '',
      duration: 0,
      caloriesBurned: 0,
      date: selectedDate,
      exercises: [],
    });
  };

  const handleAddWorkout = () => {
    if (!newWorkout.name || !newWorkout.duration) return;

    addWorkout(newWorkout as Omit<Workout, 'id'>);
    handleCloseDialog();
  };

  const handleDeleteWorkout = (id: string) => {
    deleteWorkout(id);
  };

  const totalCaloriesBurned = workouts
    .filter((workout) => workout.date === selectedDate)
    .reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0);

  const totalDuration = workouts
    .filter((workout) => workout.date === selectedDate)
    .reduce((sum, workout) => sum + workout.duration, 0);

  const routineWorkouts = routine?.workouts.filter((workout) => workout.date === selectedDate) || [];
  const customWorkouts = workouts.filter((workout) => workout.date === selectedDate);

  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'MMM dd, yyyy'),
    };
  }).reverse();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Workout Logging
      </Typography>

      <Grid container spacing={3}>
        {/* Date Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Date</InputLabel>
            <Select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              label="Select Date"
            >
              {dateOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Summary Cards */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Calories Burned
              </Typography>
              <Typography variant="h3" color="primary">
                {totalCaloriesBurned}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                kcal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Duration
              </Typography>
              <Typography variant="h3" color="primary">
                {totalDuration}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                minutes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Routine Workouts */}
        {routineWorkouts.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Today's Workout Plan
              </Typography>
              <List>
                {routineWorkouts.map((workout) => (
                  <React.Fragment key={workout.id}>
                    <ListItem>
                      <Checkbox
                        checked={workout.completed}
                        onChange={(e) => updateWorkoutStatus(workout.id, e.target.checked)}
                        sx={{ mr: 2 }}
                      />
                      <ListItemText
                        primary={workout.name}
                        secondary={`${workout.duration} minutes • ${workout.caloriesBurned} calories`}
                      />
                    </ListItem>
                    {workout.exercises && (
                      <List>
                        {workout.exercises.map((exercise, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={exercise.name}
                              secondary={`${exercise.sets} sets × ${exercise.reps} reps${
                                exercise.weight ? ` • ${exercise.weight}kg` : ''
                              }`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Custom Workouts */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Custom Workouts</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
              >
                Add Workout
              </Button>
            </Box>

            <List>
              {customWorkouts.map((workout) => (
                <ListItem key={workout.id}>
                  <ListItemText
                    primary={workout.name}
                    secondary={`${workout.duration} minutes • ${workout.caloriesBurned} calories`}
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