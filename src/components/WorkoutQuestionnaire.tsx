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
  CircularProgress,
  Alert,
} from '@mui/material';
import { useStore, QuestionnaireData } from '../store/useStore';
import { generateRoutine } from '../services/routineService';

interface QuestionnaireState {
  // Section 1: Profile & Goals
  age: string;
  biologicalSex: string;
  height: string;
  weight: string;
  activityLevel: string;
  primaryGoal: string;
  trainingForEvent: boolean;
  eventDate?: string;
  // Section 2: Schedule & Fitness
  daysPerWeek: number;
  workoutDuration: string;
  preferredTime: string;
  fitnessLevel: string;
  // Section 3: Equipment & Nutrition
  workoutLocation: string;
  availableEquipment: string[];
  dietType: string;
  // Section 4: Health & Motivation
  injuries: string;
  medicalConditions: string;
  motivation: string;
  // Section 5: Progress Tracking
  progressTracking: string[];
  checkInFrequency: string;
}

const initialState: QuestionnaireState = {
  age: '',
  biologicalSex: '',
  height: '',
  weight: '',
  activityLevel: '',
  primaryGoal: '',
  trainingForEvent: false,
  eventDate: '',
  daysPerWeek: 3,
  workoutDuration: '',
  preferredTime: '',
  fitnessLevel: '',
  workoutLocation: '',
  availableEquipment: [],
  dietType: '',
  injuries: '',
  medicalConditions: '',
  motivation: '',
  progressTracking: [],
  checkInFrequency: '',
};

const sections = [
  'Profile & Goals',
  'Schedule & Fitness',
  'Equipment & Nutrition',
  'Health & Motivation',
  'Progress Tracking',
];

const mapToQuestionnaireData = (state: QuestionnaireState): QuestionnaireData => ({
  generalInfo: {
    age: Number(state.age),
    biologicalSex: state.biologicalSex as any,
    height: Number(state.height),
    weight: Number(state.weight),
    activityLevel: state.activityLevel as any,
    medicalLimitations: state.injuries ? state.injuries.split(',').map(s => s.trim()) : [],
    dietType: state.dietType as any,
  },
  wellnessPreferences: {
    mainGoal: state.primaryGoal as any,
    focusAreas: [], // Could be derived from goals if needed
    timeDedication: state.workoutDuration as any,
    preferredTime: state.preferredTime as any,
    participateInChallenges: false,
    wantReminders: false,
  },
});

export const WorkoutQuestionnaire: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [state, setState] = useState<QuestionnaireState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setRoutine } = useStore();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = mapToQuestionnaireData(state);
      const routine = await generateRoutine(data);
      setRoutine(routine);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate routine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isSectionValid = () => {
    switch (activeStep) {
      case 0:
        return !!state.age && !!state.biologicalSex && !!state.height && !!state.weight && !!state.activityLevel && !!state.primaryGoal;
      case 1:
        return !!state.daysPerWeek && !!state.workoutDuration && !!state.preferredTime && !!state.fitnessLevel;
      case 2:
        return !!state.workoutLocation && state.availableEquipment.length > 0 && !!state.dietType;
      case 3:
        const injuriesValid = (state.injuries === 'no') || (state.injuries !== '' && state.injuries !== 'no');
        const medicalValid = (state.medicalConditions === 'no') || (state.medicalConditions !== '' && state.medicalConditions !== 'no');
        return injuriesValid && medicalValid && !!state.motivation;
      case 4:
        return state.progressTracking.length > 0 && !!state.checkInFrequency;
      default:
        return true;
    }
  };

  const renderSection0 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>👤 Profile & Goals</Typography>
      <Box mb={2}><TextField fullWidth label="Age" type="number" value={state.age} onChange={e => setState({ ...state, age: e.target.value })} /></Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>Biological Sex</FormLabel>
          <RadioGroup value={state.biologicalSex} onChange={e => setState({ ...state, biologicalSex: e.target.value })}>
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="prefer_not_to_say" control={<Radio />} label="Prefer not to say" />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box mb={2}><TextField fullWidth label="Height (cm)" type="number" value={state.height} onChange={e => setState({ ...state, height: e.target.value })} /></Box>
      <Box mb={2}><TextField fullWidth label="Weight (kg)" type="number" value={state.weight} onChange={e => setState({ ...state, weight: e.target.value })} /></Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>Activity Level</FormLabel>
          <RadioGroup value={state.activityLevel} onChange={e => setState({ ...state, activityLevel: e.target.value })}>
            <FormControlLabel value="sedentary" control={<Radio />} label="Sedentary (little or no exercise)" />
            <FormControlLabel value="light" control={<Radio />} label="Light (1–2 days/week)" />
            <FormControlLabel value="moderate" control={<Radio />} label="Moderate (3–5 days/week)" />
            <FormControlLabel value="active" control={<Radio />} label="Active (6–7 days/week)" />
            <FormControlLabel value="very_active" control={<Radio />} label="Very active (daily intense training)" />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>What is your primary fitness goal?</FormLabel>
          <RadioGroup value={state.primaryGoal} onChange={e => setState({ ...state, primaryGoal: e.target.value })}>
            <FormControlLabel value="lose_fat" control={<Radio />} label="🔥 Lose fat" />
            <FormControlLabel value="build_muscle" control={<Radio />} label="💪 Build muscle" />
            <FormControlLabel value="endurance" control={<Radio />} label="🫀 Improve endurance" />
            <FormControlLabel value="flexibility" control={<Radio />} label="🤸 Increase flexibility/mobility" />
            <FormControlLabel value="wellness" control={<Radio />} label="🌿 General wellness" />
            <FormControlLabel value="stress" control={<Radio />} label="🧘 Reduce stress" />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>Are you training for a specific event or deadline?</FormLabel>
          <RadioGroup value={state.trainingForEvent ? 'yes' : 'no'} onChange={e => setState({ ...state, trainingForEvent: e.target.value === 'yes' })}>
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
          {state.trainingForEvent && (
            <TextField type="date" fullWidth margin="normal" value={state.eventDate} onChange={e => setState({ ...state, eventDate: e.target.value })} />
          )}
        </FormControl>
      </Box>
    </Box>
  );

  const renderSection1 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>🏋️ Schedule & Fitness</Typography>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>How many days per week can you work out?</FormLabel>
          <Slider value={state.daysPerWeek} onChange={(_, value) => setState({ ...state, daysPerWeek: value as number })} min={1} max={7} marks valueLabelDisplay="auto" />
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>How long can your workouts be?</FormLabel>
          <RadioGroup value={state.workoutDuration} onChange={e => setState({ ...state, workoutDuration: e.target.value })}>
            <FormControlLabel value="15min" control={<Radio />} label="15 minutes" />
            <FormControlLabel value="30min" control={<Radio />} label="30 minutes" />
            <FormControlLabel value="45min" control={<Radio />} label="45 minutes" />
            <FormControlLabel value="1hour" control={<Radio />} label="1 hour" />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>When do you prefer to train?</FormLabel>
          <RadioGroup value={state.preferredTime} onChange={e => setState({ ...state, preferredTime: e.target.value })}>
            <FormControlLabel value="morning" control={<Radio />} label="Morning" />
            <FormControlLabel value="afternoon" control={<Radio />} label="Afternoon" />
            <FormControlLabel value="evening" control={<Radio />} label="Evening" />
            <FormControlLabel value="no_preference" control={<Radio />} label="No preference" />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>How would you rate your current fitness level?</FormLabel>
          <RadioGroup value={state.fitnessLevel} onChange={e => setState({ ...state, fitnessLevel: e.target.value })}>
            <FormControlLabel value="beginner" control={<Radio />} label="Beginner (new or returning)" />
            <FormControlLabel value="intermediate" control={<Radio />} label="Intermediate (some consistency)" />
            <FormControlLabel value="advanced" control={<Radio />} label="Advanced (train regularly)" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );

  const renderSection2 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>🏠 Equipment & Nutrition</Typography>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>Where will you work out most often?</FormLabel>
          <RadioGroup value={state.workoutLocation} onChange={e => setState({ ...state, workoutLocation: e.target.value })}>
            <FormControlLabel value="home" control={<Radio />} label="At home" />
            <FormControlLabel value="gym" control={<Radio />} label="Gym" />
            <FormControlLabel value="outdoors" control={<Radio />} label="Outdoors" />
            <FormControlLabel value="traveling" control={<Radio />} label="While traveling" />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>What equipment do you have access to?</FormLabel>
          <Grid container spacing={1} direction="column">
            {['Dumbbells','Resistance bands','Yoga mat','Pull-up bar','Treadmill or bike','Kettlebells','Bodyweight only'].map(equipment => (
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
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>Diet Type</FormLabel>
          <RadioGroup value={state.dietType} onChange={e => setState({ ...state, dietType: e.target.value })}>
            <FormControlLabel value="none" control={<Radio />} label="No specific diet" />
            <FormControlLabel value="vegetarian" control={<Radio />} label="Vegetarian" />
            <FormControlLabel value="vegan" control={<Radio />} label="Vegan" />
            <FormControlLabel value="keto" control={<Radio />} label="Keto" />
            <FormControlLabel value="mediterranean" control={<Radio />} label="Mediterranean" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );

  const renderSection3 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>❤️ Health & Motivation</Typography>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>Do you have any injuries or limitations?</FormLabel>
          <RadioGroup
            value={state.injuries ? 'yes' : 'no'}
            onChange={e => {
              if (e.target.value === 'no') {
                setState({ ...state, injuries: 'no' });
              } else {
                setState({ ...state, injuries: '' });
              }
            }}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
          {state.injuries !== 'no' && (
            <TextField fullWidth margin="normal" multiline rows={2} placeholder="Please describe your injuries or limitations" value={state.injuries === 'no' ? '' : state.injuries} onChange={e => setState({ ...state, injuries: e.target.value })} />
          )}
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>Any medical conditions that affect your ability to train?</FormLabel>
          <RadioGroup
            value={state.medicalConditions ? 'yes' : 'no'}
            onChange={e => {
              if (e.target.value === 'no') {
                setState({ ...state, medicalConditions: 'no' });
              } else {
                setState({ ...state, medicalConditions: '' });
              }
            }}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
          {state.medicalConditions !== 'no' && (
            <TextField fullWidth margin="normal" multiline rows={2} placeholder="Please describe your medical conditions" value={state.medicalConditions === 'no' ? '' : state.medicalConditions} onChange={e => setState({ ...state, medicalConditions: e.target.value })} />
          )}
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>What motivates you to stay active?</FormLabel>
          <TextField fullWidth multiline rows={2} placeholder="e.g. Feeling better, achieving goals, social support..." value={state.motivation} onChange={e => setState({ ...state, motivation: e.target.value })} />
        </FormControl>
      </Box>
    </Box>
  );

  const renderSection4 = () => (
    <Box>
      <Typography variant="h6" gutterBottom>📈 Progress Tracking</Typography>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>How would you like to track your progress?</FormLabel>
          <Grid container spacing={1} direction="column">
            {[
              { value: 'photos', label: '📷 Progress photos' },
              { value: 'measurements', label: '📏 Body measurements' },
              { value: 'weight', label: '⚖️ Weight' },
              { value: 'mood', label: '🧠 Mood & energy' },
              { value: 'prs', label: '📊 Personal records (PRs)' },
              { value: 'none', label: "🚫 Don't want to track anything" },
            ].map(method => (
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
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <FormLabel>How often should we check in with you?</FormLabel>
          <RadioGroup value={state.checkInFrequency} onChange={e => setState({ ...state, checkInFrequency: e.target.value })}>
            <FormControlLabel value="daily" control={<Radio />} label="Daily" />
            <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
            <FormControlLabel value="biweekly" control={<Radio />} label="Every 2 weeks" />
            <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderSection0();
      case 1:
        return renderSection1();
      case 2:
        return renderSection2();
      case 3:
        return renderSection3();
      case 4:
        return renderSection4();
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
              disabled={!isSectionValid() || loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!isSectionValid()}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}; 