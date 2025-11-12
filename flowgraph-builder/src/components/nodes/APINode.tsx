import { type NodeProps, type NodeTypes } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import { Globe, LucideIcon } from 'lucide-react'

export const APINode: NodeTypes['api'] = (props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={Globe as LucideIcon}
      color="#3b82f6"
    />
  )
}