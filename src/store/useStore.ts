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
  quality: number;
  notes?: string;
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

export interface Friend {
  id: string;
  name: string;
  score: number;
  avatar: string;
  lastActive: string;
}

export interface DailyScore {
  date: string;
  score: number;
  mealScore: number;
  workoutScore: number;
  sleepScore: number;
}

interface Competition {
  id: number;
  title: string;
  description: string;
  image: string;
  dateRange: string;
  reward: string;
  status: 'active' | 'upcoming' | 'completed';
  type: 'fitness' | 'nutrition' | 'team';
  progress: number;
  joined: boolean;
}

interface HealthStore {
  meals: Meal[];
  workouts: Workout[];
  sleepEntries: SleepEntry[];
  routine: Routine | null;
  questionnaireData: QuestionnaireData | null;
  dailyScores: DailyScore[];
  friends: Friend[];
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
  calculateTodayScore: () => number;
  getTodayScore: () => DailyScore;
  competitions: Competition[];
  joinCompetition: (id: number) => void;
  leaveCompetition: (id: number) => void;
  updateCompetitionProgress: (id: number, progress: number) => void;
}

// Placeholder friend data
const mockFriends: Friend[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    score: 85,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastActive: '2 hours ago',
  },
  {
    id: '2',
    name: 'Michael Chen',
    score: 92,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastActive: '1 day ago',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    score: 78,
    avatar: 'https://randomuser.me/api/portraits/women/66.jpg',
    lastActive: '5 hours ago',
  },
  {
    id: '4',
    name: 'James Thompson',
    score: 65,
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    lastActive: '3 days ago',
  },
  {
    id: '5',
    name: 'Olivia Rodriguez',
    score: 88,
    avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
    lastActive: 'Just now',
  },
];

export const useStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      meals: [],
      workouts: [],
      sleepEntries: [],
      routine: null,
      questionnaireData: null,
      dailyScores: [],
      friends: mockFriends,
      competitions: [],

      addMeal: (meal) =>
        set((state) => {
          const newState = {
            meals: [
              ...state.meals,
              {
                ...meal,
                id: Date.now().toString(),
              },
            ],
          };
          get().calculateTodayScore();
          return newState;
        }),

      deleteMeal: (id) =>
        set((state) => {
          const newState = {
            meals: state.meals.filter((meal) => meal.id !== id),
          };
          get().calculateTodayScore();
          return newState;
        }),

      addWorkout: (workout) =>
        set((state) => {
          const newState = {
            workouts: [
              ...state.workouts,
              {
                ...workout,
                id: Date.now().toString(),
              },
            ],
          };
          get().calculateTodayScore();
          return newState;
        }),

      deleteWorkout: (id) =>
        set((state) => {
          const newState = {
            workouts: state.workouts.filter((workout) => workout.id !== id),
          };
          get().calculateTodayScore();
          return newState;
        }),

      addSleepEntry: (entry) =>
        set((state) => {
          const newState = {
            sleepEntries: [
              ...state.sleepEntries,
              {
                ...entry,
                id: Date.now().toString(),
              },
            ],
          };
          get().calculateTodayScore();
          return newState;
        }),

      deleteSleepEntry: (id) =>
        set((state) => {
          const newState = {
            sleepEntries: state.sleepEntries.filter((entry) => entry.id !== id),
          };
          get().calculateTodayScore();
          return newState;
        }),

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

          const newState = {
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
          
          get().calculateTodayScore();
          return newState;
        }),

      updateWorkoutStatus: (id, completed) =>
        set((state) => {
          const routineWorkout = state.routine?.workouts.find((workout) => workout.id === id);
          if (!routineWorkout) return state;

          const updatedWorkout = { ...routineWorkout, completed };
          const existingWorkout = state.workouts.find((workout) => workout.id === id);

          const newState = {
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
          
          get().calculateTodayScore();
          return newState;
        }),

      calculateTodayScore: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        
        // Calculate meal score
        let mealScore = 0;
        if (state.routine) {
          const todayMeals = state.routine.meals.filter(meal => meal.date === today);
          if (todayMeals.length > 0) {
            const completedMeals = todayMeals.filter(meal => meal.completed).length;
            mealScore = Math.round((completedMeals / todayMeals.length) * 40);
          }
        }
        
        // Calculate workout score
        let workoutScore = 0;
        if (state.routine) {
          const todayWorkouts = state.routine.workouts.filter(workout => workout.date === today);
          if (todayWorkouts.length > 0) {
            const completedWorkouts = todayWorkouts.filter(workout => workout.completed).length;
            workoutScore = Math.round((completedWorkouts / todayWorkouts.length) * 40);
          }
        }
        
        // Calculate sleep score
        let sleepScore = 0;
        const todaySleepEntries = state.sleepEntries.filter(entry => entry.date === today);
        if (todaySleepEntries.length > 0) {
          const qualityAvg = todaySleepEntries.reduce((sum, entry) => sum + entry.quality, 0) / todaySleepEntries.length;
          sleepScore = Math.round((qualityAvg / 10) * 20);
        }
        
        // Calculate total score
        const totalScore = mealScore + workoutScore + sleepScore;
        
        // Update or create today's score
        set((state) => {
          const existingScoreIndex = state.dailyScores.findIndex(score => score.date === today);
          if (existingScoreIndex !== -1) {
            const updatedScores = [...state.dailyScores];
            updatedScores[existingScoreIndex] = {
              date: today,
              score: totalScore,
              mealScore,
              workoutScore,
              sleepScore
            };
            return { dailyScores: updatedScores };
          } else {
            return {
              dailyScores: [
                ...state.dailyScores,
                {
                  date: today,
                  score: totalScore,
                  mealScore,
                  workoutScore,
                  sleepScore
                }
              ]
            };
          }
        });
        
        return totalScore;
      },
      
      getTodayScore: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const score = state.dailyScores.find(score => score.date === today);
        
        if (score) {
          return score;
        }
        
        // If no score exists for today, calculate it
        const totalScore = get().calculateTodayScore();
        return {
          date: today,
          score: totalScore,
          mealScore: 0,
          workoutScore: 0,
          sleepScore: 0
        };
      },

      joinCompetition: (id) =>
        set((state) => ({
          competitions: state.competitions.map((comp) =>
            comp.id === id ? { ...comp, joined: true, progress: 0 } : comp
          ),
        })),

      leaveCompetition: (id) =>
        set((state) => ({
          competitions: state.competitions.map((comp) =>
            comp.id === id ? { ...comp, joined: false, progress: 0 } : comp
          ),
        })),

      updateCompetitionProgress: (id, progress) =>
        set((state) => ({
          competitions: state.competitions.map((comp) =>
            comp.id === id ? { ...comp, progress } : comp
          ),
        })),
    }),
    {
      name: 'health-storage',
    }
  )
); 