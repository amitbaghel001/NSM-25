import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Alert, Box } from '@mui/material';
import API from '../api/axios';

const CreateCase = () => {
  const [formData, setFormData] = useState({
    caseNumber: '',
    title: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const { data } = await API.post('/cases/create', formData);
      setSuccess('Case created successfully!');
      setTimeout(() => {
        navigate(`/case/${data._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create case');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Create New Case</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Case Number"
            name="caseNumber"
            value={formData.caseNumber}
            onChange={handleChange}
            margin="normal"
            required
            placeholder="e.g., CIV/2025/001"
          />
          <TextField
            fullWidth
            label="Case Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />
          <Box mt={3} display="flex" gap={2}>
            <Button type="submit" variant="contained" size="large">
              Create Case
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateCase;
