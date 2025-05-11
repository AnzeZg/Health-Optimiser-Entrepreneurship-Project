import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useStore } from '../store/useStore';
import { format, addDays } from 'date-fns';
import { WorkoutQuestionnaire } from '../components/WorkoutQuestionnaire';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const Calendar: React.FC = (): JSX.Element => {
  const { routine, setRoutine } = useStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [openQuestionnaire, setOpenQuestionnaire] = useState(false);

  const handleDateChange = (e: SelectChangeEvent<string>) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleOpenQuestionnaire = () => {
    setOpenQuestionnaire(true);
  };

  const handleCloseQuestionnaire = () => {
    setOpenQuestionnaire(false);
  };

  const handleResetRoutine = () => {
    setRoutine(null);
  };

  const getActivitiesForDate = (date: Date) => {
    if (!routine) return null;

    const dateStr = format(date, 'yyyy-MM-dd');
    const meals = routine.meals.filter(meal => meal.date === dateStr);
    const workouts = routine.workouts.filter(workout => workout.date === dateStr);
    const sleepSchedule = routine.sleepSchedule;

    return {
      meals,
      workouts,
      sleepSchedule,
    };
  };

  const activities = getActivitiesForDate(selectedDate);

  // Generate date options for the next 30 days
  const dateOptions = Array.from({ length: 30 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEEE, MMMM d, yyyy'),
    };
  });

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
      py: 4,
      px: { xs: 1, sm: 3 },
    }}>
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, mb: 4, background: 'rgba(255,255,255,0.95)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon color="primary" fontSize="large" /> Calendar
          </Typography>
          {routine ? (
            <Button
              variant="outlined"
              color="error"
              onClick={handleResetRoutine}
              sx={{ borderRadius: 3, px: 4, fontWeight: 600, boxShadow: 2 }}
            >
              Reset Routine
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleOpenQuestionnaire}
              sx={{ borderRadius: 3, px: 4, fontWeight: 600, boxShadow: 2, background: 'linear-gradient(90deg, #42a5f5 0%, #ab47bc 100%)' }}
            >
              Generate Routine
            </Button>
          )}
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{
              p: 2,
              borderRadius: 4,
              boxShadow: 4,
              bgcolor: '#e3f2fd',
              border: '1.5px solid #90caf9',
              minWidth: 0,
              width: { xs: '100%', sm: 400 },
              maxWidth: 440,
              overflow: 'hidden',
              position: 'relative',
            }}>
              <DateCalendar
                value={selectedDate}
                onChange={(date) => date && setSelectedDate(date)}
                disablePast={false}
                sx={{ bgcolor: 'transparent', borderRadius: 2 }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, borderRadius: 4, boxShadow: 2, height: '100%' }}>
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon color="secondary" /> {format(selectedDate, 'MMMM d, yyyy')}
              </Typography>
              {activities ? (
                <>
                  {/* Sleep Schedule */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BedtimeIcon color="primary" /> Sleep Schedule
                    </Typography>
                    <Typography variant="body2">
                      Bedtime: {activities.sleepSchedule.bedtime}
                    </Typography>
                    <Typography variant="body2">
                      Wake Time: {activities.sleepSchedule.wakeTime}
                    </Typography>
                    <Typography variant="body2">
                      Target Duration: {activities.sleepSchedule.duration} hours
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  {/* Meals */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <RestaurantIcon color="primary" /> Meals
                    </Typography>
                    {activities.meals.length > 0 ? (
                      <List dense>
                        {activities.meals.map((meal) => (
                          <ListItem key={meal.id} sx={{ borderRadius: 2, mb: 1, bgcolor: '#f3e5f5' }}>
                            <ListItemText
                              primary={<Typography fontWeight={600}>{meal.name}</Typography>}
                              secondary={`${meal.calories} calories • ${meal.protein}g protein • ${meal.carbs}g carbs • ${meal.fat}g fat`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No meals planned for this day.
                      </Typography>
                    )}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  {/* Workouts */}
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FitnessCenterIcon color="primary" /> Workouts
                    </Typography>
                    {activities.workouts.length > 0 ? (
                      <List dense>
                        {activities.workouts.map((workout) => (
                          <ListItem key={workout.id} sx={{ borderRadius: 2, mb: 1, bgcolor: '#e3f2fd' }}>
                            <ListItemText
                              primary={<Typography fontWeight={600}>{workout.name}</Typography>}
                              secondary={
                                <>
                                  <Typography component="span" variant="body2">
                                    Duration: {workout.duration} minutes
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="body2">
                                    Calories Burned: {workout.caloriesBurned}
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="body2">
                                    Type: {workout.type}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No workouts planned for this day.
                      </Typography>
                    )}
                  </Box>
                </>
              ) : (
                <Typography color="text.secondary">
                  No routine available. Generate a routine to see your schedule.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      <Dialog
        open={openQuestionnaire}
        onClose={handleCloseQuestionnaire}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Generate Your Routine</DialogTitle>
        <DialogContent>
          <WorkoutQuestionnaire onRoutineGenerated={handleCloseQuestionnaire} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQuestionnaire}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar; 