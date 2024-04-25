import React, { useState, useCallback } from "react";
import ReactFlow, { Background, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { MdClear } from 'react-icons/md';
import NodePopup from "./NodePopup";
import '../app.css';


const initialNodes = [];
const initialEdges = [];


const HomePage = () => {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [hoveredNode, setHoveredNode] = useState({})
    const [hoveredEdge, setHoveredEdge] = useState({})
    const [isCursorOverNode, setIsCursorOverNode] = useState(false);
    const [isCursorOverIcon, setIsCursorOverIcon] = useState(false);
    const [isCursorOverEdge, setIsCursorOverEdge] = useState(false)
    const [isCursorOverEdgeIcon, setIsCursorOverEdgeIcon] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState(null);


    // create a node
    const createNode = () => {
        const containerWidth = window.innerWidth * 0.7; 
        const containerHeight = window.innerHeight * 0.7; 
        const addNewNode = {
            id: Math.random().toString(),
            data: { label: 'New Node' },
            position: {
                x: Math.random() * containerWidth,
                y: Math.random() * containerHeight
            },
        };

        setNodes((node) => node.concat(addNewNode))
    }

    // drag a node
    const onNodeDrag = (event, node) => {
        console.log('node is being dragged');

        const updatedNode = nodes.map((n) => {
            if (n.id === node.id) {
                return {
                    ...n,
                    position: { x: node.position.x, y: node.position.y }
                }
            }
            return n
        })
        setNodes(updatedNode)
    }

    // connect edges with nodes
    const onConnect = (params) => {
        const newEdge = {
            id: `e${edges.length + 1}`,
            source: params.source,
            sourceHandle: params.sourceHandle,
            target: params.target,
            targetHandle: params.targetHandle,
        }
        setEdges((edges) => [...edges, newEdge])
    }

    // handlers for node and icon hovers
    const handleNodeHover = useCallback((event, node) => {
        console.log('hovered  node id is', node.id)
        setHoveredNode(node.id);
        setIsCursorOverNode(true);
    }, []);

    const handleNodeMouseLeave = useCallback(() => {
        setIsCursorOverNode(false);
    }, []);

    const handleIconHover = useCallback(() => {
        setIsCursorOverIcon(true);
    }, []);

    const handleIconMouseLeave = useCallback(() => {
        setIsCursorOverIcon(false);
    }, []);

    
    // handlers for edge hovers and icon hovers
    const handleEdgeHover = useCallback((event, edge) => {
        if (edge && edge.id) {
            setHoveredEdge(edge.id);
            setIsCursorOverEdge(true);
        }
    }, [])

    const handleEdgeLeave = useCallback(() => {
        // setHoveredEdge(null)
        setIsCursorOverEdge(false)
    }, [])

    const handleEdgeIconHover = useCallback(() => {
        setIsCursorOverEdgeIcon(true);
    }, []);

    const handleEdgeIconMouseLeave = useCallback(() => {
        setIsCursorOverEdgeIcon(false);
    }, []);

    // To determine whether to show the icon based on cursor position
    const shouldShowIcon = hoveredNode && (isCursorOverNode || isCursorOverIcon);
    const shouldShowEdgeIcon = hoveredEdge && (isCursorOverEdge || isCursorOverEdgeIcon);

    // handler for deleting node
    const handleNodeDelete = (id) => {
        console.log("Deleting node with id:", id);
        const newNodes = nodes.filter((node) => node.id !== id);
        console.log("New nodes array:", newNodes);
        setNodes(newNodes)

    }

    // handler for deleting edge
    const handleEdgeDelete = (id) => {
        console.log('deleting edge with id', id);
        setEdges(edges.filter((edge) => edge.id !== id));
    }

    // handler for node click
    const handleNodeClick = (event, node) => {
        console.log('selected node id', node.id)
        setSelectedNodeId(node.id);
        setShowPopup(true);
    };

    // handler for saving title of the node
    const handleSaveTitle = (title) => {
        console.log('nodes before update:', nodes);
        const updatedNodes = nodes.map((node) => {
            if (node.id === selectedNodeId) {
                const updatedNode = {
                    ...node,
                    data: {
                        ...node.data,
                        label: title 
                    }
                };
                console.log('updated node:', updatedNode); 
                return updatedNode;
            }
            return node;
        });
        setNodes(updatedNodes);
        console.log('nodes after update:', updatedNodes);
        setShowPopup(false);
    };
    
    // handler for closing the popup
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    
    return (
        <>
            <ReactFlowProvider>
            <div style={{ maxWidth: '1200px', margin: '0 auto', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
        </>
    )
}

export default HomePage