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
import { format, addDays, subDays } from 'date-fns';
import Questionnaire from '../components/Questionnaire';

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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Calendar</Typography>
        {routine ? (
          <Button
            variant="outlined"
            color="error"
            onClick={handleResetRoutine}
          >
            Reset Routine
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleOpenQuestionnaire}
          >
            Generate Routine
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Select Date</InputLabel>
              <Select
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={handleDateChange}
                label="Select Date"
              >
                {dateOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {format(selectedDate, 'MMMM d, yyyy')}
            </Typography>

            {activities ? (
              <>
                {/* Sleep Schedule */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Sleep Schedule
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
                  <Typography variant="subtitle1" gutterBottom>
                    Meals
                  </Typography>
                  {activities.meals.length > 0 ? (
                    <List dense>
                      {activities.meals.map((meal) => (
                        <ListItem key={meal.id}>
                          <ListItemText
                            primary={meal.name}
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
                  <Typography variant="subtitle1" gutterBottom>
                    Workouts
                  </Typography>
                  {activities.workouts.length > 0 ? (
                    <List dense>
                      {activities.workouts.map((workout) => (
                        <ListItem key={workout.id}>
                          <ListItemText
                            primary={workout.name}
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

      <Dialog
        open={openQuestionnaire}
        onClose={handleCloseQuestionnaire}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Generate Your Routine</DialogTitle>
        <DialogContent>
          <Questionnaire />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQuestionnaire}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar; 