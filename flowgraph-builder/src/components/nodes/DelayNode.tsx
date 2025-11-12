import { type NodeProps, type NodeTypes } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import { Clock, LucideIcon } from 'lucide-react'

export const DelayNode: NodeTypes['delay'] = (props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={Clock as LucideIcon}
      color="#06b6d4"
    />
  )
}

