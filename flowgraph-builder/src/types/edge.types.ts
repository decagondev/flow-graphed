export type EdgeType = 'default' | 'conditional' | 'data'

export interface EdgeConfig {
  id: string
  type: EdgeType
  label: string
  color?: string
  animated?: boolean
  dashed?: boolean
  condition?: string
  dataType?: string
}

export interface RegisteredEdgeType {
  config: EdgeConfig
  style?: React.CSSProperties
}

