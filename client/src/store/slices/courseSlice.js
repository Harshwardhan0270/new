import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get all courses
export const getCourses = createAsyncThunk('courses/getCourses', async (params, { rejectWithValue }) => {
  try {
    const response = await axios.get('/courses', { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// Get course by ID
export const getCourse = createAsyncThunk('courses/getCourse', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/courses/${id}`);
    return response.data.course;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// Create course
export const createCourse = createAsyncThunk('courses/createCourse', async (courseData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/courses', courseData);
    return response.data.course;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

const initialState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Courses
      .addCase(getCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(getCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Course
      .addCase(getCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
        state.error = null;
      })
      .addCase(getCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.unshift(action.payload);
        state.error = null;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentCourse } = courseSlice.actions;
export default courseSlice.reducer;