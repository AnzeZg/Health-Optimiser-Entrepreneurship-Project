import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type DietType = 'none' | 'vegetarian' | 'vegan' | 'keto' | 'mediterranean';
export type WellnessGoal = 'lose_weight' | 'build_muscle' | 'reduce_stress' | 'improve_sleep' | 'boost_energy';
export type WellnessArea = 'nutrition' | 'fitness' | 'mental_health' | 'sleep' | 'habit_tracking';
export type TimePreference = 'morning' | 'afternoon' | 'evening' | 'no_preference';
export type TimeDedication = '15min' | '30min' | '45min' | '1hour';

export interface GeneralInfo {
  age: number;
  biologicalSex: 'male' | 'female' | 'prefer_not_to_say';
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  medicalLimitations: string[];
  dietType: DietType;
}

export interface WellnessPreferences {
  mainGoal: WellnessGoal;
  focusAreas: WellnessArea[];
  timeDedication: TimeDedication;
  preferredTime: TimePreference;
  participateInChallenges: boolean;
  wantReminders: boolean;
}

export interface QuestionnaireData {
  generalInfo: GeneralInfo;
  wellnessPreferences: WellnessPreferences;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  category: string;
  date: string;
  completed?: boolean;
}

export interface Workout {
  id: string;
  name: string;
  duration: number;
  caloriesBurned?: number;
  date: string;
  completed?: boolean;
  type: 'strength' | 'cardio' | 'flexibility';
  exercises?: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }[];
}

export interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality?: number;
}

export interface Routine {
  id: string;
  startDate: string;
  endDate: string;
  meals: Meal[];
  workouts: Workout[];
  sleepSchedule: {
    bedtime: string;
    wakeTime: string;
    duration: number;
  };
}

interface HealthStore {
  meals: Meal[];
  workouts: Workout[];
  sleepEntries: SleepEntry[];
  routine: Routine | null;
  questionnaireData: QuestionnaireData | null;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  deleteMeal: (id: string) => void;
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  deleteWorkout: (id: string) => void;
  addSleepEntry: (entry: Omit<SleepEntry, 'id'>) => void;
  deleteSleepEntry: (id: string) => void;
  setRoutine: (routine: Routine | null) => void;
  setQuestionnaireData: (data: QuestionnaireData) => void;
  updateMealStatus: (id: string, completed: boolean) => void;
  updateWorkoutStatus: (id: string, completed: boolean) => void;
}

export const useStore = create<HealthStore>()(
  persist(
    (set) => ({
      meals: [],
      workouts: [],
      sleepEntries: [],
      routine: null,
      questionnaireData: null,

      addMeal: (meal) =>
        set((state) => ({
          meals: [
            ...state.meals,
            {
              ...meal,
              id: Date.now().toString(),
            },
          ],
        })),

      deleteMeal: (id) =>
        set((state) => ({
          meals: state.meals.filter((meal) => meal.id !== id),
        })),

      addWorkout: (workout) =>
        set((state) => ({
          workouts: [
            ...state.workouts,
            {
              ...workout,
              id: Date.now().toString(),
            },
          ],
        })),

      deleteWorkout: (id) =>
        set((state) => ({
          workouts: state.workouts.filter((workout) => workout.id !== id),
        })),

      addSleepEntry: (entry) =>
        set((state) => ({
          sleepEntries: [
            ...state.sleepEntries,
            {
              ...entry,
              id: Date.now().toString(),
            },
          ],
        })),

      deleteSleepEntry: (id) =>
        set((state) => ({
          sleepEntries: state.sleepEntries.filter((entry) => entry.id !== id),
        })),

      setRoutine: (routine) =>
        set(() => ({
          routine,
        })),

      setQuestionnaireData: (data) =>
        set(() => ({
          questionnaireData: data,
        })),

      updateMealStatus: (id, completed) =>
        set((state) => {
          const routineMeal = state.routine?.meals.find((meal) => meal.id === id);
          if (!routineMeal) return state;

          const updatedMeal = { ...routineMeal, completed };
          const existingMeal = state.meals.find((meal) => meal.id === id);

          return {
            meals: existingMeal
              ? state.meals.map((meal) => (meal.id === id ? updatedMeal : meal))
              : [...state.meals, updatedMeal],
            routine: state.routine
              ? {
                  ...state.routine,
                  meals: state.routine.meals.map((meal) =>
                    meal.id === id ? updatedMeal : meal
                  ),
                }
              : null,
          };
        }),

      updateWorkoutStatus: (id, completed) =>
        set((state) => {
          const routineWorkout = state.routine?.workouts.find((workout) => workout.id === id);
          if (!routineWorkout) return state;

          const updatedWorkout = { ...routineWorkout, completed };
          const existingWorkout = state.workouts.find((workout) => workout.id === id);

          return {
            workouts: existingWorkout
              ? state.workouts.map((workout) => (workout.id === id ? updatedWorkout : workout))
              : [...state.workouts, updatedWorkout],
            routine: state.routine
              ? {
                  ...state.routine,
                  workouts: state.routine.workouts.map((workout) =>
                    workout.id === id ? updatedWorkout : workout
                  ),
                }
              : null,
          };
        }),
    }),
    {
      name: 'health-storage',
    }
  )
); 