import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import { PlayArrow, Person, Schedule, Star } from '@mui/icons-material';
import { getCourse } from '../../store/slices/courseSlice';
import { enrollInCourse } from '../../store/slices/enrollmentSlice';

const CourseDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentCourse, loading } = useSelector((state) => state.courses);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { loading: enrollLoading, error: enrollError } = useSelector((state) => state.enrollments);

  useEffect(() => {
    dispatch(getCourse(id));
  }, [dispatch, id]);

  const handleEnroll = () => {
    dispatch(enrollInCourse(id));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!currentCourse) {
    return (
      <Alert severity="error">
        Course not found
      </Alert>
    );
  }

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              {currentCourse.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              {currentCourse.description}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip label={currentCourse.category} />
              <Chip label={currentCourse.level} variant="outlined" />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Person />
              <Typography>
                {currentCourse.instructor?.firstName} {currentCourse.instructor?.lastName}
              </Typography>
              <Schedule />
              <Typography>
                {currentCourse.totalDuration} minutes
              </Typography>
              <Star />
              <Typography>
                {currentCourse.rating?.average || 0} ({currentCourse.rating?.count || 0} reviews)
              </Typography>
            </Box>
          </Box>

          {/* Course Content */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Course Content
              </Typography>
              <List>
                {currentCourse.lessons?.map((lesson, index) => (
                  <ListItem key={lesson._id} divider>
                    <PlayArrow sx={{ mr: 2 }} />
                    <ListItemText
                      primary={`${index + 1}. ${lesson.title}`}
                      secondary={`${lesson.duration} minutes`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Learning Outcomes */}
          {currentCourse.learningOutcomes?.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  What you'll learn
                </Typography>
                <List>
                  {currentCourse.learningOutcomes.map((outcome, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={outcome} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h4" color="primary" gutterBottom>
                {currentCourse.price === 0 ? 'Free' : `$${currentCourse.price}`}
              </Typography>
              
              {enrollError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {enrollError}
                </Alert>
              )}

              {isAuthenticated ? (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleEnroll}
                  disabled={enrollLoading}
                  sx={{ mb: 2 }}
                >
                  {enrollLoading ? <CircularProgress size={24} /> : 'Enroll Now'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  href="/login"
                  sx={{ mb: 2 }}
                >
                  Login to Enroll
                </Button>
              )}

              <Typography variant="body2" color="text.secondary" textAlign="center">
                30-day money-back guarantee
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseDetail;