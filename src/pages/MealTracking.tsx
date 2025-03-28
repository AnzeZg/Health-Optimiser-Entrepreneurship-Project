import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
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
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface MealCategory {
  name: string;
  meals: Meal[];
  totalCalories: number;
}

const MealTracking: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const [categories, setCategories] = useState<MealCategory[]>([
    {
      name: 'Breakfast',
      meals: [],
      totalCalories: 0,
    },
    {
      name: 'Lunch',
      meals: [],
      totalCalories: 0,
    },
    {
      name: 'Dinner',
      meals: [],
      totalCalories: 0,
    },
    {
      name: 'Snacks',
      meals: [],
      totalCalories: 0,
    },
  ]);

  const handleOpenDialog = (category: string) => {
    setSelectedCategory(category);
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
    });
  };

  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.calories) return;

    const updatedCategories = categories.map((category) => {
      if (category.name === selectedCategory) {
        const newMealWithId = {
          ...newMeal,
          id: Date.now().toString(),
        } as Meal;
        return {
          ...category,
          meals: [...category.meals, newMealWithId],
          totalCalories: category.totalCalories + newMealWithId.calories,
        };
      }
      return category;
    });

    setCategories(updatedCategories);
    handleCloseDialog();
  };

  const handleDeleteMeal = (categoryName: string, mealId: string) => {
    const updatedCategories = categories.map((category) => {
      if (category.name === categoryName) {
        const mealToDelete = category.meals.find((meal) => meal.id === mealId);
        return {
          ...category,
          meals: category.meals.filter((meal) => meal.id !== mealId),
          totalCalories: category.totalCalories - (mealToDelete?.calories || 0),
        };
      }
      return category;
    });

    setCategories(updatedCategories);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Meal Tracking
      </Typography>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} md={6} key={category.name}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{category.name}</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog(category.name)}
                >
                  Add Meal
                </Button>
              </Box>

              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Total Calories: {category.totalCalories}
              </Typography>

              <List>
                {category.meals.map((meal) => (
                  <ListItem key={meal.id}>
                    <ListItemText
                      primary={meal.name}
                      secondary={`${meal.calories} calories • Protein: ${meal.protein}g • Carbs: ${meal.carbs}g • Fat: ${meal.fat}g`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteMeal(category.name, meal.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        ))}
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
            />
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