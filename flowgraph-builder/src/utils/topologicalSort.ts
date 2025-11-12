import { Node, Edge } from '@xyflow/react'

/**
 * Kahn's algorithm for topological sorting of a DAG
 * Returns nodes in execution order, or null if cycle detected
 */
export function topologicalSort(nodes: Node[], edges: Edge[]): Node[] | null {
  // Build adjacency list and in-degree map
  const graph = new Map<string, string[]>()
  const inDegree = new Map<string, number>()

  // Initialize
  nodes.forEach((node) => {
    graph.set(node.id, [])
    inDegree.set(node.id, 0)
  })

  // Build graph
  edges.forEach((edge) => {
    const source = edge.source
    const target = edge.target
    if (graph.has(source) && graph.has(target)) {
      graph.get(source)!.push(target)
      inDegree.set(target, (inDegree.get(target) || 0) + 1)
    }
  })

  // Find all nodes with in-degree 0 (root nodes)
  const queue: string[] = []
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId)
    }
  })

  const result: Node[] = []
  const nodeMap = new Map(nodes.map((n) => [n.id, n]))

  // Process queue
  while (queue.length > 0) {
    const nodeId = queue.shift()!
    const node = nodeMap.get(nodeId)
    if (node) {
      result.push(node)
    }

    // Decrease in-degree of neighbors
    const neighbors = graph.get(nodeId) || []
    neighbors.forEach((neighborId) => {
      const currentDegree = inDegree.get(neighborId) || 0
      inDegree.set(neighborId, currentDegree - 1)
      if (inDegree.get(neighborId) === 0) {
        queue.push(neighborId)
      }
    })
  }

  // Check for cycle (if result length < nodes length, there's a cycle)
  if (result.length !== nodes.length) {
    return null // Cycle detected
  }

  return result
}

/**
 * Find root nodes (nodes with no incoming edges)
 */
export function findRootNodes(nodes: Node[], edges: Edge[]): Node[] {
  const hasIncoming = new Set(edges.map((e) => e.target))
  return nodes.filter((node) => !hasIncoming.has(node.id))
}

