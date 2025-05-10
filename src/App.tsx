import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MealTracking from './pages/MealTracking';
import WorkoutLogging from './pages/WorkoutLogging';
import SleepTracking from './pages/SleepTracking';
import Calendar from './pages/Calendar';
import ChatbotPage from './pages/ChatbotPage';
import WorkoutQuestionnairePage from './pages/WorkoutQuestionnairePage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/meals" element={<MealTracking />} />
            <Route path="/workouts" element={<WorkoutLogging />} />
            <Route path="/sleep" element={<SleepTracking />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/chat" element={<ChatbotPage />} />
            <Route path="/workout-plan" element={<WorkoutQuestionnairePage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App; 