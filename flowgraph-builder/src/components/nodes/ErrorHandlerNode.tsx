import { type NodeProps, type NodeTypes } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import { AlertCircle, LucideIcon } from 'lucide-react'

export const ErrorHandlerNode: NodeTypes['errorHandler'] = (props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={AlertCircle as LucideIcon}
      color="#dc2626"
    />
  )
}

