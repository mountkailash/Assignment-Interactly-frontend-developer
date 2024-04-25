import { configureStore } from '@reduxjs/toolkit';
import nodesReducer from '../reducers/nodesSlice';
import edgesReducer from '../reducers/edgesSlice';



export default configureStore({
  reducer: {
    nodes: nodesReducer,
    edges: edgesReducer,
  },
});
