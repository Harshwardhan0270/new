import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress
} from '@mui/material';
import { getCourses } from '../../store/slices/courseSlice';

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);
  
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: ''
  });

  useEffect(() => {
    dispatch(getCourses(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Courses
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search courses"
          variant="outlined"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            label="Category"
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Programming">Programming</MenuItem>
            <MenuItem value="Design">Design</MenuItem>
            <MenuItem value="Business">Business</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Level</InputLabel>
          <Select
            value={filters.level}
            label="Level"
            onChange={(e) => handleFilterChange('level', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Beginner">Beginner</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Advanced">Advanced</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Course Grid */}
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={course.thumbnail || '/api/placeholder/400/200'}
                alt={course.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {course.description.substring(0, 100)}...
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={course.category} size="small" />
                  <Chip label={course.level} size="small" variant="outlined" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  By {course.instructor?.firstName} {course.instructor?.lastName}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  component={Link}
                  to={`/courses/${course._id}`}
                  variant="contained"
                  fullWidth
                >
                  View Course
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {courses.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No courses found matching your criteria
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Courses;