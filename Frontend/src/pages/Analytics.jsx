import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { TrendingUp, Schedule, CheckCircle, Assessment } from '@mui/icons-material';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import API from '../api/axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [stats, setStats] = useState({
    totalCases: 0,
    pendingCases: 0,
    completedCases: 0,
    scheduledCases: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get('/cases/all?limit=1000');
      
      const total = data.totalCases || 0;
      const pending = data.cases.filter(c => c.status === 'pending' || c.status === 'processing').length;
      const completed = data.cases.filter(c => c.status === 'completed').length;
      const scheduled = data.cases.filter(c => c.status === 'scheduled').length;
      
      setStats({
        totalCases: total,
        pendingCases: pending,
        completedCases: completed,
        scheduledCases: scheduled
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  // Pie Chart - Case Status Distribution
  const pieChartData = {
    labels: ['Completed', 'Pending', 'Scheduled'],
    datasets: [
      {
        data: [stats.completedCases, stats.pendingCases, stats.scheduledCases],
        backgroundColor: [
          'rgba(46, 125, 50, 0.8)',   // Green
          'rgba(237, 108, 2, 0.8)',    // Orange
          'rgba(156, 39, 176, 0.8)',   // Purple
        ],
        borderColor: [
          'rgba(46, 125, 50, 1)',
          'rgba(237, 108, 2, 1)',
          'rgba(156, 39, 176, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Line Chart - Case Backlog Trend (Mock data - 6 months)
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Pending Cases',
        data: [120, 110, 95, 85, 70, stats.pendingCases],
        borderColor: 'rgba(237, 108, 2, 1)',
        backgroundColor: 'rgba(237, 108, 2, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Completed Cases',
        data: [30, 42, 55, 68, 82, stats.completedCases],
        borderColor: 'rgba(46, 125, 50, 1)',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Bar Chart - Weekly Performance
  const barChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'This Week'],
    datasets: [
      {
        label: 'Cases Resolved',
        data: [12, 19, 15, 22, Math.floor(stats.completedCases / 4)],
        backgroundColor: 'rgba(25, 118, 210, 0.7)',
        borderColor: 'rgba(25, 118, 210, 1)',
        borderWidth: 2,
      },
      {
        label: 'Cases Scheduled',
        data: [8, 12, 10, 15, Math.floor(stats.scheduledCases / 4)],
        backgroundColor: 'rgba(156, 39, 176, 0.7)',
        borderColor: 'rgba(156, 39, 176, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Doughnut Chart - Completion Rate
  const doughnutChartData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [
          stats.completedCases,
          stats.pendingCases + stats.scheduledCases
        ],
        backgroundColor: [
          'rgba(46, 125, 50, 0.8)',
          'rgba(189, 189, 189, 0.3)',
        ],
        borderColor: [
          'rgba(46, 125, 50, 1)',
          'rgba(189, 189, 189, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
    },
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%', boxShadow: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h2" sx={{ color, fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ fontSize: 80, color, opacity: 0.3 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Analytics Dashboard</Typography>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h6" color="textSecondary">Loading analytics...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Visual insights and performance metrics
        </Typography>
      </Box>
      
      {/* Main Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Cases"
            value={stats.totalCases}
            icon={<TrendingUp />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={stats.pendingCases}
            icon={<Schedule />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Scheduled"
            value={stats.scheduledCases}
            icon={<Schedule />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completedCases}
            icon={<CheckCircle />}
            color="#2e7d32"
          />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Line Chart - Backlog Trend */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              📉 Case Backlog Trend (Last 6 Months)
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line data={lineChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Pie Chart - Status Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              🎯 Case Status Distribution
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pie data={pieChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3}>
        {/* Bar Chart - Weekly Performance */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              📊 Weekly Performance
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={barChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Doughnut Chart - Completion Rate */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              ⚡ Completion Rate
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut data={doughnutChartData} options={chartOptions} />
            </Box>
            <Typography variant="h4" textAlign="center" color="success.main" fontWeight="bold" mt={2}>
              {stats.totalCases > 0 
                ? ((stats.completedCases / stats.totalCases) * 100).toFixed(1) 
                : 0}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Analytics;
