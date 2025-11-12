import { type NodeProps, type NodeTypes } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import { Send, LucideIcon } from 'lucide-react'

export const OutputNode: NodeTypes['output'] = (props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={Send as LucideIcon}
      color="#ef4444"
    />
  )
}

