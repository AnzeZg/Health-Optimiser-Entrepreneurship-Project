import { Routine, Workout, QuestionnaireData } from '../store/useStore';
import { format, addDays } from 'date-fns';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const generatePrompt = (data: QuestionnaireData): string => {
  const { generalInfo, wellnessPreferences } = data;
  const today = new Date();
  const startDate = format(today, 'yyyy-MM-dd');
  const endDate = format(addDays(today, 3), 'yyyy-MM-dd');
  
  return `Create a personalized 3-day health and wellness routine starting from ${startDate} for a ${generalInfo.age} year old ${generalInfo.biologicalSex} with the following characteristics:
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

Please generate a detailed 3-day routine that includes:
1. **For each day, include multiple exercises (at least 3-5) with sets, reps, rest, and a video URL for each exercise. Make the plan as detailed as possible.**
2. Daily workouts with specific exercises, sets, reps, weights, and rest times. For each exercise, include a reputable YouTube or video URL for demonstration (preferably official or high-quality instructional videos).
3. Include warm-up and cool-down routines for each workout day, with video links.
4. For rest days, suggest active recovery activities (like stretching, walking, yoga) and provide video links.
5. Meal plans with calorie counts and macronutrient breakdowns for each day.
6. Sleep schedule recommendations for each day.
7. Additional wellness activities based on the focus areas.
8. Motivational tips or daily encouragements.

**IMPORTANT:**
- Respond with ONLY valid JSON. Do NOT include any text, comments, or explanations before or after the JSON.
- The response must be a single valid JSON object and nothing else.
- Do not add markdown, code blocks, or any extra formatting.
- Do not use ellipses (...) or abbreviate any part of the JSON. Every array must be fully expanded with at least 2-3 full example items for each array. If you cannot fit the entire response, return a valid, complete JSON object with as many full items as possible, but never use ... or any abbreviation.
- For each videoUrl, only provide a real, reputable YouTube link. If you cannot provide a real video, set videoUrl to an empty string or null. Do not invent or guess video URLs.
- If the full 3-day routine does not fit, provide as many full days as possible (at least 2-3), but never abbreviate or use ellipses.

Format the response as a JSON object with the following structure:
{
  "id": "string",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
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
      "completed": boolean,
      "videoUrl": "string"
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
      "warmup": [
        { "name": "string", "videoUrl": "string" }
      ],
      "exercises": [
        {
          "name": "string",
          "sets": number,
          "reps": number,
          "weight": number,
          "rest": string,
          "videoUrl": "string"
        }
      ],
      "cooldown": [
        { "name": "string", "videoUrl": "string" }
      ],
      "motivation": "string"
    }
  ],
  "restDays": [
    {
      "date": "YYYY-MM-DD",
      "activities": [
        { "name": "string", "videoUrl": "string" }
      ],
      "motivation": "string"
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
            content: 'You are a JSON API. Always respond with only valid JSON, no explanations, no markdown, no comments, no extra text.'
          },
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
    const content = result.choices[0].message.content;
    // Extract the first JSON block from the response
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error('No valid JSON found in OpenAI response:', content);
      throw new Error('The AI response did not contain valid JSON. Raw response: ' + content);
    }
    try {
      const routine = JSON.parse(match[0]);
      return routine;
    } catch (err) {
      console.error('JSON parse error:', err, 'Raw response:', content);
      throw new Error('The AI response was not valid JSON. Raw response: ' + content);
    }
  } catch (error) {
    console.error('Error generating routine:', error);
    throw error;
  }
}; 