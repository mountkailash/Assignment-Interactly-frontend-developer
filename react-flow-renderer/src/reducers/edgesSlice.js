import { createSlice } from '@reduxjs/toolkit';

const edgesSlice = createSlice({
    name: 'edges',
    initialState: {
        edges: [],
        hoveredEdge: null,
        isCursorOverEdge: false,
        isCursorOverEdgeIcon: false,
    },
    reducers: {
        addEdge: (state, action) => {
            state.edges.push(action.payload);
        },
        setHoveredEdge: (state, action) => {
            state.hoveredEdge = action.payload;
        },
        setIsCursorOverEdge: (state, action) => {
            state.isCursorOverEdge = action.payload;
        },
        setIsCursorOverEdgeIcon: (state, action) => {
            state.isCursorOverEdgeIcon = action.payload;
        },
        edgeDelete: (state, action) => {
            const edgeIdToDelete = action.payload;
            state.edges = state.edges.filter((edge) => edge.id !== edgeIdToDelete);
          },
    },
});

export const {
    addEdge,
    setHoveredEdge,
    setIsCursorOverEdge,
    setIsCursorOverEdgeIcon,
    edgeDelete
} = edgesSlice.actions;
export default edgesSlice.reducer;
