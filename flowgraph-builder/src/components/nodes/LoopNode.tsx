import { type NodeProps, type NodeTypes } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import { Repeat, LucideIcon } from 'lucide-react'

export const LoopNode: NodeTypes['loop'] = (props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={Repeat as LucideIcon}
      color="#f97316"
    />
  )
}

