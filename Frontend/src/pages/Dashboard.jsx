import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Button, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, TextField, Grid, Card, CardContent,
  Avatar, InputAdornment
} from '@mui/material';
import { 
  Add, Search, Gavel, HourglassEmpty, CheckCircle, 
  Folder, TrendingUp, CalendarToday
} from '@mui/icons-material';
import API from '../api/axios';

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, scheduled: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data } = await API.get('/cases/all?limit=100');
      setCases(data.cases);
      
      const total = data.totalCases;
      const pending = data.cases.filter(c => c.status === 'pending' || c.status === 'processing').length;
      const completed = data.cases.filter(c => c.status === 'completed').length;
      const scheduled = data.cases.filter(c => c.status === 'scheduled').length;
      
      setStats({ total, pending, completed, scheduled });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cases:', error);
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'scheduled': return 'info';
      case 'processing': return 'warning';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  const StatCard = ({ title, value, icon, color, bgColor }) => (
    <Card 
      sx={{ 
        height: '100%',
        boxShadow: 3,
        transition: 'all 0.3s',
        '&:hover': { 
          transform: 'translateY(-8px)',
          boxShadow: 6
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2" fontWeight="medium">
              {title}
            </Typography>
            <Typography variant="h2" fontWeight="bold" sx={{ color }}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ 
            bgcolor: bgColor, 
            width: 70, 
            height: 70,
            boxShadow: 2
          }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <Gavel sx={{ mr: 2, fontSize: 45, color: 'primary.main' }} />
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Manage and track all your legal cases
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => navigate('/create-case')}
          sx={{ 
            px: 4, 
            py: 1.5,
            boxShadow: 3,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 5
            },
            transition: 'all 0.3s'
          }}
        >
          Create New Case
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Cases"
            value={stats.total}
            icon={<Folder sx={{ fontSize: 35, color: 'white' }} />}
            color="#1976d2"
            bgColor="linear-gradient(135deg, #1976d2 0%, #1565c0 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<HourglassEmpty sx={{ fontSize: 35, color: 'white' }} />}
            color="#ed6c02"
            bgColor="linear-gradient(135deg, #ed6c02 0%, #e65100 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Scheduled"
            value={stats.scheduled}
            icon={<CalendarToday sx={{ fontSize: 35, color: 'white' }} />}
            color="#0288d1"
            bgColor="linear-gradient(135deg, #0288d1 0%, #01579b 100%)"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircle sx={{ fontSize: 35, color: 'white' }} />}
            color="#2e7d32"
            bgColor="linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)"
          />
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ mb: 3, boxShadow: 2 }}>
        <TextField
          fullWidth
          placeholder="Search cases by number or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary', fontSize: 28 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { border: 'none' },
            },
            '& input': {
              py: 2,
              fontSize: '1.1rem'
            }
          }}
        />
      </Paper>

      {/* Cases Table */}
      <Paper sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ 
          p: 2, 
          backgroundColor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6" fontWeight="bold">
            <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
            Recent Cases ({filteredCases.length})
          </Typography>
          <Chip 
            label={`${stats.total} Total`} 
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontWeight: 'bold'
            }} 
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell><strong>Case Number</strong></TableCell>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Created Date</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Loading cases...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredCases.length > 0 ? (
                filteredCases.map((case_) => (
                  <TableRow 
                    key={case_._id} 
                    hover 
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: '#f0f7ff',
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight="bold" color="primary">
                        {case_.caseNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{case_.title}</TableCell>
                    <TableCell>
                      <Chip 
                        label={case_.status} 
                        color={getStatusColor(case_.status)} 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(case_.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/case/${case_._id}`)}
                        sx={{
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: 2
                          },
                          transition: 'all 0.2s'
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Folder sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No cases found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search or create a new case
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Dashboard;
