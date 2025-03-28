import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  deleteMeal: (id: string) => void;
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  deleteWorkout: (id: string) => void;
  addSleepEntry: (entry: Omit<SleepEntry, 'id'>) => void;
  deleteSleepEntry: (id: string) => void;
  setRoutine: (routine: Routine) => void;
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

      updateMealStatus: (id, completed) =>
        set((state) => ({
          meals: state.meals.map((meal) =>
            meal.id === id ? { ...meal, completed } : meal
          ),
        })),

      updateWorkoutStatus: (id, completed) =>
        set((state) => ({
          workouts: state.workouts.map((workout) =>
            workout.id === id ? { ...workout, completed } : workout
          ),
        })),
    }),
    {
      name: 'health-storage',
    }
  )
); 