import { type NodeProps, type NodeTypes } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import { GitBranch, LucideIcon } from 'lucide-react'

export const DecisionNode: NodeTypes['decision'] = (props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={GitBranch as LucideIcon}
      color="#8b5cf6"
    />
  )
}

