import React, { useCallback } from 'react';
import ReactFlow, { Controls, Background, ReactFlowProvider } from 'reactflow';
import { MdClear } from 'react-icons/md';
import 'reactflow/dist/style.css';
import '../app.css';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addNode, 
  updateNodePosition, 
  setHoveredNode, 
  setIsCursorOverNode, 
  setIsCursorOverIcon, 
  handleDelete, 
  setSelectedNodeId,  
  saveTitle, 
  closePopup
 } from '../reducers/nodesSlice';

import {
  addEdge, 
  setHoveredEdge, 
  setIsCursorOverEdge, 
  setIsCursorOverEdgeIcon, 
  edgeDelete 
} from '../reducers/edgesSlice';

import NodePopup from "./NodePopup";


const Home = () => {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.nodes.nodes);
  const edges = useSelector((state) => state.edges.edges);
  const hoveredNode = useSelector((state) => state.nodes.hoveredNode);
  const isCursorOverNode = useSelector((state) => state.nodes.isCursorOverNode);
  const isCursorOverIcon = useSelector((state) => state.nodes.isCursorOverIcon);
  const hoveredEdge = useSelector((state) => state.edges.hoveredEdge);
  const isCursorOverEdge = useSelector((state) => state.edges.isCursorOverEdge);
  const isCursorOverEdgeIcon = useSelector((state) => state.edges.isCursorOverEdgeIcon);
  const selectedNodeId = useSelector((state) => state.nodes.selectedNodeId);
  const showPopup = useSelector((state) => state.nodes.showPopup);


  // create a node 
  const createNode = () => {
    const containerWidth = window.innerWidth * 0.7;
    const containerHeight = window.innerHeight * 0.7;
    const addNewNode = {
      id: Math.random().toString(),
      data: { label: 'New Node' },
      position: {
        x: Math.random() * containerWidth,
        y: Math.random() * containerHeight,
      },
    };
    dispatch(addNode(addNewNode));
  };

  // drag a node from it's position
  const onNodeDrag = (event, node) => {
    console.log('node is being dragged');
    dispatch(updateNodePosition({ id: node.id, position: node.position }));
  };

  // connecting edge with nodes
  const onConnect = (params) => {
    const newEdge = {
      id: `e${edges.length + 1}`,
      source: params.source,
      sourceHandle: params.sourceHandle,
      target: params.target,
      targetHandle: params.targetHandle,
    };
    dispatch(addEdge(newEdge));
  };

  // node hovers handlers
  const handleNodeHover = useCallback((event, node) => {
    console.log('hovered node id is', node.id);
    dispatch(setHoveredNode(node.id));
    dispatch(setIsCursorOverNode(true));
  }, [dispatch]);

  const handleNodeMouseLeave = useCallback(() => {
    dispatch(setIsCursorOverNode(false));
  }, [dispatch]);

  const handleIconHover = useCallback(() => {
    dispatch(setIsCursorOverIcon(true));
  }, [dispatch]);

  const handleIconMouseLeave = useCallback(() => {
    dispatch(setIsCursorOverIcon(false));
  }, [dispatch]);

  const handleNodeDelete = (id) => {
    console.log("deleting node with id:", id);
    dispatch(handleDelete(id));
  };

  // edge hovers handlers
  const handleEdgeHover = useCallback((event, edge) => {
    if (edge && edge.id) {
      dispatch(setHoveredEdge(edge.id));
      dispatch(setIsCursorOverEdge(true));
    }
  }, [dispatch]);

  const handleEdgeLeave = useCallback(() => {
    dispatch(setIsCursorOverEdge(false));
  }, [dispatch]);

  const handleEdgeIconHover = useCallback(() => {
    dispatch(setIsCursorOverEdgeIcon(true));
  }, [dispatch]);

  const handleEdgeIconMouseLeave = useCallback(() => {
    dispatch(setIsCursorOverEdgeIcon(false));
  }, [dispatch]);

  // handler for deleting edge
  const handleEdgeDelete = (id) => {
    console.log("deleting edge with id:", id);
    dispatch(edgeDelete(id));
  };

  // To determine whether to show the icon based on cursor position
  const shouldShowIcon = hoveredNode && (isCursorOverNode || isCursorOverIcon);
  const shouldShowEdgeIcon = hoveredEdge && (isCursorOverEdge || isCursorOverEdgeIcon);

  
  // handle for the node click
  const handleNodeClick = (event, node) => {
    dispatch(setSelectedNodeId(node.id));
  };
  
  // handle for saving title
  const handleSaveTitle = (title) => {
    dispatch(saveTitle({ title }));
  };

  // handle for closing popup
  const handleClosePopup = () => {
    dispatch(closePopup());
  };



  return (
    <ReactFlowProvider>
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          <button onClick={createNode} >Create Node</button>
        </div>
        <div
          style={{ position: 'relative', width: '70%', height: '70%', border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden' }}>

          <ReactFlow
            nodes={nodes}
            onNodeDrag={onNodeDrag}
            onConnect={onConnect}
            edges={edges}
            onNodeMouseEnter={handleNodeHover}
            onNodeMouseLeave={handleNodeMouseLeave}
            onEdgeMouseEnter={handleEdgeHover}
            onEdgeMouseLeave={handleEdgeLeave}
            onNodeClick={handleNodeClick}

            style={{ width: '100%', height: '100%' }}
          >
            {/* <Controls /> */}
            <Background />

            {nodes.map((node) => (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  transform: `translate(${node.position.x}px, ${node.position.y}px)`,
                  zIndex: 1000,

                }}
              >
                <div className="node">
                  {hoveredNode === node.id && shouldShowIcon && (
                    <div
                      className="x-icon"
                      onMouseEnter={handleIconHover}
                      onMouseLeave={handleIconMouseLeave}
                    >
                      <MdClear color="white" size={20} onClick={() => handleNodeDelete(node.id)} />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {edges.map((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              console.log('source node id is', sourceNode.id)
              const targetNode = nodes.find((n) => n.id === edge.target);
              console.log('target node is', targetNode.id)
              if (!sourceNode || !targetNode) return null;
              const midpointX = (sourceNode.position.x + targetNode.position.x) / 2;
              const midpointY = (sourceNode.position.y + targetNode.position.y) / 2;
              const iconStyle = {
                position: 'absolute',
                top: midpointY,
                left: midpointX,
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
              };
              return (
                <div key={edge.id} style={iconStyle}>
                  {hoveredEdge === edge.id && shouldShowEdgeIcon && (
                    <div
                      className="edge-icon"
                      onMouseEnter={handleEdgeIconHover}
                      onMouseLeave={handleEdgeIconMouseLeave}
                    >
                      <MdClear color="white" size={20} onClick={() => handleEdgeDelete(edge.id)} />
                    </div>
                  )}
                </div>
              );
            })}
          </ReactFlow>
        </div>
        {showPopup && <NodePopup onSave={handleSaveTitle} onClose={handleClosePopup} />}
      </div>
    </ReactFlowProvider>
  );
};

export default Home;