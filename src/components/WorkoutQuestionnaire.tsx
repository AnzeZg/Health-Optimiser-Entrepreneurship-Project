import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Slider,
  Checkbox,
  TextField,
  Paper,
  Grid,
  Chip,
} from '@mui/material';

interface QuestionnaireState {
  // Section 1: Fitness Goals
  primaryGoal: string;
  secondaryGoal: string;
  trainingForEvent: boolean;
  eventDate?: string;

  // Section 2: Schedule & Time
  daysPerWeek: number;
  workoutDuration: string;
  preferredTime: string;
  restDays: string[];

  // Section 3: Fitness Background
  fitnessLevel: string;
  enjoyedWorkouts: string[];

  // Section 4: Equipment & Access
  workoutLocation: string;
  availableEquipment: string[];

  // Section 5: Lifestyle & Nutrition
  dietPlan: string;
  mealPreparation: string;

  // Section 6: Health & Safety
  injuries: string;
  medicalConditions: string;

  // Section 7: Motivation & Preferences
  motivationFactors: string[];
  workoutStyle: string;

  // Section 8: Progress & Tracking
  progressTracking: string[];
  checkInFrequency: string;
}

const initialState: QuestionnaireState = {
  primaryGoal: '',
  secondaryGoal: '',
  trainingForEvent: false,
  daysPerWeek: 3,
  workoutDuration: '',
  preferredTime: '',
  restDays: [],
  fitnessLevel: '',
  enjoyedWorkouts: [],
  workoutLocation: '',
  availableEquipment: [],
  dietPlan: '',
  mealPreparation: '',
  injuries: '',
  medicalConditions: '',
  motivationFactors: [],
  workoutStyle: '',
  progressTracking: [],
  checkInFrequency: '',
};

const sections = [
  'Fitness Goals',
  'Schedule & Time',
  'Fitness Background',
  'Equipment & Access',
  'Lifestyle & Nutrition',
  'Health & Safety',
  'Motivation & Preferences',
  'Progress & Tracking',
];

export const WorkoutQuestionnaire: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [state, setState] = useState<QuestionnaireState>(initialState);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    console.log('Questionnaire completed:', state);
    // Here you would typically send the data to your backend
  };

  const renderSection1 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        🧭 Your Fitness Goals
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel>1. What is your primary fitness goal?</FormLabel>
        <RadioGroup
          value={state.primaryGoal}
          onChange={(e) => setState({ ...state, primaryGoal: e.target.value })}
        >
          <FormControlLabel value="lose_fat" control={<Radio />} label="🔥 Lose fat" />
          <FormControlLabel value="build_muscle" control={<Radio />} label="💪 Build muscle" />
          <FormControlLabel value="endurance" control={<Radio />} label="🫀 Improve endurance" />
          <FormControlLabel value="flexibility" control={<Radio />} label="🤸 Increase flexibility/mobility" />
          <FormControlLabel value="wellness" control={<Radio />} label="🌿 General wellness" />
          <FormControlLabel value="stress" control={<Radio />} label="🧘 Reduce stress" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel>2. Do you have a secondary goal? (Optional)</FormLabel>
        <RadioGroup
          value={state.secondaryGoal}
          onChange={(e) => setState({ ...state, secondaryGoal: e.target.value })}
        >
          <FormControlLabel value="same" control={<Radio />} label="Same as primary" />
          <FormControlLabel value="event" control={<Radio />} label="🏃‍♀️ Train for an event" />
          <FormControlLabel value="posture" control={<Radio />} label="🏋️ Improve posture/strength" />
          <FormControlLabel value="clarity" control={<Radio />} label="😌 Mental clarity" />
          <FormControlLabel value="none" control={<Radio />} label="None" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel>3. Are you training for a specific event or deadline?</FormLabel>
        <RadioGroup
          value={state.trainingForEvent ? 'yes' : 'no'}
          onChange={(e) => setState({ ...state, trainingForEvent: e.target.value === 'yes' })}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
        {state.trainingForEvent && (
          <TextField
            type="date"
            fullWidth
            margin="normal"
            value={state.eventDate}
            onChange={(e) => setState({ ...state, eventDate: e.target.value })}
          />
        )}
      </FormControl>
    </Box>
  );

  const renderSection2 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        🗓️ Schedule & Time
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel>4. How many days per week can you work out?</FormLabel>
        <Slider
          value={state.daysPerWeek}
          onChange={(_, value) => setState({ ...state, daysPerWeek: value as number })}
          min={1}
          max={7}
          marks
          valueLabelDisplay="auto"
        />
      </FormControl>

      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel>5. How long can your workouts be?</FormLabel>
        <RadioGroup
          value={state.workoutDuration}
          onChange={(e) => setState({ ...state, workoutDuration: e.target.value })}
        >
          <FormControlLabel value="15-30" control={<Radio />} label="⏱ 15–30 min" />
          <FormControlLabel value="30-45" control={<Radio />} label="⏱ 30–45 min" />
          <FormControlLabel value="45-60" control={<Radio />} label="⏱ 45–60 min" />
          <FormControlLabel value="60+" control={<Radio />} label="⏱ 60+ min" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel>6. When do you prefer to train?</FormLabel>
        <RadioGroup
          value={state.preferredTime}
          onChange={(e) => setState({ ...state, preferredTime: e.target.value })}
        >
          <FormControlLabel value="morning" control={<Radio />} label="🌅 Morning" />
          <FormControlLabel value="afternoon" control={<Radio />} label="🌤️ Afternoon" />
          <FormControlLabel value="evening" control={<Radio />} label="🌙 Evening" />
          <FormControlLabel value="flexible" control={<Radio />} label="⏰ Flexible" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel>7. Are there specific days you'd like to rest?</FormLabel>
        <Grid container spacing={1}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <Grid item key={day}>
              <Chip
                label={day}
                onClick={() => {
                  const newRestDays = state.restDays.includes(day)
                    ? state.restDays.filter(d => d !== day)
                    : [...state.restDays, day];
                  setState({ ...state, restDays: newRestDays });
                }}
                color={state.restDays.includes(day) ? 'primary' : 'default'}
              />
            </Grid>
          ))}
        </Grid>
      </FormControl>
    </Box>
  );

  const renderSection3 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        🧘 Fitness Background
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel>8. How would you rate your current fitness level?</FormLabel>
        <RadioGroup
          value={state.fitnessLevel}
          onChange={(e) => setState({ ...state, fitnessLevel: e.target.value })}
        >
          <FormControlLabel value="beginner" control={<Radio />} label="🟢 Beginner (new or returning)" />
          <FormControlLabel value="intermediate" control={<Radio />} label="🟡 Intermediate (some consistency)" />
          <FormControlLabel value="advanced" control={<Radio />} label="🔴 Advanced (train regularly)" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel>9. What types of workouts do you already enjoy?</FormLabel>
        <Grid container spacing={1}>
          {[
            { value: 'strength', label: '🏋️ Strength' },
            { value: 'cardio', label: '🏃 Cardio' },
            { value: 'yoga', label: '🧘 Yoga or Stretching' },
            { value: 'hiit', label: '🥊 HIIT' },
            { value: 'dance', label: '💃 Dance' },
            { value: 'none', label: '🚫 None yet' },
          ].map((workout) => (
            <Grid item key={workout.value}>
              <Chip
                label={workout.label}
                onClick={() => {
                  const newWorkouts = state.enjoyedWorkouts.includes(workout.value)
                    ? state.enjoyedWorkouts.filter(w => w !== workout.value)
                    : [...state.enjoyedWorkouts, workout.value];
                  setState({ ...state, enjoyedWorkouts: newWorkouts });
                }}
                color={state.enjoyedWorkouts.includes(workout.value) ? 'primary' : 'default'}
              />
            </Grid>
          ))}
        </Grid>
      </FormControl>
    </Box>
  );

  const renderSection4 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        🏋️ Equipment & Access
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel>10. Where will you work out most often?</FormLabel>
        <RadioGroup
          value={state.workoutLocation}
          onChange={(e) => setState({ ...state, workoutLocation: e.target.value })}
        >
          <FormControlLabel value="home" control={<Radio />} label="🏠 At home" />
          <FormControlLabel value="gym" control={<Radio />} label="🏋️ Gym" />
          <FormControlLabel value="outdoors" control={<Radio />} label="🌳 Outdoors" />
          <FormControlLabel value="traveling" control={<Radio />} label="🧳 While traveling" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel>11. What equipment do you have access to?</FormLabel>
        <Grid container spacing={1}>
          {[
            'Dumbbells',
            'Resistance bands',
            'Yoga mat',
            'Pull-up bar',
            'Treadmill or bike',
            'Kettlebells',
            'Bodyweight only',
          ].map((equipment) => (
            <Grid item key={equipment}>
              <Chip
                label={equipment}
                onClick={() => {
                  const newEquipment = state.availableEquipment.includes(equipment)
                    ? state.availableEquipment.filter(e => e !== equipment)
                    : [...state.availableEquipment, equipment];
                  setState({ ...state, availableEquipment: newEquipment });
                }}
                color={state.availableEquipment.includes(equipment) ? 'primary' : 'default'}
              />
            </Grid>
          ))}
        </Grid>
      </FormControl>
    </Box>
  );

  const renderSection5 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        🥗 Lifestyle & Nutrition
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel>12. Do you follow a specific diet or nutrition plan?</FormLabel>
        <RadioGroup
          value={state.dietPlan}
          onChange={(e) => setState({ ...state, dietPlan: e.target.value })}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
          <FormControlLabel value="help" control={<Radio />} label="I'd like help with nutrition" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel>13. How often do you cook or prepare meals?</FormLabel>
        <RadioGroup
          value={state.mealPreparation}
          onChange={(e) => setState({ ...state, mealPreparation: e.target.value })}
        >
          <FormControlLabel value="most" control={<Radio />} label="🧑‍🍳 Most days" />
          <FormControlLabel value="sometimes" control={<Radio />} label="🍱 Sometimes" />
          <FormControlLabel value="rarely" control={<Radio />} label="🍔 Rarely" />
        </RadioGroup>
      </FormControl>
    </Box>
  );

  const renderSection6 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        ❤️ Health & Safety
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel>14. Do you have any injuries or limitations I should know about?</FormLabel>
        <RadioGroup
          value={state.injuries ? 'yes' : 'no'}
          onChange={(e) => setState({ ...state, injuries: e.target.value === 'yes' ? '' : 'no' })}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
        {state.injuries !== 'no' && (
          <TextField
            fullWidth
            margin="normal"
            multiline
            rows={2}
            placeholder="Please describe your injuries or limitations"
            value={state.injuries}
            onChange={(e) => setState({ ...state, injuries: e.target.value })}
          />
        )}
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel>15. Any medical conditions that affect your ability to train?</FormLabel>
        <RadioGroup
          value={state.medicalConditions ? 'yes' : 'no'}
          onChange={(e) => setState({ ...state, medicalConditions: e.target.value === 'yes' ? '' : 'no' })}
        >
          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
          <FormControlLabel value="no" control={<Radio />} label="No" />
        </RadioGroup>
        {state.medicalConditions !== 'no' && (
          <TextField
            fullWidth
            margin="normal"
            multiline
            rows={2}
            placeholder="Please describe your medical conditions"
            value={state.medicalConditions}
            onChange={(e) => setState({ ...state, medicalConditions: e.target.value })}
          />
        )}
      </FormControl>
    </Box>
  );

  const renderSection7 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        💡 Motivation & Preferences
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel>16. What keeps you motivated?</FormLabel>
        <Grid container spacing={1}>
          {[
            { value: 'goals', label: '🎯 Clear goals' },
            { value: 'progress', label: '📊 Seeing progress' },
            { value: 'music', label: '🎵 Music or mood' },
            { value: 'accountability', label: '🧑‍🤝‍🧑 Accountability' },
            { value: 'challenges', label: '🎮 Challenges & badges' },
            { value: 'feeling', label: '☀️ Just feeling better' },
          ].map((factor) => (
            <Grid item key={factor.value}>
              <Chip
                label={factor.label}
                onClick={() => {
                  const newFactors = state.motivationFactors.includes(factor.value)
                    ? state.motivationFactors.filter(f => f !== factor.value)
                    : [...state.motivationFactors, factor.value];
                  setState({ ...state, motivationFactors: newFactors });
                }}
                color={state.motivationFactors.includes(factor.value) ? 'primary' : 'default'}
              />
            </Grid>
          ))}
        </Grid>
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel>17. What workout style do you prefer?</FormLabel>
        <RadioGroup
          value={state.workoutStyle}
          onChange={(e) => setState({ ...state, workoutStyle: e.target.value })}
        >
          <FormControlLabel value="structured" control={<Radio />} label="Structured plan (daily schedule)" />
          <FormControlLabel value="flexible" control={<Radio />} label="Flexible plan (mix & match)" />
          <FormControlLabel value="surprise" control={<Radio />} label="Surprise me each day!" />
        </RadioGroup>
      </FormControl>
    </Box>
  );

  const renderSection8 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        📈 Progress & Tracking
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel>18. How would you like to track your progress?</FormLabel>
        <Grid container spacing={1}>
          {[
            { value: 'photos', label: '📷 Progress photos' },
            { value: 'measurements', label: '📏 Body measurements' },
            { value: 'weight', label: '⚖️ Weight' },
            { value: 'mood', label: '🧠 Mood & energy' },
            { value: 'prs', label: '📊 Personal records (PRs)' },
            { value: 'none', label: "🚫 Don't want to track anything" },
          ].map((method) => (
            <Grid item key={method.value}>
              <Chip
                label={method.label}
                onClick={() => {
                  const newTracking = state.progressTracking.includes(method.value)
                    ? state.progressTracking.filter(t => t !== method.value)
                    : [...state.progressTracking, method.value];
                  setState({ ...state, progressTracking: newTracking });
                }}
                color={state.progressTracking.includes(method.value) ? 'primary' : 'default'}
              />
            </Grid>
          ))}
        </Grid>
      </FormControl>

      <FormControl component="fieldset">
        <FormLabel>19. How often should we check in with you?</FormLabel>
        <RadioGroup
          value={state.checkInFrequency}
          onChange={(e) => setState({ ...state, checkInFrequency: e.target.value })}
        >
          <FormControlLabel value="daily" control={<Radio />} label="Daily" />
          <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
          <FormControlLabel value="biweekly" control={<Radio />} label="Every 2 weeks" />
          <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
        </RadioGroup>
      </FormControl>
    </Box>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderSection1();
      case 1:
        return renderSection2();
      case 2:
        return renderSection3();
      case 3:
        return renderSection4();
      case 4:
        return renderSection5();
      case 5:
        return renderSection6();
      case 6:
        return renderSection7();
      case 7:
        return renderSection8();
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Workout Questionnaire
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {sections.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          {activeStep === sections.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}; 