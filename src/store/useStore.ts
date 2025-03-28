import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  category: string;
  date: string;
}

interface Workout {
  id: string;
  name: string;
  duration: number;
  caloriesBurned?: number;
  date: string;
}

interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality?: number;
}

interface HealthStore {
  meals: Meal[];
  workouts: Workout[];
  sleepEntries: SleepEntry[];
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  deleteMeal: (id: string) => void;
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  deleteWorkout: (id: string) => void;
  addSleepEntry: (entry: Omit<SleepEntry, 'id'>) => void;
  deleteSleepEntry: (id: string) => void;
}

export const useStore = create<HealthStore>()(
  persist(
    (set) => ({
      meals: [],
      workouts: [],
      sleepEntries: [],

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
    }),
    {
      name: 'health-storage',
    }
  )
); 