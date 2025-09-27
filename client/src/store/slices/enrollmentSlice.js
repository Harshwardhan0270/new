import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Enroll in course
export const enrollInCourse = createAsyncThunk('enrollments/enrollInCourse', async (courseId, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/enrollments/${courseId}`);
    return response.data.enrollment;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// Get my courses
export const getMyCourses = createAsyncThunk('enrollments/getMyCourses', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/enrollments/my-courses');
    return response.data.enrollments;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

const initialState = {
  enrollments: [],
  loading: false,
  error: null,
};

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Enroll in Course
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments.push(action.payload);
        state.error = null;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get My Courses
      .addCase(getMyCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload;
        state.error = null;
      })
      .addCase(getMyCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;