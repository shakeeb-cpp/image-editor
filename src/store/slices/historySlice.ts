// Update historySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setRotationState } from './rotationSlice';
// import { setCrop, setActive } from './cropSlice';
import { resetAdjustments } from './adjustmentSlice';
import { resetFilters } from './filterSlice';
import { resetOverlays } from './overlaySlice';

interface AppSnapshot {
  adjustment: any;
  crop: any;
  rotation: any;
  filter: any;
  overlay: any;
}

interface HistoryState {
  past: AppSnapshot[];
  present: AppSnapshot | null;
  future: AppSnapshot[];
  canUndo: boolean;
  canRedo: boolean;
}

const initialState: HistoryState = {
  past: [],
  present: null,
  future: [],
  canUndo: false,
  canRedo: false,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addToHistory: (state, action: PayloadAction<AppSnapshot>) => {
      if (state.present) {
        state.past.push(state.present);
      }
      state.present = action.payload;
      state.future = [];
      state.canUndo = state.past.length > 0;
      state.canRedo = false;
    },
    undo: (state) => {
      if (state.past.length > 0) {
        const previous = state.past.pop()!;
        if (state.present) {
          state.future.unshift(state.present);
        }
        state.present = previous;
        state.canUndo = state.past.length > 0;
        state.canRedo = state.future.length > 0;
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future.shift()!;
        if (state.present) {
          state.past.push(state.present);
        }
        state.present = next;
        state.canUndo = state.past.length > 0;
        state.canRedo = state.future.length > 0;
      }
    },
    // Add a clearHistory action
    clearHistory: (state) => {
      state.past = [];
      state.present = null;
      state.future = [];
      state.canUndo = false;
      state.canRedo = false;
    },
  },
});

export const { addToHistory, undo, redo, clearHistory } = historySlice.actions;
export default historySlice.reducer;

// Create a thunk to handle undo
export const applyUndo = () => (dispatch: any, getState: any) => {
  const { history } = getState();
  if (history.past.length > 0) {
    // First perform the standard undo action
    dispatch(undo());
    
    // Then apply the previous state to all slices
    const previousState = history.present;
    if (previousState) {
      // Apply rotation state
      dispatch(setRotationState(previousState.rotation));
      
      // Apply crop state
      // dispatch(setCrop({
      //   ...previousState.crop,
      //   active: previousState.crop.active
      // }));
      
      // Apply adjustment state
      dispatch(resetAdjustments());
      dispatch({ type: 'adjustment/setState', payload: previousState.adjustment });
      
      // Apply filter state
      dispatch(resetFilters());
      dispatch({ type: 'filter/setState', payload: previousState.filter });
      
      // Apply overlay state
      dispatch(resetOverlays());
      dispatch({ type: 'overlay/setState', payload: previousState.overlay });
    }
  }
};

// Create a thunk to handle redo
export const applyRedo = () => (dispatch: any, getState: any) => {
  const { history } = getState();
  if (history.future.length > 0) {
    // First perform the standard redo action
    dispatch(redo());
    
    // Then apply the next state to all slices
    const nextState = history.present;
    if (nextState) {
      // Apply rotation state
      dispatch(setRotationState(nextState.rotation));
      
      // Apply crop state
      // dispatch(setCrop({
      //   ...nextState.crop,
      //   active: nextState.crop.active
      // }));
      
      // Apply adjustment state
      dispatch(resetAdjustments());
      dispatch({ type: 'adjustment/setState', payload: nextState.adjustment });
      
      // Apply filter state
      dispatch(resetFilters());
      dispatch({ type: 'filter/setState', payload: nextState.filter });
      
      // Apply overlay state
      dispatch(resetOverlays());
      dispatch({ type: 'overlay/setState', payload: nextState.overlay });
    }
  }
};

