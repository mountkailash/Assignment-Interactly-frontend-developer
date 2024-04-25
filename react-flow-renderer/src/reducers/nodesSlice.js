import { createSlice } from '@reduxjs/toolkit';

const nodesSlice = createSlice({
  name: 'nodes',
  initialState: {
    nodes: [],
    hoveredNode: null,
    isCursorOverNode: false,
    isCursorOverIcon: false,
    selectedNodeId: null,
    showPopup: false,
  },
  reducers: {
    addNode: (state, action) => {
      return {
        ...state,
        nodes: [...state.nodes, action.payload],
      };
    },
    updateNodePosition: (state, action) => {
      const { id, position } = action.payload;
      const nodeToUpdate = state.nodes.find((node) => node.id === id); 
      if (nodeToUpdate) {
        nodeToUpdate.position = position;
      }
    },
    setHoveredNode: (state, action) => {
      return {
        ...state,
        hoveredNode: action.payload,
      };
    },
    setIsCursorOverNode: (state, action) => {
      state.isCursorOverNode = action.payload;
    },
    setIsCursorOverIcon: (state, action) => {
      state.isCursorOverIcon = action.payload;
    },
    handleDelete: (state, action) => {
      const nodeIdToDelete = action.payload;
      state.nodes = state.nodes.filter((node) => node.id !== nodeIdToDelete);
    },
    setSelectedNodeId: (state, action) => {
      state.selectedNodeId = action.payload;
      state.showPopup = true;
    },
    saveTitle: (state, action) => {
      const { selectedNodeId, nodes } = state;
      const { title } = action.payload;
      state.nodes = nodes.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: title,
            },
          };
        }
        return node;
      });
      state.showPopup = false;
    },
    closePopup: (state) => {
      state.showPopup = false;
    },
  },
});

export const { addNode, 
  updateNodePosition, 
  setHoveredNode, 
  setIsCursorOverNode, 
  setIsCursorOverIcon, 
  handleDelete, 
  nodeClick,
  setSelectedNodeId,
  saveTitle,
  closePopup
} = nodesSlice.actions;
export default nodesSlice.reducer;
