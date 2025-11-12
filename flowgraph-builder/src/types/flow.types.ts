import { Node, Edge } from '@xyflow/react'

export interface FlowData {
  version: string
  nodes: Node[]
  edges: Edge[]
  viewport?: {
    x: number
    y: number
    zoom: number
  }
}

export const FLOW_VERSION = '1.0.0'

