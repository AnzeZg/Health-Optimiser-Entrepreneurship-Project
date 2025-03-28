import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Checkbox,
  FormGroup,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  OutlinedInput,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useStore, QuestionnaireData, GeneralInfo, WellnessPreferences, WellnessArea } from '../store/useStore';
import { generateRoutine } from '../services/routineService';

const medicalLimitations = [
  'Back pain',
  'Diabetes',
  'Asthma',
  'Heart condition',
  'Joint issues',
  'None',
];

const Questionnaire: React.FC = () => {
  const { setQuestionnaireData, setRoutine } = useStore();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generalInfo, setGeneralInfo] = useState<Partial<GeneralInfo>>({
    medicalLimitations: [],
  });
  const [wellnessPreferences, setWellnessPreferences] = useState<Partial<WellnessPreferences>>({
    focusAreas: [],
  });

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

      const data: QuestionnaireData = {
        generalInfo: generalInfo as GeneralInfo,
        wellnessPreferences: wellnessPreferences as WellnessPreferences,
      };

      setQuestionnaireData(data);
      const routine = await generateRoutine(data);
      setRoutine(routine);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate routine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['General Information', 'Wellness Preferences'];

  const renderGeneralInfo = () => (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Age"
        type="number"
        value={generalInfo.age || ''}
        onChange={(e) => setGeneralInfo({ ...generalInfo, age: Number(e.target.value) })}
        sx={{ mb: 2 }}
      />

      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel>Biological Sex</FormLabel>
        <RadioGroup
          value={generalInfo.biologicalSex || ''}
          onChange={(e) => setGeneralInfo({ ...generalInfo, biologicalSex: e.target.value as GeneralInfo['biologicalSex'] })}
        >
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="prefer_not_to_say" control={<Radio />} label="Prefer not to say" />
        </RadioGroup>
      </FormControl>

      <TextField
        fullWidth
        label="Height (cm)"
        type="number"
        value={generalInfo.height || ''}
        onChange={(e) => setGeneralInfo({ ...generalInfo, height: Number(e.target.value) })}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Weight (kg)"
        type="number"
        value={generalInfo.weight || ''}
        onChange={(e) => setGeneralInfo({ ...generalInfo, weight: Number(e.target.value) })}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>Activity Level</FormLabel>
        <Select
          value={generalInfo.activityLevel || ''}
          onChange={(e) => setGeneralInfo({ ...generalInfo, activityLevel: e.target.value as GeneralInfo['activityLevel'] })}
        >
          <MenuItem value="sedentary">Sedentary (little or no exercise)</MenuItem>
          <MenuItem value="light">Light (1–2 days/week)</MenuItem>
          <MenuItem value="moderate">Moderate (3–5 days/week)</MenuItem>
          <MenuItem value="active">Active (6–7 days/week)</MenuItem>
          <MenuItem value="very_active">Very active (daily intense training)</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>Medical Limitations</FormLabel>
        <Select
          multiple
          value={generalInfo.medicalLimitations || []}
          onChange={(e) => setGeneralInfo({ ...generalInfo, medicalLimitations: e.target.value as string[] })}
          input={<OutlinedInput label="Medical Limitations" />}
        >
          {medicalLimitations.map((limitation) => (
            <MenuItem key={limitation} value={limitation}>
              {limitation}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>Diet Type</FormLabel>
        <Select
          value={generalInfo.dietType || ''}
          onChange={(e) => setGeneralInfo({ ...generalInfo, dietType: e.target.value as GeneralInfo['dietType'] })}
        >
          <MenuItem value="none">No specific diet</MenuItem>
          <MenuItem value="vegetarian">Vegetarian</MenuItem>
          <MenuItem value="vegan">Vegan</MenuItem>
          <MenuItem value="keto">Keto</MenuItem>
          <MenuItem value="mediterranean">Mediterranean</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  const renderWellnessPreferences = () => (
    <Box sx={{ mt: 2 }}>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel>Main Wellness Goal</FormLabel>
        <RadioGroup
          value={wellnessPreferences.mainGoal || ''}
          onChange={(e) => setWellnessPreferences({ ...wellnessPreferences, mainGoal: e.target.value as WellnessPreferences['mainGoal'] })}
        >
          <FormControlLabel value="lose_weight" control={<Radio />} label="Lose weight" />
          <FormControlLabel value="build_muscle" control={<Radio />} label="Build muscle" />
          <FormControlLabel value="reduce_stress" control={<Radio />} label="Reduce stress" />
          <FormControlLabel value="improve_sleep" control={<Radio />} label="Improve sleep" />
          <FormControlLabel value="boost_energy" control={<Radio />} label="Boost energy" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel>Focus Areas (Select up to two)</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={wellnessPreferences.focusAreas?.includes('nutrition')}
                onChange={(e) => {
                  const newAreas = e.target.checked
                    ? [...(wellnessPreferences.focusAreas || []), 'nutrition' as WellnessArea]
                    : (wellnessPreferences.focusAreas || []).filter((area) => area !== 'nutrition');
                  setWellnessPreferences({ ...wellnessPreferences, focusAreas: newAreas });
                }}
              />
            }
            label="Nutrition"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={wellnessPreferences.focusAreas?.includes('fitness')}
                onChange={(e) => {
                  const newAreas = e.target.checked
                    ? [...(wellnessPreferences.focusAreas || []), 'fitness' as WellnessArea]
                    : (wellnessPreferences.focusAreas || []).filter((area) => area !== 'fitness');
                  setWellnessPreferences({ ...wellnessPreferences, focusAreas: newAreas });
                }}
              />
            }
            label="Fitness"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={wellnessPreferences.focusAreas?.includes('mental_health')}
                onChange={(e) => {
                  const newAreas = e.target.checked
                    ? [...(wellnessPreferences.focusAreas || []), 'mental_health' as WellnessArea]
                    : (wellnessPreferences.focusAreas || []).filter((area) => area !== 'mental_health');
                  setWellnessPreferences({ ...wellnessPreferences, focusAreas: newAreas });
                }}
              />
            }
            label="Mental Health"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={wellnessPreferences.focusAreas?.includes('sleep')}
                onChange={(e) => {
                  const newAreas = e.target.checked
                    ? [...(wellnessPreferences.focusAreas || []), 'sleep' as WellnessArea]
                    : (wellnessPreferences.focusAreas || []).filter((area) => area !== 'sleep');
                  setWellnessPreferences({ ...wellnessPreferences, focusAreas: newAreas });
                }}
              />
            }
            label="Sleep"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={wellnessPreferences.focusAreas?.includes('habit_tracking')}
                onChange={(e) => {
                  const newAreas = e.target.checked
                    ? [...(wellnessPreferences.focusAreas || []), 'habit_tracking' as WellnessArea]
                    : (wellnessPreferences.focusAreas || []).filter((area) => area !== 'habit_tracking');
                  setWellnessPreferences({ ...wellnessPreferences, focusAreas: newAreas });
                }}
              />
            }
            label="Habit Tracking"
          />
        </FormGroup>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>Daily Time Available</FormLabel>
        <Select
          value={wellnessPreferences.timeDedication || ''}
          onChange={(e) => setWellnessPreferences({ ...wellnessPreferences, timeDedication: e.target.value as WellnessPreferences['timeDedication'] })}
        >
          <MenuItem value="15min">15 minutes</MenuItem>
          <MenuItem value="30min">30 minutes</MenuItem>
          <MenuItem value="45min">45 minutes</MenuItem>
          <MenuItem value="1hour">1 hour</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <FormLabel>Preferred Time</FormLabel>
        <Select
          value={wellnessPreferences.preferredTime || ''}
          onChange={(e) => setWellnessPreferences({ ...wellnessPreferences, preferredTime: e.target.value as WellnessPreferences['preferredTime'] })}
        >
          <MenuItem value="morning">Morning</MenuItem>
          <MenuItem value="afternoon">Afternoon</MenuItem>
          <MenuItem value="evening">Evening</MenuItem>
          <MenuItem value="no_preference">No preference</MenuItem>
        </Select>
      </FormControl>

      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel>Participate in Challenges and Leaderboards?</FormLabel>
        <RadioGroup
          value={wellnessPreferences.participateInChallenges !== undefined ? wellnessPreferences.participateInChallenges.toString() : ''}
          onChange={(e) => setWellnessPreferences({ ...wellnessPreferences, participateInChallenges: e.target.value === 'true' })}
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel>Daily Reminders and Motivation?</FormLabel>
        <RadioGroup
          value={wellnessPreferences.wantReminders !== undefined ? wellnessPreferences.wantReminders.toString() : ''}
          onChange={(e) => setWellnessPreferences({ ...wellnessPreferences, wantReminders: e.target.value === 'true' })}
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
    </Box>
  );

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        {activeStep === 0 ? "Let's get to know you!" : "Personalize your plan!"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 ? renderGeneralInfo() : renderWellnessPreferences()}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0 || loading}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : activeStep === steps.length - 1 ? (
            'Generate Routine'
          ) : (
            'Next'
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default Questionnaire; 