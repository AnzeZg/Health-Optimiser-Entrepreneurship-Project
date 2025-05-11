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
import { Add as AddIcon, Delete as DeleteIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { format, addDays, subDays } from 'date-fns';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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
  videoUrl?: string;
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
  const [videoDialog, setVideoDialog] = useState<{ open: boolean; url: string | null }>({ open: false, url: null });

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

  const handleVideoClick = (videoUrl: string) => {
    setVideoDialog({ open: true, url: videoUrl });
  };

  const handleCloseVideoDialog = () => {
    setVideoDialog({ open: false, url: null });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
        py: 4,
        px: { xs: 1, sm: 3 },
      }}>
        <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, mb: 4, background: 'rgba(255,255,255,0.95)' }}>
          {/* Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
            <RestaurantIcon color="primary" fontSize="large" />
            <Typography variant="h4" fontWeight={700}>Meal Tracking</Typography>
          </Box>
          <Grid container spacing={4}>
            {/* Calendar at the top */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4, ml: { xs: 0, sm: 2 } }}>
              <Paper sx={{
                p: 2,
                borderRadius: 4,
                boxShadow: 4,
                bgcolor: '#e3f2fd',
                border: '1.5px solid #90caf9',
                width: { xs: '100%', sm: 400 },
                maxWidth: 440,
                overflow: 'hidden',
                position: 'relative',
              }}>
                <DateCalendar
                  value={new Date(selectedDate)}
                  onChange={(date) => date && setSelectedDate(date.toISOString().split('T')[0])}
                  sx={{ bgcolor: 'transparent', borderRadius: 2 }}
                />
              </Paper>
            </Box>
            {/* Main content below calendar */}
            <Grid container spacing={4}>
              {/* Summary Cards */}
              <Grid item xs={12} md={3}>
                <Card sx={{ borderRadius: 4, boxShadow: 3, bgcolor: '#fffde7' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmojiFoodBeverageIcon color="primary" />
                      <Typography variant="h6" fontWeight={600} gutterBottom>Total Calories</Typography>
                    </Box>
                    <Typography variant="h3" color="primary">{totalCalories}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">kcal</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ borderRadius: 4, boxShadow: 3, bgcolor: '#e3f2fd' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalDiningIcon color="primary" />
                      <Typography variant="h6" fontWeight={600} gutterBottom>Protein</Typography>
                    </Box>
                    <Typography variant="h3" color="primary">{totalProtein}g</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ borderRadius: 4, boxShadow: 3, bgcolor: '#fce4ec' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalDiningIcon color="secondary" />
                      <Typography variant="h6" fontWeight={600} gutterBottom>Carbs</Typography>
                    </Box>
                    <Typography variant="h3" color="primary">{totalCarbs}g</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ borderRadius: 4, boxShadow: 3, bgcolor: '#e1bee7' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalDiningIcon color="secondary" />
                      <Typography variant="h6" fontWeight={600} gutterBottom>Fat</Typography>
                    </Box>
                    <Typography variant="h3" color="primary">{totalFat}g</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Routine Meals */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 2, background: 'rgba(227,242,253,0.5)' }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiFoodBeverageIcon color="secondary" /> Today's Meal Plan
                  </Typography>
                  {routineMeals.length > 0 ? (
                    <List>
                      {routineMeals.map((meal) => (
                        <React.Fragment key={meal.id}>
                          <ListItem sx={{ borderRadius: 2, mb: 1, bgcolor: '#f3e5f5', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Box sx={{ width: '100%' }}>
                              <Checkbox
                                checked={meal.completed}
                                onChange={(e) => updateMealStatus(meal.id, e.target.checked)}
                                sx={{ mr: 2 }}
                              />
                              <ListItemText
                                primary={<Typography fontWeight={600}>{meal.name}</Typography>}
                                secondary={`${meal.calories} calories • Protein: ${meal.protein}g • Carbs: ${meal.carbs}g • Fat: ${meal.fat}g`}
                              />
                            </Box>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary" align="center">
                      No meals planned for this day. Set up your routine in the Calendar page to see your meal plan.
                    </Typography>
                  )}
                </Paper>
              </Grid>

              {/* Custom Meals */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 2, background: 'rgba(252,228,236,0.5)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalDiningIcon color="primary" /> Custom Meals
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleOpenDialog}
                      sx={{ borderRadius: 3, px: 3, fontWeight: 600, boxShadow: 2, background: 'linear-gradient(90deg, #42a5f5 0%, #ab47bc 100%)' }}
                    >
                      Add Meal
                    </Button>
                  </Box>
                  <List>
                    {customMeals.map((meal) => (
                      <ListItem key={meal.id} sx={{ borderRadius: 2, mb: 1, bgcolor: '#fffde7' }}>
                        <ListItemText
                          primary={<Typography fontWeight={600}>{meal.name}</Typography>}
                          secondary={`${meal.calories} calories • Protein: ${meal.protein}g • Carbs: ${meal.carbs}g • Fat: ${meal.fat}g`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteMeal(meal.id)}
                            sx={{ color: 'error.main' }}
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
          </Grid>
        </Paper>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Add New Meal</DialogTitle>
          <DialogContent sx={{ p: 3, background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)' }}>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Meal Name"
                value={newMeal.name}
                onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                sx={{ mb: 2, background: '#fff', borderRadius: 2 }}
              />
              <TextField
                fullWidth
                label="Calories"
                type="number"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
                sx={{ mb: 2, background: '#fff', borderRadius: 2 }}
              />
              <TextField
                fullWidth
                label="Protein (g)"
                type="number"
                value={newMeal.protein}
                onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
                sx={{ mb: 2, background: '#fff', borderRadius: 2 }}
              />
              <TextField
                fullWidth
                label="Carbs (g)"
                type="number"
                value={newMeal.carbs}
                onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
                sx={{ mb: 2, background: '#fff', borderRadius: 2 }}
              />
              <TextField
                fullWidth
                label="Fat (g)"
                type="number"
                value={newMeal.fat}
                onChange={(e) => setNewMeal({ ...newMeal, fat: Number(e.target.value) })}
                sx={{ mb: 2, background: '#fff', borderRadius: 2 }}
              />
              <FormControl fullWidth sx={{ background: '#fff', borderRadius: 2 }}>
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

        {/* Video Dialog */}
        <Dialog
          open={videoDialog.open}
          onClose={handleCloseVideoDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogContent>
            {videoDialog.url && (
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                  src={`https://www.youtube.com/embed/${videoDialog.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default MealTracking; 