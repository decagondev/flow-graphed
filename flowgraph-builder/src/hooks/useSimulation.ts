import { useState, useCallback, useRef } from 'react'
import { useFlowStore } from '@/store/usFlowStore'
import { FlowSimulator, type SimulationState, type SimulationStep } from '@/lib/simulator'

export const useSimulation = () => {
  const [state, setState] = useState<SimulationState>('idle')
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)
  const simulatorRef = useRef<FlowSimulator | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nodes = useFlowStore((state) => state.nodes)
  const edges = useFlowStore((state) => state.edges)
  const addLog = useFlowStore((state) => state.addLog)
  const updateNode = useFlowStore((state) => state.updateNode)

  const start = useCallback(async () => {
    const simulator = new FlowSimulator(nodes, edges)
    const init = simulator.initialize()

    if (!init.success) {
      addLog(init.error || 'Failed to initialize simulation', 'error')
      return
    }

    simulatorRef.current = simulator
    setState('running')
    addLog('Simulation started', 'info')

    // Execute steps with delay for visualization
    const executeStep = async () => {
      if (!simulatorRef.current || simulatorRef.current.isComplete()) {
        setState('completed')
        setActiveNodeId(null)
        addLog('Simulation completed', 'success')
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        return
      }

      const step = await simulatorRef.current.executeNext()
      if (step) {
        setActiveNodeId(step.nodeId)
        updateNode(step.nodeId, { status: step.error ? 'error' : 'success' })

        if (step.error) {
          addLog(`Node ${step.nodeId}: ${step.error}`, 'error')
        } else {
          addLog(`Node ${step.nodeId} executed successfully`, 'success')
        }

        // Auto-advance after delay
        intervalRef.current = setTimeout(executeStep, 500)
      }
    }

    executeStep()
  }, [nodes, edges, addLog, updateNode])

  const pause = useCallback(() => {
    setState('paused')
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    addLog('Simulation paused', 'info')
  }, [addLog])

  const resume = useCallback(() => {
    if (!simulatorRef.current) return
    setState('running')
    addLog('Simulation resumed', 'info')

    const executeStep = async () => {
      if (!simulatorRef.current || simulatorRef.current.isComplete()) {
        setState('completed')
        setActiveNodeId(null)
        addLog('Simulation completed', 'success')
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        return
      }

      const step = await simulatorRef.current.executeNext()
      if (step) {
        setActiveNodeId(step.nodeId)
        updateNode(step.nodeId, { status: step.error ? 'error' : 'success' })

        if (step.error) {
          addLog(`Node ${step.nodeId}: ${step.error}`, 'error')
        } else {
          addLog(`Node ${step.nodeId} executed successfully`, 'success')
        }

        intervalRef.current = setTimeout(executeStep, 500)
      }
    }

    executeStep()
  }, [addLog, updateNode])

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (simulatorRef.current) {
      simulatorRef.current.reset()
    }
    setState('idle')
    setActiveNodeId(null)
    nodes.forEach((node) => {
      updateNode(node.id, { status: undefined })
    })
    addLog('Simulation reset', 'info')
  }, [nodes, updateNode, addLog])

  const step = useCallback(async () => {
    if (!simulatorRef.current) {
      const simulator = new FlowSimulator(nodes, edges)
      const init = simulator.initialize()
      if (!init.success) {
        addLog(init.error || 'Failed to initialize', 'error')
        return
      }
      simulatorRef.current = simulator
      setState('running')
    }

    if (simulatorRef.current.isComplete()) {
      setState('completed')
      setActiveNodeId(null)
      return
    }

    const stepResult = await simulatorRef.current.executeNext()
    if (stepResult) {
      setActiveNodeId(stepResult.nodeId)
      updateNode(stepResult.nodeId, { status: stepResult.error ? 'error' : 'success' })

      if (stepResult.error) {
        addLog(`Node ${stepResult.nodeId}: ${stepResult.error}`, 'error')
      } else {
        addLog(`Node ${stepResult.nodeId} executed`, 'success')
      }
    }
  }, [nodes, edges, addLog, updateNode])

  return {
    state,
    activeNodeId,
    start,
    pause,
    resume,
    reset,
    step,
  }
}

