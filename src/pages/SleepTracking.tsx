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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Rating,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { format, addDays, subDays } from 'date-fns';

interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes: string;
}

const SleepTracking: React.FC = (): JSX.Element => {
  const { routine, sleepEntries, addSleepEntry, deleteSleepEntry } = useStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEntry, setNewEntry] = useState<Partial<SleepEntry>>({
    date: new Date().toISOString().split('T')[0],
    bedtime: '',
    wakeTime: '',
    duration: 8,
    quality: 5,
    notes: '',
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewEntry({
      date: selectedDate,
      bedtime: '',
      wakeTime: '',
      duration: 8,
      quality: 5,
      notes: '',
    });
  };

  const handleAddEntry = () => {
    if (!newEntry.bedtime || !newEntry.wakeTime) return;

    addSleepEntry(newEntry as Omit<SleepEntry, 'id'>);
    handleCloseDialog();
  };

  const handleDeleteEntry = (id: string) => {
    deleteSleepEntry(id);
  };

  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'MMM dd, yyyy'),
    };
  }).reverse();

  const averageDuration = sleepEntries.length > 0
    ? sleepEntries.reduce((sum, entry) => sum + entry.duration, 0) / sleepEntries.length
    : 0;

  const averageQuality = sleepEntries.length > 0
    ? sleepEntries.reduce((sum, entry) => sum + entry.quality, 0) / sleepEntries.length
    : 0;

  const routineSleep = routine?.sleepSchedule;
  const entriesForSelectedDate = sleepEntries.filter(entry => entry.date === selectedDate);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sleep Tracking
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
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Sleep Duration
              </Typography>
              <Typography variant="h3" color="primary">
                {averageDuration.toFixed(1)}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Sleep Quality
              </Typography>
              <Rating value={averageQuality} readOnly precision={0.5} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sleep Streak
              </Typography>
              <Typography variant="h3" color="primary">
                {sleepEntries.length} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommended Sleep Schedule */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recommended Sleep Schedule
            </Typography>
            {routineSleep ? (
              <Box>
                <Typography>
                  Bedtime: {routineSleep.bedtime}
                </Typography>
                <Typography>
                  Wake Time: {routineSleep.wakeTime}
                </Typography>
                <Typography>
                  Target Duration: {routineSleep.duration} hours
                </Typography>
              </Box>
            ) : (
              <Typography color="text.secondary">
                No sleep schedule available. Set up your routine in the Calendar page to see your recommended sleep schedule.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Sleep Entries */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Sleep Log</Typography>
              <Button
                variant="contained"
                onClick={handleOpenDialog}
              >
                Log Sleep
              </Button>
            </Box>

            <List>
              {entriesForSelectedDate.map((entry) => (
                <ListItem key={entry.id}>
                  <ListItemText
                    primary={`${entry.bedtime} - ${entry.wakeTime}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Duration: {entry.duration} hours
                        </Typography>
                        <br />
                        <Rating value={entry.quality} readOnly size="small" />
                        {entry.notes && (
                          <>
                            <br />
                            <Typography component="span" variant="body2">
                              Notes: {entry.notes}
                            </Typography>
                          </>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteEntry(entry.id)}
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
        <DialogTitle>Log Sleep</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Bedtime"
              type="time"
              value={newEntry.bedtime}
              onChange={(e) => setNewEntry({ ...newEntry, bedtime: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Wake Time"
              type="time"
              value={newEntry.wakeTime}
              onChange={(e) => setNewEntry({ ...newEntry, wakeTime: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <Typography gutterBottom>Duration (hours)</Typography>
            <Slider
              value={newEntry.duration}
              onChange={(_, value) => setNewEntry({ ...newEntry, duration: value as number })}
              min={1}
              max={12}
              step={0.5}
              marks
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
            <Typography gutterBottom>Sleep Quality</Typography>
            <Rating
              value={newEntry.quality}
              onChange={(_, value) => setNewEntry({ ...newEntry, quality: value as number })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddEntry} variant="contained">
            Log
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SleepTracking; 