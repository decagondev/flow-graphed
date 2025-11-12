import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Node, Edge, addEdge, Connection, applyNodeChanges, applyEdgeChanges, type NodeChange, type EdgeChange } from '@xyflow/react'

const MAX_HISTORY = 50

type HistoryEntry = {
  nodes: Node[]
  edges: Edge[]
}

type FlowState = {
  nodes: Node[]
  edges: Edge[]
  selectedId: string | null
  logs: { id: string; timestamp: number; message: string; type: 'info' | 'error' | 'success' }[]
  past: HistoryEntry[]
  future: HistoryEntry[]
  addNode: (node: Node) => void
  updateNode: (id: string, data: Partial<Node['data']>) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  setSelected: (id: string | null) => void
  addLog: (message: string, type?: 'info' | 'error' | 'success') => void
  clearLogs: () => void
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  addToHistory: () => void
}

export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => {
      const addToHistory = () => {
        const { nodes, edges } = get()
        const current: HistoryEntry = { nodes: [...nodes], edges: [...edges] }
        const past = [...get().past, present].slice(-MAX_HISTORY)
        present = current
        set({
          past,
          future: [],
        })
      }

      let present: HistoryEntry = { nodes: [], edges: [] }

      return {
        nodes: [],
        edges: [],
        selectedId: null,
        logs: [],
        past: [],
        future: [],

        addToHistory,

        addNode: (node) => {
          const state = get()
          state.addToHistory()
          set({
            nodes: [...state.nodes, { ...node, position: node.position || { x: 0, y: 0 } }],
          })
        },

        updateNode: (id, data) => {
          const state = get()
          state.addToHistory()
          set({
            nodes: state.nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
          })
        },

        onNodesChange: (changes) => {
          const state = get()
          const hasSignificantChange = changes.some(
            (c) => c.type === 'remove' || c.type === 'add' || (c.type === 'position' && c.dragging === false)
          )
          if (hasSignificantChange) {
            state.addToHistory()
          }
          set({
            nodes: applyNodeChanges(changes, state.nodes),
          })
        },

        onEdgesChange: (changes) => {
          const state = get()
          const hasSignificantChange = changes.some((c) => c.type === 'remove' || c.type === 'add')
          if (hasSignificantChange) {
            state.addToHistory()
          }
          set({
            edges: applyEdgeChanges(changes, state.edges),
          })
        },

        onConnect: (connection) => {
          const state = get()
          state.addToHistory()
          set({
            edges: addEdge({ ...connection, type: 'smoothstep', animated: true }, state.edges),
          })
        },

        setSelected: (id) => set({ selectedId: id }),

        addLog: (message, type = 'info') =>
          set((state) => ({
            logs: [...state.logs, { id: Math.random().toString(), timestamp: Date.now(), message, type }],
          })),

        clearLogs: () => set({ logs: [] }),

        setNodes: (nodes) => {
          const state = get()
          state.addToHistory()
          set({ nodes })
        },

        setEdges: (edges) => {
          const state = get()
          state.addToHistory()
          set({ edges })
        },

        undo: () => {
          const { past } = get()
          if (past.length === 0) return

          const previous = past[past.length - 1]
          const newPast = past.slice(0, -1)

          set({
            past: newPast,
            future: [present, ...get().future],
            nodes: previous.nodes,
            edges: previous.edges,
          })
          present = previous
        },

        redo: () => {
          const { future } = get()
          if (future.length === 0) return

          const next = future[0]
          const newFuture = future.slice(1)

          set({
            past: [...get().past, present],
            future: newFuture,
            nodes: next.nodes,
            edges: next.edges,
          })
          present = next
        },

        canUndo: () => get().past.length > 0,
        canRedo: () => get().future.length > 0,
      }
    },
    {
      name: 'flowgraph-data',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        selectedId: state.selectedId,
      }),
    }
  )
)
