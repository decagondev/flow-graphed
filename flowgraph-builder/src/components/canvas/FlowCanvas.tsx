import React, { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useFlowStore } from '@/store/usFlowStore'
import { nodeRegistry } from '@/lib/nodeRegistry'

const FlowCanvasInner: React.FC = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, setSelected } = useFlowStore()
  const { screenToFlowPosition } = useReactFlow()
  const nodeTypes = useMemo(() => nodeRegistry.getReactFlowNodeTypes(), [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      if (!type) return

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const nodeType = nodeRegistry.getNodeType(type)
      if (!nodeType) return

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: nodeType.config.label,
          icon: nodeType.config.icon,
          color: nodeType.config.color,
          inputs: nodeType.config.inputs,
          outputs: nodeType.config.outputs,
        },
      }

      addNode(newNode)
    },
    [screenToFlowPosition, addNode]
  )

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelected(node.id)
  }, [setSelected])

  const onPaneClick = useCallback(() => {
    setSelected(null)
  }, [setSelected])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      fitView
      minZoom={0.1}
      maxZoom={2}
      snapToGrid={true}
      snapGrid={[20, 20]}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
    >
      <Background gap={20} size={1} />
      <Controls />
      <MiniMap
        nodeColor={(node) => {
          if (node.type === 'trigger') return '#10b981'
          if (node.type === 'api') return '#3b82f6'
          if (node.type === 'transform') return '#f59e0b'
          return '#64748b'
        }}
        maskColor="rgba(0, 0, 0, 0.1)"
      />
    </ReactFlow>
  )
}

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ReactFlowProvider>{children}</ReactFlowProvider>
}

export const FlowCanvas: React.FC = () => {
  return (
    <div className="h-full w-full">
      <FlowCanvasInner />
    </div>
  )
}