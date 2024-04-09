import { createSlice } from '@reduxjs/toolkit';

export const patientSlice = createSlice({
    name: 'patient',
    initialState: {
        selectedPatient: null,
    },
    reducers: {
        selectPatient: (state, action) => {
            console.log('Selecting patient:', action.payload); // Log the action payload

            state.selectedPatient = action.payload;
        },
    },
});

export const { selectPatient } = patientSlice.actions;

export default patientSlice.reducer;
