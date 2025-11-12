import { describe, it, expect } from 'vitest'
import { topologicalSort, findRootNodes } from '../topologicalSort'
import { Node, Edge } from '@xyflow/react'

describe('topologicalSort', () => {
  it('should sort nodes in correct order', () => {
    const nodes: Node[] = [
      { id: '1', type: 'trigger', position: { x: 0, y: 0 }, data: {} },
      { id: '2', type: 'api', position: { x: 0, y: 0 }, data: {} },
      { id: '3', type: 'output', position: { x: 0, y: 0 }, data: {} },
    ]

    const edges: Edge[] = [
      { id: 'e1', source: '1', target: '2', type: 'smoothstep' },
      { id: 'e2', source: '2', target: '3', type: 'smoothstep' },
    ]

    const sorted = topologicalSort(nodes, edges)
    expect(sorted).not.toBeNull()
    expect(sorted![0].id).toBe('1')
    expect(sorted![1].id).toBe('2')
    expect(sorted![2].id).toBe('3')
  })

  it('should detect cycles', () => {
    const nodes: Node[] = [
      { id: '1', type: 'trigger', position: { x: 0, y: 0 }, data: {} },
      { id: '2', type: 'api', position: { x: 0, y: 0 }, data: {} },
    ]

    const edges: Edge[] = [
      { id: 'e1', source: '1', target: '2', type: 'smoothstep' },
      { id: 'e2', source: '2', target: '1', type: 'smoothstep' },
    ]

    const sorted = topologicalSort(nodes, edges)
    expect(sorted).toBeNull()
  })

  it('should find root nodes', () => {
    const nodes: Node[] = [
      { id: '1', type: 'trigger', position: { x: 0, y: 0 }, data: {} },
      { id: '2', type: 'api', position: { x: 0, y: 0 }, data: {} },
    ]

    const edges: Edge[] = [{ id: 'e1', source: '1', target: '2', type: 'smoothstep' }]

    const roots = findRootNodes(nodes, edges)
    expect(roots).toHaveLength(1)
    expect(roots[0].id).toBe('1')
  })
})

