import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { createCourse } from '../../store/slices/courseSlice';

const CreateCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.courses);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    price: 0,
    requirements: '',
    learningOutcomes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const courseData = {
      ...formData,
      requirements: formData.requirements.split('\n').filter(req => req.trim()),
      learningOutcomes: formData.learningOutcomes.split('\n').filter(outcome => outcome.trim())
    };

    const result = await dispatch(createCourse(courseData));
    if (result.type === 'courses/createCourse/fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Create New Course
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Course Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Course Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleChange}
              >
                <MenuItem value="Programming">Programming</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="Mathematics">Mathematics</MenuItem>
                <MenuItem value="Language">Language</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Level</InputLabel>
              <Select
                name="level"
                value={formData.level}
                label="Level"
                onChange={handleChange}
              >
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              id="price"
              label="Price (0 for free)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              fullWidth
              id="requirements"
              label="Requirements (one per line)"
              name="requirements"
              multiline
              rows={3}
              value={formData.requirements}
              onChange={handleChange}
              helperText="Enter each requirement on a new line"
            />

            <TextField
              margin="normal"
              fullWidth
              id="learningOutcomes"
              label="Learning Outcomes (one per line)"
              name="learningOutcomes"
              multiline
              rows={3}
              value={formData.learningOutcomes}
              onChange={handleChange}
              helperText="Enter each learning outcome on a new line"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Course'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateCourse;