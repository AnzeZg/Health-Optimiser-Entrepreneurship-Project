import { Routine, Workout } from '../store/useStore';

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

export const generateRoutine = async (data: QuestionnaireData): Promise<Routine> => {
  // TODO: Replace with actual OpenAI API call
  // This is a mock implementation
  const mockRoutine: Routine = {
    id: Date.now().toString(),
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    meals: [],
    workouts: [],
    sleepSchedule: {
      bedtime: data.sleepSchedule.preferredBedtime,
      wakeTime: data.sleepSchedule.preferredWakeTime,
      duration: data.sleepSchedule.totalSleepHours,
    },
  };

  // Generate mock meals
  const mealCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  const mealNames = {
    Breakfast: ['Oatmeal with fruits', 'Greek yogurt with granola', 'Eggs and toast'],
    Lunch: ['Chicken salad', 'Quinoa bowl', 'Tuna wrap'],
    Dinner: ['Grilled salmon', 'Stir-fry vegetables', 'Turkey meatballs'],
    Snacks: ['Mixed nuts', 'Protein shake', 'Fruit smoothie'],
  };

  for (let i = 0; i < 30; i++) {
    const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    mealCategories.forEach((category) => {
      const mealName = mealNames[category as keyof typeof mealNames][
        Math.floor(Math.random() * mealNames[category as keyof typeof mealNames].length)
      ];
      mockRoutine.meals.push({
        id: Date.now().toString() + i + category,
        name: mealName,
        calories: Math.floor(Math.random() * 500) + 300,
        protein: Math.floor(Math.random() * 30) + 20,
        carbs: Math.floor(Math.random() * 40) + 30,
        fat: Math.floor(Math.random() * 20) + 10,
        category,
        date,
        completed: false,
      });
    });
  }

  // Generate mock workouts
  const workoutTypes = data.workoutPreferences;
  const workoutNames = {
    strength: ['Upper Body', 'Lower Body', 'Full Body', 'Core'],
    cardio: ['Running', 'Cycling', 'HIIT', 'Swimming'],
    flexibility: ['Yoga', 'Stretching', 'Pilates', 'Mobility'],
  };

  for (let i = 0; i < 30; i++) {
    const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const type = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
    const workoutName = workoutNames[type as keyof typeof workoutNames][
      Math.floor(Math.random() * workoutNames[type as keyof typeof workoutNames].length)
    ];

    const workout: Workout = {
      id: Date.now().toString() + i,
      name: workoutName,
      duration: Math.floor(Math.random() * 60) + 30,
      caloriesBurned: Math.floor(Math.random() * 500) + 200,
      date,
      completed: false,
      type: type as 'strength' | 'cardio' | 'flexibility',
    };

    if (type === 'strength') {
      workout.exercises = [
        {
          name: 'Bench Press',
          sets: 3,
          reps: 12,
          weight: 60,
        },
        {
          name: 'Squats',
          sets: 4,
          reps: 10,
          weight: 80,
        },
      ];
    }

    mockRoutine.workouts.push(workout);
  }

  return mockRoutine;
}; 