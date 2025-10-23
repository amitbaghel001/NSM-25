import React, { useState } from 'react';
import {
  Container, Typography, Button, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Grid, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert, CircularProgress, Divider
} from '@mui/material';
import { 
  CalendarMonth, AutoAwesome, Schedule as ScheduleIcon,
  TrendingUp, DateRange, Assessment
} from '@mui/icons-material';
import API from '../api/axios';

const Scheduling = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoScheduleDialog, setAutoScheduleDialog] = useState(false);
  const [scheduleParams, setScheduleParams] = useState({
    startDate: new Date().toISOString().split('T')[0],
    days: 7
  });
  const [stats, setStats] = useState({
    totalUnscheduled: 0,
    willBeScheduled: 0
  });

  const generateAutoSchedule = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/scheduling/auto-schedule', {
        params: scheduleParams
      });
      
      setSchedule(data.schedule || []);
      setStats({
        totalUnscheduled: data.totalCases || 0,
        willBeScheduled: data.scheduledCases || 0
      });
      
      setAutoScheduleDialog(false);
      
      if (data.schedule && data.schedule.length > 0) {
        alert(`Generated schedule for ${data.scheduledCases} cases!`);
      } else {
        alert('No unscheduled cases found.');
      }
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const applySchedule = async () => {
    if (schedule.length === 0) return;
    if (!window.confirm(`Apply schedule for ${schedule.length} cases?`)) return;
    
    setLoading(true);
    try {
      const { data } = await API.post('/scheduling/apply-schedule', { schedule });
      alert(data.message);
      setSchedule([]);
      setStats({ totalUnscheduled: 0, willBeScheduled: 0 });
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };

  const groupByDate = (scheduleArray) => {
    const grouped = {};
    scheduleArray.forEach(item => {
      const dateKey = new Date(item.date).toLocaleDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(item);
    });
    return grouped;
  };

  const groupedSchedule = groupByDate(schedule);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarMonth sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
            AI-Powered Case Scheduling
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Automatically prioritize and schedule cases using AI algorithms
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<AutoAwesome />}
          onClick={() => setAutoScheduleDialog(true)}
          disabled={loading}
          sx={{ px: 4, py: 1.5 }}
        >
          Generate AI Schedule
        </Button>
      </Box>

      {/* Stats Cards */}
      {schedule.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Total Unscheduled Cases
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {stats.totalUnscheduled}
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 60, color: 'primary.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Will Be Scheduled
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="success.main">
                      {stats.willBeScheduled}
                    </Typography>
                  </Box>
                  <DateRange sx={{ fontSize: 60, color: 'success.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      Remaining Backlog
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="error.main">
                      {stats.totalUnscheduled - stats.willBeScheduled}
                    </Typography>
                  </Box>
                  <Assessment sx={{ fontSize: 60, color: 'error.main', opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Success Alert */}
      {schedule.length > 0 && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body1" fontWeight="bold">
                AI has generated an optimized schedule for {schedule.length} cases
              </Typography>
              <Typography variant="body2">
                Cases are prioritized based on age, severity, and complexity
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              onClick={applySchedule}
              disabled={loading}
              color="success"
              sx={{ ml: 2 }}
            >
              Apply This Schedule
            </Button>
          </Box>
        </Alert>
      )}

      {/* Schedule Tables */}
      {schedule.length > 0 ? (
        Object.keys(groupedSchedule).map((dateKey) => (
          <Paper key={dateKey} sx={{ mb: 3, boxShadow: 3 }}>
            <Box sx={{ p: 2, backgroundColor: 'primary.main', color: 'white' }}>
              <Typography variant="h6" fontWeight="bold">
                <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                {dateKey}
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Time</strong></TableCell>
                    <TableCell><strong>Case Number</strong></TableCell>
                    <TableCell><strong>Title</strong></TableCell>
                    <TableCell><strong>Court Room</strong></TableCell>
                    <TableCell><strong>Priority</strong></TableCell>
                    <TableCell><strong>AI Score</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedSchedule[dateKey].map((item, index) => (
                    <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: '#f0f7ff' } }}>
                      <TableCell><Typography fontWeight="bold" color="primary">{item.time}</Typography></TableCell>
                      <TableCell>{item.caseNumber}</TableCell>
                      <TableCell>{item.title.substring(0, 60)}...</TableCell>
                      <TableCell>
                        <Chip label={item.courtRoom} size="small" variant="outlined" color="primary" />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.priority.toUpperCase()} 
                          color={getPriorityColor(item.priority)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={item.priorityScore} color="info" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        ))
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', boxShadow: 3 }}>
          <ScheduleIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom fontWeight="bold">
            No schedule generated yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
            Click "Generate AI Schedule" to create an optimized case schedule based on priority algorithms
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<AutoAwesome />}
            onClick={() => setAutoScheduleDialog(true)}
            sx={{ px: 4, py: 1.5 }}
          >
            Generate Schedule Now
          </Button>
        </Paper>
      )}

      {/* Dialog */}
      <Dialog 
        open={autoScheduleDialog} 
        onClose={() => setAutoScheduleDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Generate AI-Powered Schedule
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={scheduleParams.startDate}
            onChange={(e) => setScheduleParams({ ...scheduleParams, startDate: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Number of Days"
            type="number"
            value={scheduleParams.days}
            onChange={(e) => setScheduleParams({ ...scheduleParams, days: parseInt(e.target.value) || 7 })}
            margin="normal"
            inputProps={{ min: 1, max: 30 }}
            helperText="Schedule cases for next N working days (excluding weekends)"
          />
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            AI Prioritization Criteria:
          </Typography>
          <Box component="ul" sx={{ fontSize: '0.875rem', pl: 2 }}>
            <li>Age of case (older cases get higher priority)</li>
            <li>IPC severity (serious crimes prioritized)</li>
            <li>Case complexity (document count)</li>
            <li>Urgency keywords (bail, custody, interim)</li>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAutoScheduleDialog(false)}>Cancel</Button>
          <Button 
            onClick={generateAutoSchedule} 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
          >
            {loading ? 'Generating...' : 'Generate Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Scheduling;
