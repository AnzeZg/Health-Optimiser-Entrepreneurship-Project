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
  Collapse,
  CardMedia,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { useStore, Workout } from '../store/useStore';
import { format, subDays } from 'date-fns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const WorkoutLogging: React.FC = () => {
  const { routine, workouts, addWorkout, deleteWorkout, updateWorkoutStatus } = useStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [videoDialog, setVideoDialog] = useState<{ open: boolean; url: string | null }>({ open: false, url: null });
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

    // Ensure all required properties are present
    const workoutToAdd = {
      name: newWorkout.name,
      duration: newWorkout.duration,
      caloriesBurned: newWorkout.caloriesBurned ?? 0,
      date: newWorkout.date ?? selectedDate,
      completed: typeof newWorkout.completed === 'boolean' ? newWorkout.completed : false,
      type: newWorkout.type ?? 'strength',
      exercises: newWorkout.exercises ?? [],
      warmup: newWorkout.warmup ?? [],
      cooldown: newWorkout.cooldown ?? [],
      motivation: newWorkout.motivation ?? '',
    };

    addWorkout(workoutToAdd as Omit<Workout, 'id'>);
    handleCloseDialog();
  };

  const handleDeleteWorkout = (id: string) => {
    deleteWorkout(id);
  };

  const handleExpandWorkout = (workoutId: string) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  const handleVideoClick = (videoUrl: string) => {
    setVideoDialog({ open: true, url: videoUrl });
  };

  const handleCloseVideoDialog = () => {
    setVideoDialog({ open: false, url: null });
  };

  const renderWorkoutDetails = (workout: Workout) => (
    <Collapse in={expandedWorkout === workout.id}>
      <Box sx={{ pl: 4, pr: 2, py: 2 }}>
        {workout.warmup && workout.warmup.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Warm-up Exercises
            </Typography>
            <List dense>
              {workout.warmup.map((exercise, index) => (
                <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <ListItemText
                    primary={exercise.name}
                    secondary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PlayCircleOutlineIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">Watch demonstration</Typography>
                    </Box>}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {workout.exercises && workout.exercises.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Main Exercises
            </Typography>
            <List dense>
              {workout.exercises.map((exercise, index) => (
                <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <ListItemText
                    primary={exercise.name}
                    secondary={`${exercise.sets} sets × ${exercise.reps} reps${exercise.weight ? ` • ${exercise.weight}kg` : ''}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {workout.cooldown && workout.cooldown.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Cool-down Exercises
            </Typography>
            <List dense>
              {workout.cooldown.map((exercise, index) => (
                <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <ListItemText
                    primary={exercise.name}
                    secondary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PlayCircleOutlineIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">Watch demonstration</Typography>
                    </Box>}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {workout.motivation && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              💪 {workout.motivation}
            </Typography>
          </Box>
        )}
      </Box>
    </Collapse>
  );

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
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
      py: 4,
      px: { xs: 1, sm: 3 },
    }}>
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, mb: 4, background: 'rgba(255,255,255,0.95)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <FitnessCenterIcon color="primary" fontSize="large" />
          <Typography variant="h4" fontWeight={700}>Workout Logging</Typography>
        </Box>
        {/* Calendar at the top */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4 }}>
          <Paper sx={{
            p: 2,
            borderRadius: 4,
            boxShadow: 4,
            bgcolor: '#e3f2fd',
            border: '1.5px solid #90caf9',
            width: { xs: '100%', sm: 400 },
            maxWidth: 440,
            overflow: 'hidden',
            position: 'relative',
          }}>
            <DateCalendar
              value={new Date(selectedDate)}
              onChange={(date) => date && setSelectedDate(date.toISOString().split('T')[0])}
              sx={{ bgcolor: 'transparent', borderRadius: 2 }}
            />
          </Paper>
        </Box>
        {/* Main content below calendar */}
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, bgcolor: '#fffde7' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsRunIcon color="primary" />
                  <Typography variant="h6" fontWeight={600} gutterBottom>Total Calories Burned</Typography>
                </Box>
                <Typography variant="h3" color="primary">{totalCaloriesBurned}</Typography>
                <Typography variant="subtitle1" color="text.secondary">kcal</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon color="primary" />
                  <Typography variant="h6" fontWeight={600} gutterBottom>Total Duration</Typography>
                </Box>
                <Typography variant="h3" color="primary">{totalDuration}</Typography>
                <Typography variant="subtitle1" color="text.secondary">minutes</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Routine Workouts */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 2, background: 'rgba(227,242,253,0.5)' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FitnessCenterIcon color="secondary" /> Today's Workout Plan
              </Typography>
              {routineWorkouts.length > 0 ? (
                <List>
                  {routineWorkouts.map((workout) => (
                    <React.Fragment key={workout.id}>
                      <ListItem 
                        sx={{ 
                          borderRadius: 2, 
                          mb: 1, 
                          bgcolor: '#f3e5f5',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: '#e1bee7',
                          },
                        }}
                        onClick={() => handleExpandWorkout(workout.id)}
                      >
                        <Checkbox
                          checked={workout.completed}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateWorkoutStatus(workout.id, e.target.checked);
                          }}
                          sx={{ mr: 2 }}
                        />
                        <ListItemText
                          primary={<Typography fontWeight={600}>{workout.name}</Typography>}
                          secondary={`${workout.duration} minutes • ${workout.caloriesBurned} calories`}
                        />
                        <IconButton size="small">
                          {expandedWorkout === workout.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </ListItem>
                      {renderWorkoutDetails(workout)}
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" align="center">
                  No workouts planned for this day. Set up your routine in the Calendar page to see your workout plan.
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Custom Workouts */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 2, background: 'rgba(252,228,236,0.5)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsRunIcon color="primary" /> Custom Workouts
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                  sx={{ borderRadius: 3, px: 3, fontWeight: 600, boxShadow: 2, background: 'linear-gradient(90deg, #42a5f5 0%, #ab47bc 100%)' }}
                >
                  Add Workout
                </Button>
              </Box>
              <List>
                {customWorkouts.map((workout) => (
                  <ListItem key={workout.id} sx={{ borderRadius: 2, mb: 1, bgcolor: '#fffde7' }}>
                    <ListItemText
                      primary={<Typography fontWeight={600}>{workout.name}</Typography>}
                      secondary={`${workout.duration} minutes • ${workout.caloriesBurned} calories`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteWorkout(workout.id)}
                        sx={{ color: 'error.main' }}
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

        {/* Video Dialog */}
        <Dialog
          open={videoDialog.open}
          onClose={handleCloseVideoDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogContent sx={{ p: 0, position: 'relative', paddingTop: '56.25%' }}>
            {videoDialog.url && (
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                src={`https://www.youtube.com/embed/${videoDialog.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]}`}
                title="Exercise demonstration"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </DialogContent>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default WorkoutLogging; 