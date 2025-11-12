import { LucideIcon } from 'lucide-react'
import { z } from 'zod'

export type HandlePosition = 'top' | 'bottom' | 'left' | 'right'

export interface HandleConfig {
  id: string
  type: 'source' | 'target'
  position: HandlePosition
  label?: string
  dataType?: string
  style?: React.CSSProperties
}

export type FieldType = 'text' | 'number' | 'select' | 'json' | 'code' | 'boolean' | 'url' | 'textarea'

export interface FieldConfig {
  key: string
  label: string
  type: FieldType
  required?: boolean
  defaultValue?: unknown
  placeholder?: string
  options?: { value: string; label: string }[]
  schema?: z.ZodSchema
  description?: string
}

export interface NodeConfig {
  id: string
  type: string
  label: string
  icon: LucideIcon
  color: string
  category: 'trigger' | 'logic' | 'action' | 'data'
  inputs?: HandleConfig[]
  outputs?: HandleConfig[]
  fields: FieldConfig[]
  description?: string
}

export interface RegisteredNodeType {
  config: NodeConfig
  component: React.ComponentType<any>
}

