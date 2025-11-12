import { type NodeProps, type NodeTypes } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import { LucideIcon, Timer } from 'lucide-react'

export const TriggerNode: NodeTypes['trigger'] = (props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={Timer as LucideIcon}
      color="#10b981"
    />
  )
}