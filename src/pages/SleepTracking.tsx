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
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality?: number;
}

const SleepTracking: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<SleepEntry>>({
    date: new Date().toISOString().split('T')[0],
    bedtime: '',
    wakeTime: '',
    duration: 0,
    quality: 5,
  });
  const [entries, setEntries] = useState<SleepEntry[]>([]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      bedtime: '',
      wakeTime: '',
      duration: 0,
      quality: 5,
    });
  };

  const handleAddEntry = () => {
    if (!newEntry.date || !newEntry.bedtime || !newEntry.wakeTime) return;

    const entryWithId = {
      ...newEntry,
      id: Date.now().toString(),
    } as SleepEntry;

    setEntries([entryWithId, ...entries]);
    handleCloseDialog();
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(entries.filter((entry) => entry.id !== entryId));
  };

  const averageDuration = entries.length > 0
    ? entries.reduce((sum, entry) => sum + entry.duration, 0) / entries.length
    : 0;

  const averageQuality = entries.length > 0
    ? entries.reduce((sum, entry) => sum + (entry.quality || 0), 0) / entries.length
    : 0;

  // Prepare data for the chart
  const chartData = entries
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      date: entry.date,
      duration: entry.duration,
      quality: entry.quality,
    }));

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sleep Tracking
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Sleep Duration
              </Typography>
              <Typography variant="h3" color="primary">
                {averageDuration.toFixed(1)} hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Average Sleep Quality
              </Typography>
              <Typography variant="h3" color="primary">
                {averageQuality.toFixed(1)}/10
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Sleep Trends Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sleep Trends
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="duration"
                    stroke="#2196f3"
                    name="Duration (hours)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="quality"
                    stroke="#f50057"
                    name="Quality (/10)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Sleep History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Sleep History</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
              >
                Add Entry
              </Button>
            </Box>

            <List>
              {entries.map((entry) => (
                <ListItem key={entry.id}>
                  <ListItemText
                    primary={`${entry.date}`}
                    secondary={`Bedtime: ${entry.bedtime} • Wake Time: ${entry.wakeTime} • Duration: ${entry.duration} hours • Quality: ${entry.quality}/10`}
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
        <DialogTitle>Add Sleep Entry</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Bedtime"
              type="time"
              value={newEntry.bedtime}
              onChange={(e) => setNewEntry({ ...newEntry, bedtime: e.target.value })}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Wake Time"
              type="time"
              value={newEntry.wakeTime}
              onChange={(e) => setNewEntry({ ...newEntry, wakeTime: e.target.value })}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Duration (hours)"
              type="number"
              value={newEntry.duration}
              onChange={(e) => setNewEntry({ ...newEntry, duration: Number(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Sleep Quality (1-10)"
              type="number"
              value={newEntry.quality}
              onChange={(e) => setNewEntry({ ...newEntry, quality: Number(e.target.value) })}
              inputProps={{ min: 1, max: 10 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddEntry} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SleepTracking; 