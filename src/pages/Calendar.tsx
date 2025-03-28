import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  FormGroup,
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
import { generateRoutine } from '../services/routineService';
import { format } from 'date-fns';

interface QuestionnaireData {
  fitnessGoals: string[];
  workoutPreferences: string[];
  dietaryRestrictions: string[];
  sleepSchedule: {
    preferredBedtime: string;
    preferredWakeTime: string;
    totalSleepHours: number;
  };
  nutritionGoals: {
    dailyCalories: number;
    proteinPercentage: number;
    carbsPercentage: number;
    fatPercentage: number;
  };
}

const Calendar: React.FC = () => {
  const { routine, setRoutine } = useStore();
  const [showSetup, setShowSetup] = useState(!routine);
  const [openQuestionnaire, setOpenQuestionnaire] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({
    fitnessGoals: [],
    workoutPreferences: [],
    dietaryRestrictions: [],
    sleepSchedule: {
      preferredBedtime: '',
      preferredWakeTime: '',
      totalSleepHours: 8,
    },
    nutritionGoals: {
      dailyCalories: 2000,
      proteinPercentage: 30,
      carbsPercentage: 40,
      fatPercentage: 30,
    },
  });

  const steps = [
    'Fitness Goals',
    'Workout Preferences',
    'Dietary Restrictions',
    'Sleep Schedule',
    'Nutrition Goals',
  ];

  const handleSetupClick = () => {
    setShowSetup(false);
    setOpenQuestionnaire(true);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const generatedRoutine = await generateRoutine(questionnaireData);
      setRoutine(generatedRoutine);
      setOpenQuestionnaire(false);
    } catch (error) {
      console.error('Error generating routine:', error);
      // TODO: Show error message to user
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={questionnaireData.fitnessGoals.includes('weightLoss')}
                  onChange={(e) => {
                    const goals = e.target.checked
                      ? [...questionnaireData.fitnessGoals, 'weightLoss']
                      : questionnaireData.fitnessGoals.filter((g) => g !== 'weightLoss');
                    setQuestionnaireData({ ...questionnaireData, fitnessGoals: goals });
                  }}
                />
              }
              label="Weight Loss"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={questionnaireData.fitnessGoals.includes('muscleGain')}
                  onChange={(e) => {
                    const goals = e.target.checked
                      ? [...questionnaireData.fitnessGoals, 'muscleGain']
                      : questionnaireData.fitnessGoals.filter((g) => g !== 'muscleGain');
                    setQuestionnaireData({ ...questionnaireData, fitnessGoals: goals });
                  }}
                />
              }
              label="Muscle Gain"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={questionnaireData.fitnessGoals.includes('endurance')}
                  onChange={(e) => {
                    const goals = e.target.checked
                      ? [...questionnaireData.fitnessGoals, 'endurance']
                      : questionnaireData.fitnessGoals.filter((g) => g !== 'endurance');
                    setQuestionnaireData({ ...questionnaireData, fitnessGoals: goals });
                  }}
                />
              }
              label="Endurance"
            />
          </FormGroup>
        );
      case 1:
        return (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={questionnaireData.workoutPreferences.includes('strength')}
                  onChange={(e) => {
                    const preferences = e.target.checked
                      ? [...questionnaireData.workoutPreferences, 'strength']
                      : questionnaireData.workoutPreferences.filter((p) => p !== 'strength');
                    setQuestionnaireData({ ...questionnaireData, workoutPreferences: preferences });
                  }}
                />
              }
              label="Strength Training"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={questionnaireData.workoutPreferences.includes('cardio')}
                  onChange={(e) => {
                    const preferences = e.target.checked
                      ? [...questionnaireData.workoutPreferences, 'cardio']
                      : questionnaireData.workoutPreferences.filter((p) => p !== 'cardio');
                    setQuestionnaireData({ ...questionnaireData, workoutPreferences: preferences });
                  }}
                />
              }
              label="Cardio"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={questionnaireData.workoutPreferences.includes('flexibility')}
                  onChange={(e) => {
                    const preferences = e.target.checked
                      ? [...questionnaireData.workoutPreferences, 'flexibility']
                      : questionnaireData.workoutPreferences.filter((p) => p !== 'flexibility');
                    setQuestionnaireData({ ...questionnaireData, workoutPreferences: preferences });
                  }}
                />
              }
              label="Flexibility"
            />
          </FormGroup>
        );
      case 2:
        return (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={questionnaireData.dietaryRestrictions.includes('vegetarian')}
                  onChange={(e) => {
                    const restrictions = e.target.checked
                      ? [...questionnaireData.dietaryRestrictions, 'vegetarian']
                      : questionnaireData.dietaryRestrictions.filter((r) => r !== 'vegetarian');
                    setQuestionnaireData({ ...questionnaireData, dietaryRestrictions: restrictions });
                  }}
                />
              }
              label="Vegetarian"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={questionnaireData.dietaryRestrictions.includes('vegan')}
                  onChange={(e) => {
                    const restrictions = e.target.checked
                      ? [...questionnaireData.dietaryRestrictions, 'vegan']
                      : questionnaireData.dietaryRestrictions.filter((r) => r !== 'vegan');
                    setQuestionnaireData({ ...questionnaireData, dietaryRestrictions: restrictions });
                  }}
                />
              }
              label="Vegan"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={questionnaireData.dietaryRestrictions.includes('glutenFree')}
                  onChange={(e) => {
                    const restrictions = e.target.checked
                      ? [...questionnaireData.dietaryRestrictions, 'glutenFree']
                      : questionnaireData.dietaryRestrictions.filter((r) => r !== 'glutenFree');
                    setQuestionnaireData({ ...questionnaireData, dietaryRestrictions: restrictions });
                  }}
                />
              }
              label="Gluten Free"
            />
          </FormGroup>
        );
      case 3:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Preferred Bedtime"
              type="time"
              value={questionnaireData.sleepSchedule.preferredBedtime}
              onChange={(e) =>
                setQuestionnaireData({
                  ...questionnaireData,
                  sleepSchedule: {
                    ...questionnaireData.sleepSchedule,
                    preferredBedtime: e.target.value,
                  },
                })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Preferred Wake Time"
              type="time"
              value={questionnaireData.sleepSchedule.preferredWakeTime}
              onChange={(e) =>
                setQuestionnaireData({
                  ...questionnaireData,
                  sleepSchedule: {
                    ...questionnaireData.sleepSchedule,
                    preferredWakeTime: e.target.value,
                  },
                })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Total Sleep Hours"
              type="number"
              value={questionnaireData.sleepSchedule.totalSleepHours}
              onChange={(e) =>
                setQuestionnaireData({
                  ...questionnaireData,
                  sleepSchedule: {
                    ...questionnaireData.sleepSchedule,
                    totalSleepHours: Number(e.target.value),
                  },
                })
              }
            />
          </Box>
        );
      case 4:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Daily Calories"
              type="number"
              value={questionnaireData.nutritionGoals.dailyCalories}
              onChange={(e) =>
                setQuestionnaireData({
                  ...questionnaireData,
                  nutritionGoals: {
                    ...questionnaireData.nutritionGoals,
                    dailyCalories: Number(e.target.value),
                  },
                })
              }
            />
            <TextField
              label="Protein Percentage"
              type="number"
              value={questionnaireData.nutritionGoals.proteinPercentage}
              onChange={(e) =>
                setQuestionnaireData({
                  ...questionnaireData,
                  nutritionGoals: {
                    ...questionnaireData.nutritionGoals,
                    proteinPercentage: Number(e.target.value),
                  },
                })
              }
            />
            <TextField
              label="Carbs Percentage"
              type="number"
              value={questionnaireData.nutritionGoals.carbsPercentage}
              onChange={(e) =>
                setQuestionnaireData({
                  ...questionnaireData,
                  nutritionGoals: {
                    ...questionnaireData.nutritionGoals,
                    carbsPercentage: Number(e.target.value),
                  },
                })
              }
            />
            <TextField
              label="Fat Percentage"
              type="number"
              value={questionnaireData.nutritionGoals.fatPercentage}
              onChange={(e) =>
                setQuestionnaireData({
                  ...questionnaireData,
                  nutritionGoals: {
                    ...questionnaireData.nutritionGoals,
                    fatPercentage: Number(e.target.value),
                  },
                })
              }
            />
          </Box>
        );
      default:
        return null;
    }
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
                Today's Workout
              </Typography>
              <List>
                {routine.workouts
                  .filter((workout) => workout.date === new Date().toISOString().split('T')[0])
                  .map((workout) => (
                    <React.Fragment key={workout.id}>
                      <ListItem>
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
                Today's Meals
              </Typography>
              <List>
                {routine.meals
                  .filter((meal) => meal.date === new Date().toISOString().split('T')[0])
                  .map((meal) => (
                    <React.Fragment key={meal.id}>
                      <ListItem>
                        <ListItemText
                          primary={meal.name}
                          secondary={`${meal.calories} calories • Protein: ${meal.protein}g • Carbs: ${meal.carbs}g • Fat: ${meal.fat}g`}
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
        renderRoutine()
      )}

      <Dialog
        open={openQuestionnaire}
        onClose={() => setOpenQuestionnaire(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Your Custom Routine</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {renderStepContent(activeStep)}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQuestionnaire(false)}>Cancel</Button>
          {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
          {activeStep === steps.length - 1 ? (
            <Button onClick={handleSubmit} variant="contained">
              Generate Routine
            </Button>
          ) : (
            <Button onClick={handleNext} variant="contained">
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar; 