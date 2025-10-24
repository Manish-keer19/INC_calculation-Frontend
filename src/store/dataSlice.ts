import { createSlice } from '@reduxjs/toolkit';

interface DataEntry {
  id: number;
  valueA: number;
  valueB: number;
  valueC: number;
  recordedAt: string;
}

interface DataState {
  entries: DataEntry[];
  currentChart: { valueA: number; valueB: number; valueC: number } | null;
  showChart: boolean;
}

const initialState: DataState = {
  entries: [],
  currentChart: null,
  showChart: false,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setEntries: (state, action) => {
      state.entries = action.payload;
      localStorage.setItem('userData', JSON.stringify(action.payload));
    },
    addEntry: (state, action) => {
      state.entries.unshift(action.payload);
      localStorage.setItem('userData', JSON.stringify(state.entries));
    },
    setCurrentChart: (state, action) => {
      state.currentChart = action.payload;
      state.showChart = true;
    },
    hideChart: (state) => {
      state.showChart = false;
      state.currentChart = null;
    },
    loadFromStorage: (state) => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        state.entries = JSON.parse(userData);
      }
    },
    clearData: (state) => {
      state.entries = [];
      state.currentChart = null;
      state.showChart = false;
      localStorage.removeItem('userData');
    },
  },
});

export const { setEntries, addEntry, setCurrentChart, hideChart, loadFromStorage, clearData } = dataSlice.actions;
export default dataSlice.reducer;