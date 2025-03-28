import { Routine, Workout, QuestionnaireData } from '../store/useStore';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const generatePrompt = (data: QuestionnaireData): string => {
  const { generalInfo, wellnessPreferences } = data;
  
  return `Create a personalized 30-day health and wellness routine for a ${generalInfo.age} year old ${generalInfo.biologicalSex} with the following characteristics:
- Height: ${generalInfo.height}cm
- Weight: ${generalInfo.weight}kg
- Activity Level: ${generalInfo.activityLevel}
- Medical Limitations: ${generalInfo.medicalLimitations.join(', ')}
- Diet Type: ${generalInfo.dietType}

Wellness Goals:
- Main Goal: ${wellnessPreferences.mainGoal}
- Focus Areas: ${wellnessPreferences.focusAreas.join(', ')}
- Daily Time Available: ${wellnessPreferences.timeDedication}
- Preferred Time: ${wellnessPreferences.preferredTime}
- Participate in Challenges: ${wellnessPreferences.participateInChallenges}
- Want Daily Reminders: ${wellnessPreferences.wantReminders}

Please generate a detailed 30-day routine that includes:
1. Daily workouts with specific exercises, sets, reps, and weights
2. Meal plans with calorie counts and macronutrient breakdowns
3. Sleep schedule recommendations
4. Additional wellness activities based on the focus areas

Format the response as a JSON object with the following structure:
{
  "id": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "meals": [
    {
      "id": "string",
      "name": "string",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "category": "Breakfast" | "Lunch" | "Dinner" | "Snacks",
      "date": "YYYY-MM-DD",
      "completed": boolean
    }
  ],
  "workouts": [
    {
      "id": "string",
      "name": "string",
      "duration": number,
      "caloriesBurned": number,
      "date": "YYYY-MM-DD",
      "completed": boolean,
      "type": "strength" | "cardio" | "flexibility",
      "exercises": [
        {
          "name": "string",
          "sets": number,
          "reps": number,
          "weight": number
        }
      ]
    }
  ],
  "sleepSchedule": {
    "bedtime": "HH:mm",
    "wakeTime": "HH:mm",
    "duration": number
  }
}`;
};

export const generateRoutine = async (data: QuestionnaireData): Promise<Routine> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not set. Please set the VITE_OPENAI_API_KEY environment variable.');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional health and wellness coach creating personalized routines. Provide detailed, specific, and realistic recommendations.'
          },
          {
            role: 'user',
            content: generatePrompt(data)
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const result = await response.json();
    const routine = JSON.parse(result.choices[0].message.content);
    return routine;
  } catch (error) {
    console.error('Error generating routine:', error);
    throw error;
  }
}; 