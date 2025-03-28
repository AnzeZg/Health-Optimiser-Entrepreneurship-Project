import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import Questionnaire from '../components/Questionnaire';

const Calendar: React.FC = () => {
  const { routine, setRoutine } = useStore();
  const [showSetup, setShowSetup] = useState(!routine);
  const [openQuestionnaire, setOpenQuestionnaire] = useState(false);

  const handleSetupClick = () => {
    setShowSetup(false);
    setOpenQuestionnaire(true);
  };

  const handleResetRoutine = () => {
    setRoutine(null);
    setShowSetup(true);
  };

  const renderRoutine = () => {
    if (!routine) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Your Custom Routine
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {format(new Date(routine.startDate), 'MMMM d, yyyy')} -{' '}
            {format(new Date(routine.endDate), 'MMMM d, yyyy')}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sleep Schedule
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Bedtime"
                    secondary={routine.sleepSchedule.bedtime}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Wake Time"
                    secondary={routine.sleepSchedule.wakeTime}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Duration"
                    secondary={`${routine.sleepSchedule.duration} hours`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Planned Workouts
              </Typography>
              <List>
                {routine.workouts.map((workout) => (
                  <React.Fragment key={workout.id}>
                    <ListItem>
                      <ListItemText
                        primary={workout.name}
                        secondary={`${format(new Date(workout.date), 'MMM dd, yyyy')} • ${workout.duration} minutes • ${workout.caloriesBurned} calories`}
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Planned Meals
              </Typography>
              <List>
                {routine.meals.map((meal) => (
                  <React.Fragment key={meal.id}>
                    <ListItem>
                      <ListItemText
                        primary={meal.name}
                        secondary={`${format(new Date(meal.date), 'MMM dd, yyyy')} • ${meal.calories} calories • Protein: ${meal.protein}g • Carbs: ${meal.carbs}g • Fat: ${meal.fat}g`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
      {showSetup ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleSetupClick}
            sx={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
          >
            Set Up Your Routine
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Your Custom Routine
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={handleResetRoutine}
            >
              Reset Routine
            </Button>
          </Box>
          {renderRoutine()}
        </>
      )}

      <Dialog
        open={openQuestionnaire}
        onClose={() => setOpenQuestionnaire(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Your Custom Routine</DialogTitle>
        <DialogContent>
          <Questionnaire />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Calendar; 