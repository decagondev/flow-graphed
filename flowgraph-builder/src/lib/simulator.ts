import { Node, Edge } from '@xyflow/react'
import { topologicalSort, findRootNodes } from '@/utils/topologicalSort'
import { safeEval } from '@/utils/safeEval'

export type SimulationState = 'idle' | 'running' | 'paused' | 'completed' | 'error'

export interface SimulationStep {
  nodeId: string
  timestamp: number
  input?: any
  output?: any
  error?: string
}

export class FlowSimulator {
  private nodes: Node[] = []
  private edges: Edge[] = []
  private executionQueue: Node[] = []
  private currentStep: number = 0
  private nodeData: Map<string, any> = new Map()
  private steps: SimulationStep[] = []

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes
    this.edges = edges
  }

  /**
   * Initialize simulation by building execution order
   */
  initialize(): { success: boolean; error?: string } {
    // Find root nodes (triggers or nodes with no inputs)
    const rootNodes = findRootNodes(this.nodes, this.edges)
    if (rootNodes.length === 0) {
      return { success: false, error: 'No root nodes found. Add a trigger node to start.' }
    }

    // Topological sort for execution order
    const sorted = topologicalSort(this.nodes, this.edges)
    if (!sorted) {
      return { success: false, error: 'Cycle detected in flow graph. Please fix the connections.' }
    }

    // Filter to only nodes reachable from root nodes
    const reachable = new Set<string>()
    const dfs = (nodeId: string) => {
      if (reachable.has(nodeId)) return
      reachable.add(nodeId)
      this.edges
        .filter((e) => e.source === nodeId)
        .forEach((e) => dfs(e.target))
    }
    rootNodes.forEach((n) => dfs(n.id))

    this.executionQueue = sorted.filter((n) => reachable.has(n.id))
    this.currentStep = 0
    this.nodeData.clear()
    this.steps = []

    return { success: true }
  }

  /**
   * Execute next node in queue
   */
  async executeNext(): Promise<SimulationStep | null> {
    if (this.currentStep >= this.executionQueue.length) {
      return null
    }

    const node = this.executionQueue[this.currentStep]
    const step: SimulationStep = {
      nodeId: node.id,
      timestamp: Date.now(),
    }

    try {
      // Get input data from incoming edges
      const inputData = this.getNodeInput(node.id)
      step.input = inputData

      // Execute node based on type
      const output = await this.executeNode(node, inputData)
      step.output = output

      // Store output for downstream nodes
      this.nodeData.set(node.id, output)
    } catch (error) {
      step.error = error instanceof Error ? error.message : 'Unknown error'
    }

    this.steps.push(step)
    this.currentStep++

    return step
  }

  /**
   * Get input data for a node from its incoming edges
   */
  private getNodeInput(nodeId: string): any {
    const incomingEdges = this.edges.filter((e) => e.target === nodeId)
    if (incomingEdges.length === 0) {
      return null
    }

    // For now, take data from first incoming edge
    // In future, could merge multiple inputs
    const firstEdge = incomingEdges[0]
    return this.nodeData.get(firstEdge.source) || null
  }

  /**
   * Execute a node based on its type
   */
  private async executeNode(node: Node, input: any): Promise<any> {
    const nodeType = node.type || 'custom'
    const data = node.data || {}

    switch (nodeType) {
      case 'trigger':
        // Trigger nodes generate initial data
        return {
          timestamp: Date.now(),
          interval: data.interval || 1000,
          payload: data.payload || {},
        }

      case 'api':
        // Simulate API call
        return {
          url: data.url || '',
          method: data.method || 'GET',
          response: { status: 200, data: 'Simulated API response' },
        }

      case 'transform':
        // Execute transform script
        if (data.script) {
          try {
            return safeEval(data.script, { input, data })
          } catch (error) {
            throw new Error(`Transform error: ${error instanceof Error ? error.message : 'Unknown'}`)
          }
        }
        return input

      case 'decision':
        // Evaluate condition
        if (data.condition) {
          try {
            const result = safeEval(data.condition, { input, data })
            return { condition: result, branch: result ? 'true' : 'false' }
          } catch (error) {
            throw new Error(`Decision error: ${error instanceof Error ? error.message : 'Unknown'}`)
          }
        }
        return { condition: false, branch: 'false' }

      case 'delay':
        // Simulate delay
        const duration = (data.duration || 1) * 1000
        await new Promise((resolve) => setTimeout(resolve, Math.min(duration, 1000))) // Cap at 1s for simulation
        return input

      case 'output':
        // Output node - just pass through
        return { target: data.target, format: data.format, data: input }

      case 'loop':
        // Loop node - simplified for simulation
        return { iteration: 1, maxIterations: data.maxIterations || 10, data: input }

      case 'merge':
        // Merge multiple inputs
        const mergeType = data.mergeType || 'union'
        const allInputs = this.edges
          .filter((e) => e.target === node.id)
          .map((e) => this.nodeData.get(e.source))
          .filter((x) => x !== undefined)
        return { mergeType, inputs: allInputs }

      case 'errorHandler':
        // Error handler - just pass through
        return input

      default:
        return input
    }
  }

  /**
   * Get current progress
   */
  getProgress(): { current: number; total: number; percentage: number } {
    return {
      current: this.currentStep,
      total: this.executionQueue.length,
      percentage: this.executionQueue.length > 0 ? (this.currentStep / this.executionQueue.length) * 100 : 0,
    }
  }

  /**
   * Get all execution steps
   */
  getSteps(): SimulationStep[] {
    return [...this.steps]
  }

  /**
   * Reset simulation
   */
  reset(): void {
    this.currentStep = 0
    this.nodeData.clear()
    this.steps = []
  }

  /**
   * Check if simulation is complete
   */
  isComplete(): boolean {
    return this.currentStep >= this.executionQueue.length
  }
}

