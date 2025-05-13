# Health Optimizer

A React-based web application for tracking and optimizing your health metrics. This application allows users to monitor their workouts, meals, and sleep patterns while providing insights through an intuitive dashboard.

## Features

- **Dashboard**: Overview of recent health stats and trends
- **Meal Tracking**: Log meals with nutritional information
- **Workout Logging**: Track exercises and calories burned
- **Sleep Tracking**: Monitor sleep patterns and quality
- **Data Visualization**: Charts and graphs for health metrics
- **Responsive Design**: Mobile-friendly interface
- **Luna Chatbot**: AI-powered assistant for personalized health advice and workout plans
- **Multi-Section Workout Questionnaire**: Comprehensive questionnaire to generate personalized workout plans

## Technology Stack

- React with TypeScript
- Material-UI for components
- Recharts for data visualization
- Zustand for state management
- Local Storage for data persistence
- OpenAI API for Luna chatbot integration

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/health-optimizer.git
cd health-optimizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── store/         # Zustand store configuration
├── App.tsx        # Main application component
└── main.tsx       # Application entry point
```

## Features in Detail

### Dashboard
- Recent exercise summary
- Daily calorie intake
- Macronutrient breakdown
- Weekly calorie trends

### Meal Tracking
- Categorized meal logging (Breakfast, Lunch, Dinner, Snacks)
- Nutritional information tracking
- Daily calorie totals per category

### Workout Logging
- Exercise duration tracking
- Calories burned calculation
- Workout history
- Daily exercise summary

### Sleep Tracking
- Sleep duration monitoring
- Sleep quality assessment
- Sleep pattern visualization
- Weekly sleep trends

### Luna Chatbot
- AI-powered assistant for personalized health advice
- Conversational interface for workout plan generation
- Integration with OpenAI API

### Multi-Section Workout Questionnaire
- Comprehensive questionnaire covering fitness goals, schedule, background, equipment, nutrition, health, motivation, and progress tracking
- Personalized workout plan generation based on user responses

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the component library
- Recharts for the visualization library
- Zustand for state management
- OpenAI for Luna chatbot integration 