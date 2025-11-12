import { type EdgeTypes } from '@xyflow/react'
import { type EdgeConfig, type RegisteredEdgeType } from '@/types/edge.types'

class EdgeRegistry {
  private registry = new Map<string, RegisteredEdgeType>()

  registerEdgeType(config: EdgeConfig, style?: React.CSSProperties) {
    this.registry.set(config.id, { config, style })
  }

  getEdgeType(id: string): RegisteredEdgeType | undefined {
    return this.registry.get(id)
  }

  getAllEdgeTypes(): RegisteredEdgeType[] {
    return Array.from(this.registry.values())
  }

  getEdgeConfigs(): EdgeConfig[] {
    return this.getAllEdgeTypes().map((entry) => entry.config)
  }
}

export const edgeRegistry = new EdgeRegistry()

// Register edge types
edgeRegistry.registerEdgeType({
  id: 'default',
  type: 'default',
  label: 'Default',
  color: '#64748b',
  animated: false,
  dashed: false,
})

edgeRegistry.registerEdgeType({
  id: 'conditional',
  type: 'conditional',
  label: 'Conditional',
  color: '#10b981',
  animated: true,
  dashed: true,
})

edgeRegistry.registerEdgeType({
  id: 'data',
  type: 'data',
  label: 'Data Flow',
  color: '#3b82f6',
  animated: true,
  dashed: false,
})

