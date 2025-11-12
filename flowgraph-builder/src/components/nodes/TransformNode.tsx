import { BaseNode } from './BaseNode'
import { Code2 } from 'lucide-react'

export const TransformNode = (props: any) => (
  <BaseNode
    {...props}
    data={{
      ...props.data,
      label: props.data.label || 'Transform',
      icon: Code2,
      color: '#f59e0b',
      inputs: [{ id: 'in', top: 30 }],
      outputs: [{ id: 'out', top: 30 }],
    }}
  />
)