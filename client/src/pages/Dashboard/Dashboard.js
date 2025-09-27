import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Button,
  Avatar
} from '@mui/material';
import { School, PlayCircleOutline, Assignment } from '@mui/icons-material';
import { getMyCourses } from '../../store/slices/enrollmentSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { enrollments, loading } = useSelector((state) => state.enrollments);

  useEffect(() => {
    if (user?.role === 'student') {
      dispatch(getMyCourses());
    }
  }, [dispatch, user]);

  const stats = [
    {
      title: 'Enrolled Courses',
      value: enrollments.length,
      icon: <School fontSize="large" />,
      color: 'primary.main'
    },
    {
      title: 'Completed Courses',
      value: enrollments.filter(e => e.isCompleted).length,
      icon: <Assignment fontSize="large" />,
      color: 'success.main'
    },
    {
      title: 'In Progress',
      value: enrollments.filter(e => !e.isCompleted && e.completionPercentage > 0).length,
      icon: <PlayCircleOutline fontSize="large" />,
      color: 'warning.main'
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ width: 64, height: 64, mr: 2, fontSize: '2rem' }}>
          {user?.firstName?.[0]}
        </Avatar>
        <Box>
          <Typography variant="h4" component="h1">
            Welcome back, {user?.firstName}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user?.role === 'student' ? 'Student Dashboard' : 'Instructor Dashboard'}
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ color: stat.color, mr: 2 }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Courses */}
      {user?.role === 'student' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              My Courses
            </Typography>
            {enrollments.length === 0 ? (
              <Typography color="text.secondary">
                You haven't enrolled in any courses yet.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {enrollments.slice(0, 6).map((enrollment) => (
                  <Grid item xs={12} sm={6} md={4} key={enrollment._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" noWrap>
                          {enrollment.course.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Progress: {enrollment.completionPercentage}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={enrollment.completionPercentage} 
                          sx={{ mb: 2 }}
                        />
                        <Button variant="outlined" size="small" fullWidth>
                          Continue Learning
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Dashboard;