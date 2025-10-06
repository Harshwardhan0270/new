import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container
} from '@mui/material';
import {
  School,
  People,
  Assessment,
  VideoLibrary
} from '@mui/icons-material';

const Home = () => {

  const features = [
    {
      icon: <School fontSize="large" />,
      title: 'Course Management',
      description: 'Create and manage comprehensive courses with ease'
    },
    {
      icon: <People fontSize="large" />,
      title: 'Student Enrollment',
      description: 'Simple enrollment process with progress tracking'
    },
    {
      icon: <VideoLibrary fontSize="large" />,
      title: 'Video Lectures',
      description: 'Stream high-quality video content with interactive features'
    },
    {
      icon: <Assessment fontSize="large" />,
      title: 'Assessments',
      description: 'Create quizzes and assignments to test student knowledge'
    }
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          borderRadius: 2,
          color: 'white',
          mb: 6
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Online LMS
        </Typography>
        <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4 }}>
          Your comprehensive learning management system for modern education
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/courses"
            sx={{ bgcolor: 'white', color: 'primary.main' }}
          >
            Browse Courses
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/register"
            sx={{ borderColor: 'white', color: 'white' }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* Features Section */}
      <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
        Features
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* CTA Section */}
      <Box
        sx={{
          textAlign: 'center',
          py: 6,
          bgcolor: 'grey.100',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to Start Learning?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Join thousands of students and instructors already using our platform
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/register"
        >
          Sign Up Now
        </Button>
      </Box>
    </Container>
  );
};

export default Home;