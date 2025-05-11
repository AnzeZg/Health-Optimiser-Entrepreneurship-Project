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
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import StarIcon from '@mui/icons-material/Star';
import TimelineIcon from '@mui/icons-material/Timeline';

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
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
      py: 4,
      px: { xs: 1, sm: 3 },
    }}>
      <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, mb: 4, background: 'rgba(255,255,255,0.95)' }}>
        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
          <BedtimeIcon color="primary" fontSize="large" />
          <Typography variant="h4" fontWeight={700}>Sleep Tracking</Typography>
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
          <Grid container spacing={3}>
            {/* Summary Cards */}
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 4, boxShadow: 3, bgcolor: '#e3f2fd' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BedtimeIcon color="primary" />
                    <Typography variant="h6" fontWeight={600} gutterBottom>Average Sleep Duration</Typography>
                  </Box>
                  <Typography variant="h3" color="primary">{averageDuration.toFixed(1)}h</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 4, boxShadow: 3, bgcolor: '#fce4ec' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon color="secondary" />
                    <Typography variant="h6" fontWeight={600} gutterBottom>Average Sleep Quality</Typography>
                  </Box>
                  <Rating value={averageQuality} readOnly precision={0.5} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderRadius: 4, boxShadow: 3, bgcolor: '#ede7f6' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimelineIcon color="primary" />
                    <Typography variant="h6" fontWeight={600} gutterBottom>Sleep Streak</Typography>
                  </Box>
                  <Typography variant="h3" color="primary">{sleepEntries.length} days</Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Recommended Sleep Schedule */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 2, background: 'rgba(227,242,253,0.5)' }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BedtimeIcon color="primary" /> Recommended Sleep Schedule
                </Typography>
                {routineSleep ? (
                  <Box>
                    <Typography>Bedtime: {routineSleep.bedtime}</Typography>
                    <Typography>Wake Time: {routineSleep.wakeTime}</Typography>
                    <Typography>Target Duration: {routineSleep.duration} hours</Typography>
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
              <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 2, background: 'rgba(252,228,236,0.5)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimelineIcon color="primary" /> Sleep Log
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleOpenDialog}
                    sx={{ borderRadius: 3, px: 3, fontWeight: 600, boxShadow: 2, background: 'linear-gradient(90deg, #42a5f5 0%, #ab47bc 100%)' }}
                  >
                    Log Sleep
                  </Button>
                </Box>
                <List>
                  {entriesForSelectedDate.map((entry) => (
                    <ListItem key={entry.id} sx={{ borderRadius: 2, mb: 1, bgcolor: '#fffde7' }}>
                      <ListItemText
                        primary={<Typography fontWeight={600}>{entry.bedtime} - {entry.wakeTime}</Typography>}
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
      </Paper>
    </Box>
  );
};

export default SleepTracking; 