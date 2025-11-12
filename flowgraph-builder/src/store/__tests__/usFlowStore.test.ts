import { describe, it, expect, beforeEach } from 'vitest'
import { useFlowStore } from '../usFlowStore'
import { Node } from '@xyflow/react'

describe('useFlowStore', () => {
  beforeEach(() => {
    useFlowStore.setState({
      nodes: [],
      edges: [],
      selectedId: null,
      logs: [],
      past: [],
      future: [],
    })
  })

  it('should add a node', () => {
    const node: Node = {
      id: 'test-1',
      type: 'trigger',
      position: { x: 0, y: 0 },
      data: { label: 'Test' },
    }

    useFlowStore.getState().addNode(node)

    const nodes = useFlowStore.getState().nodes
    expect(nodes).toHaveLength(1)
    expect(nodes[0].id).toBe('test-1')
  })

  it('should update a node', () => {
    const node: Node = {
      id: 'test-1',
      type: 'trigger',
      position: { x: 0, y: 0 },
      data: { label: 'Test' },
    }

    useFlowStore.getState().addNode(node)
    useFlowStore.getState().updateNode('test-1', { label: 'Updated' })

    const nodes = useFlowStore.getState().nodes
    expect(nodes[0].data.label).toBe('Updated')
  })

  it('should support undo/redo', () => {
    const node: Node = {
      id: 'test-1',
      type: 'trigger',
      position: { x: 0, y: 0 },
      data: { label: 'Test' },
    }

    useFlowStore.getState().addNode(node)
    expect(useFlowStore.getState().nodes).toHaveLength(1)

    useFlowStore.getState().undo()
    expect(useFlowStore.getState().nodes).toHaveLength(0)

    useFlowStore.getState().redo()
    expect(useFlowStore.getState().nodes).toHaveLength(1)
  })
})

