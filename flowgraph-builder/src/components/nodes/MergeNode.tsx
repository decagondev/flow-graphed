import { type NodeProps, type NodeTypes } from '@xyflow/react'
import { BaseNode } from './BaseNode'
import { GitMerge, LucideIcon } from 'lucide-react'

export const MergeNode: NodeTypes['merge'] = (props: NodeProps) => {
  return (
    <BaseNode
      {...props}
      icon={GitMerge as LucideIcon}
      color="#6366f1"
    />
  )
}

