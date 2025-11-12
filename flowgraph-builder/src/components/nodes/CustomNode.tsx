import { type NodeProps, type NodeTypes } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import { Box, LucideIcon } from 'lucide-react'

export const CustomNode: NodeTypes['custom'] = (props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={Box as LucideIcon}
      color="#64748b"
    />
  )
}

