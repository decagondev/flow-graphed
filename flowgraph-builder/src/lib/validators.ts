import { z } from 'zod'
import type { FieldConfig } from '@/types/node.types'

export const createFieldSchema = (field: FieldConfig): z.ZodSchema => {
  if (field.schema) return field.schema

  let schema: z.ZodSchema

  switch (field.type) {
    case 'number':
      schema = z.number()
      break
    case 'boolean':
      schema = z.boolean()
      break
    case 'url':
      schema = z.string().url('Invalid URL format')
      break
    case 'json':
      schema = z.any().refine(
        (val) => {
          try {
            JSON.parse(typeof val === 'string' ? val : JSON.stringify(val))
            return true
          } catch {
            return false
          }
        },
        { message: 'Invalid JSON' }
      )
      break
    case 'code':
      schema = z.string()
      break
    default:
      schema = z.string()
  }

  if (field.required) {
    schema = schema as z.ZodString | z.ZodNumber | z.ZodBoolean
    if (field.type === 'string' || field.type === 'text' || field.type === 'url' || field.type === 'code' || field.type === 'textarea') {
      schema = (schema as z.ZodString).min(1, 'This field is required')
    }
  }

  return schema
}

export const createNodeSchema = (fields: FieldConfig[]) => {
  const shape: Record<string, z.ZodSchema> = {}
  fields.forEach((field) => {
    shape[field.key] = createFieldSchema(field)
  })
  return z.object(shape)
}

