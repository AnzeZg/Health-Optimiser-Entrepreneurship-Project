import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Card,
  CardContent,
  Checkbox,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { format, addDays, subDays } from 'date-fns';

interface Meal {
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

const MealTracking: React.FC = (): JSX.Element => {
  const { routine, meals, addMeal, deleteMeal, updateMealStatus } = useStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    category: 'Snacks',
    date: new Date().toISOString().split('T')[0],
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewMeal({
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      category: 'Snacks',
      date: selectedDate,
    });
  };

  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.calories) return;

    addMeal(newMeal as Omit<Meal, 'id'>);
    handleCloseDialog();
  };

  const handleDeleteMeal = (id: string) => {
    deleteMeal(id);
  };

  const totalCalories = meals
    .filter((meal) => meal.date === selectedDate)
    .reduce((sum, meal) => sum + meal.calories, 0);

  const totalProtein = meals
    .filter((meal) => meal.date === selectedDate)
    .reduce((sum, meal) => sum + (meal.protein || 0), 0);

  const totalCarbs = meals
    .filter((meal) => meal.date === selectedDate)
    .reduce((sum, meal) => sum + (meal.carbs || 0), 0);

  const totalFat = meals
    .filter((meal) => meal.date === selectedDate)
    .reduce((sum, meal) => sum + (meal.fat || 0), 0);

  const routineMeals = routine?.meals.filter((meal) => meal.date === selectedDate) || [];
  const customMeals = meals.filter((meal) => meal.date === selectedDate);

  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'MMM dd, yyyy'),
    };
  }).reverse();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Meal Tracking
      </Typography>

      <Grid container spacing={3}>
        {/* Date Selection */}
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Date</InputLabel>
            <Select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              label="Select Date"
            >
              {dateOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Calories
              </Typography>
              <Typography variant="h3" color="primary">
                {totalCalories}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                kcal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Protein
              </Typography>
              <Typography variant="h3" color="primary">
                {totalProtein}g
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Carbs
              </Typography>
              <Typography variant="h3" color="primary">
                {totalCarbs}g
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fat
              </Typography>
              <Typography variant="h3" color="primary">
                {totalFat}g
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Routine Meals */}
        {routineMeals.length > 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Today's Meal Plan
              </Typography>
              <List>
                {routineMeals.map((meal) => (
                  <React.Fragment key={meal.id}>
                    <ListItem>
                      <Checkbox
                        checked={meal.completed}
                        onChange={(e) => updateMealStatus(meal.id, e.target.checked)}
                        sx={{ mr: 2 }}
                      />
                      <ListItemText
                        primary={meal.name}
                        secondary={`${meal.calories} calories • Protein: ${meal.protein}g • Carbs: ${meal.carbs}g • Fat: ${meal.fat}g`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Custom Meals */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Custom Meals</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
              >
                Add Meal
              </Button>
            </Box>

            <List>
              {customMeals.map((meal) => (
                <ListItem key={meal.id}>
                  <ListItemText
                    primary={meal.name}
                    secondary={`${meal.calories} calories • Protein: ${meal.protein}g • Carbs: ${meal.carbs}g • Fat: ${meal.fat}g`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteMeal(meal.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Meal</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Meal Name"
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Calories"
              type="number"
              value={newMeal.calories}
              onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Protein (g)"
              type="number"
              value={newMeal.protein}
              onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Carbs (g)"
              type="number"
              value={newMeal.carbs}
              onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Fat (g)"
              type="number"
              value={newMeal.fat}
              onChange={(e) => setNewMeal({ ...newMeal, fat: Number(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newMeal.category}
                onChange={(e) => setNewMeal({ ...newMeal, category: e.target.value })}
                label="Category"
              >
                <MenuItem value="Breakfast">Breakfast</MenuItem>
                <MenuItem value="Lunch">Lunch</MenuItem>
                <MenuItem value="Dinner">Dinner</MenuItem>
                <MenuItem value="Snacks">Snacks</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddMeal} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MealTracking; 