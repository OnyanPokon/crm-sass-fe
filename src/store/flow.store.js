import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

export const useFlowStore = create((set, get) => ({
  nodes: [],
  edges: [],

  loadFlow: (flow) => {
    set({
      nodes: flow.nodes || [],
      edges: flow.edges || []
    });
  },

  setNodes: (changes) =>
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    }),

  setEdges: (changes) =>
    set({
      edges: applyEdgeChanges(changes, get().edges)
    }),

  onConnect: (connection) =>
    set({
      edges: addEdge(connection, get().edges)
    }),

  addNode: (node) =>
    set({
      nodes: [...get().nodes, node]
    })
}));
