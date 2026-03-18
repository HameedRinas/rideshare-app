import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tripService from '../../services/tripService';

export const searchTrips = createAsyncThunk(
  'trips/search',
  async (params, { rejectWithValue }) => {
    try {
      const response = await tripService.searchTrips(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTrip = createAsyncThunk(
  'trips/create',
  async (tripData, { rejectWithValue }) => {
    try {
      const response = await tripService.createTrip(tripData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMyTrips = createAsyncThunk(
  'trips/fetchMyTrips',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tripService.getMyTrips();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  trips: [],
  currentTrip: null,
  myTrips: [],
  loading: false,
  error: null,
  searchParams: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setCurrentTrip: (state, action) => {
      state.currentTrip = action.payload;
    },
    clearTrips: (state) => {
      state.trips = [];
      state.currentTrip = null;
    },
    setSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search Trips
      .addCase(searchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(searchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Search failed';
      })
      // Create Trip
      .addCase(createTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.myTrips.unshift(action.payload.trip);
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to create trip';
      })
      // Fetch My Trips
      .addCase(fetchMyTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.myTrips = action.payload;
      })
      .addCase(fetchMyTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch trips';
      });
  },
});

export const { setCurrentTrip, clearTrips, setSearchParams } = tripSlice.actions;
export default tripSlice.reducer;