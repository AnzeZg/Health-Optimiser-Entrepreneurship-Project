import React from 'react';
import {
  Box, Grid, Paper, Typography, Card, CardContent, Avatar, Button, Divider, Chip, Tooltip, Fade
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import OpacityIcon from '@mui/icons-material/Opacity';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TopNavBar from '../components/TopNavBar';

const Dashboard: React.FC = () => {
  // Replace with real data in production
  const user = { name: "Alex", avatar: "" };
  const cholesterol = 150;
  const cholesterolLimit = 200;
  const cholesterolPercent = Math.round((cholesterol / cholesterolLimit) * 100);
  const steps = 8200;
  const workoutKcal = 450;
  const mentalHealthScore = 78;
  const weight = 68;
  const nextCheckup = '28 Feb 2025';
  const hydration = '3.5L / day';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6fa', p: { xs: 1, md: 4 } }}>
      <TopNavBar />
      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Vital Stats */}
        <Grid item xs={12} md={4}>
          <Fade in timeout={800}>
            <Card sx={{
              borderRadius: 4, boxShadow: 3,
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              color: 'white', p: 2, minHeight: 320,
              position: 'relative', overflow: 'hidden'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Vital Stats</Typography>
                  <Chip label="Cholesterol" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} />
                </Box>
                <Typography variant="h3" fontWeight={700}>
                  {cholesterol}/{cholesterolLimit}
                  <Typography component="span" variant="h6">mg/dL</Typography>
                </Typography>
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Box sx={{ width: '100%', height: 8, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 4 }}>
                    <Box sx={{
                      width: `${cholesterolPercent}%`, height: 8,
                      bgcolor: '#90caf9', borderRadius: 4,
                      transition: 'width 1s cubic-bezier(.4,0,.2,1)'
                    }} />
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Cholesterol level: <Chip label="Normal" size="small" color="success" />
                </Typography>
                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                <Typography variant="h6">{cholesterolPercent}%</Typography>
                <Typography variant="body2">of the healthy limit</Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarMonthIcon sx={{ mr: 1, color: '#fff' }} />
                    <Typography variant="body2">Next check-up: <b>{nextCheckup}</b></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <OpacityIcon sx={{ mr: 1, color: '#fff' }} />
                    <Typography variant="body2">Hydrated: <b>{hydration}</b></Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        {/* My Activity */}
        <Grid item xs={12} md={8}>
          <Fade in timeout={1000}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2, minHeight: 320 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#ede7f6', color: '#7e57c2', mr: 2 }}>
                    <DirectionsWalkIcon />
                  </Avatar>
                  <Typography variant="h6">My Activity</Typography>
                  <Button size="small" sx={{ ml: 2, borderRadius: 8 }}>All Activity</Button>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Tooltip title="Steps taken today" arrow>
                      <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#f3f6fd', textAlign: 'center', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}>
                        <Typography variant="subtitle2">Today's Steps</Typography>
                        <Typography variant="h5" fontWeight={700}>{steps.toLocaleString()}</Typography>
                        <Typography variant="caption">45 min</Typography>
                      </Paper>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Tooltip title="Workout type: HIIT" arrow>
                      <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#f3f6fd', textAlign: 'center', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}>
                        <Typography variant="subtitle2">Workout</Typography>
                        <Typography variant="h5" fontWeight={700}>HIIT</Typography>
                        <Typography variant="caption">30 min</Typography>
                      </Paper>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Tooltip title="Calories burned during workout" arrow>
                      <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#f3f6fd', textAlign: 'center', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}>
                        <Typography variant="subtitle2">Calories Burned</Typography>
                        <Typography variant="h5" fontWeight={700}>{workoutKcal}</Typography>
                        <Typography variant="caption">Kcal burned</Typography>
                      </Paper>
                    </Tooltip>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        {/* Mental Health Score */}
        <Grid item xs={12} md={4}>
          <Fade in timeout={1200}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2, minHeight: 220 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Mental Health Score</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ position: 'relative', width: 120, height: 120, mb: 1 }}>
                    <svg width="120" height="120">
                      <circle cx="60" cy="60" r="54" stroke="#e3e3e3" strokeWidth="12" fill="none" />
                      <circle cx="60" cy="60" r="54" stroke="#42a5f5" strokeWidth="12" fill="none"
                        strokeDasharray={339.292}
                        strokeDashoffset={339.292 - (339.292 * mentalHealthScore) / 100}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
                      />
                    </svg>
                    <Typography variant="h3" sx={{
                      position: 'absolute', top: 38, left: 0, width: '100%',
                      textAlign: 'center', fontWeight: 700
                    }}>{mentalHealthScore}</Typography>
                  </Box>
                  <Typography variant="body2">Mental Health Score</Typography>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        {/* Body Composition */}
        <Grid item xs={12} md={4}>
          <Fade in timeout={1400}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2, minHeight: 220 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Body Composition</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#ffe0b2', color: '#fb8c00', width: 56, height: 56, mb: 1 }}>
                    <FitnessCenterIcon />
                  </Avatar>
                  <Typography variant="h4" fontWeight={700}>{weight} <Typography component="span" variant="h6">kg</Typography></Typography>
                  <Typography variant="body2">Your weight is within the healthy range</Typography>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
        {/* Call to Action */}
        <Grid item xs={12} md={4}>
          <Fade in timeout={1600}>
            <Card sx={{
              borderRadius: 4, boxShadow: 3, p: 2, minHeight: 220,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #2196f3 0%, #e3f2fd 100%)'
            }}>
              <CardContent sx={{ textAlign: 'center', color: '#fff' }}>
                <EmojiEventsIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6">Set and Achieve Your Health Goals!</Typography>
                <Button variant="contained" color="secondary" sx={{ mt: 2, borderRadius: 8 }}>Get Started</Button>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 