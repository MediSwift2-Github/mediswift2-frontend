import { configureStore } from '@reduxjs/toolkit';
import patientReducer from '../features/selectedPatient/patientSlice';

export const store = configureStore({
    reducer: {
        patient: patientReducer,
    },
});
