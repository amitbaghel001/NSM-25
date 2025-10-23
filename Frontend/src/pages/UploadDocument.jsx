import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Button, Box, Alert, LinearProgress
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import API from '../api/axios';

const UploadDocument = () => {
  const { caseId } = useParams();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('caseId', caseId);

      const { data } = await API.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Document uploaded successfully!');
      setUploading(false);

      // Process document with ML
      setProcessing(true);
      await API.post(`/documents/process/${data._id}`);
      setProcessing(false);

      setSuccess('Document processed successfully!');
      setTimeout(() => {
        navigate(`/case/${caseId}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
      setUploading(false);
      setProcessing(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Upload Document</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            mb: 2,
            cursor: 'pointer',
            '&:hover': { borderColor: 'primary.main' }
          }}
          onClick={() => document.getElementById('file-input').click()}
        >
          <CloudUpload sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            {file ? file.name : 'Click to select file or drag and drop'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Supported formats: PDF, JPG, PNG (Max 10MB)
          </Typography>
          <input
            id="file-input"
            type="file"
            hidden
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
        </Box>

        {(uploading || processing) && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              {uploading && 'Uploading...'}
              {processing && 'Processing with AI...'}
            </Typography>
          </Box>
        )}

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpload}
            disabled={!file || uploading || processing}
          >
            Upload & Process
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate(`/case/${caseId}`)}
            disabled={uploading || processing}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UploadDocument;
