import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFlowStore } from '@/store/usFlowStore'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Editor } from '@monaco-editor/react'
import { useMemo, useEffect, useRef } from 'react'
import { z } from 'zod'
import type { FieldConfig } from '@/types/node.types'

interface FieldRendererProps {
  field: FieldConfig
  nodeId: string
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, nodeId }) => {
  const nodes = useFlowStore((state) => state.nodes)
  const updateNode = useFlowStore((state) => state.updateNode)

  const node = nodes.find((n) => n.id === nodeId)

  const schema = useMemo(() => {
    if (field.schema) {
      return z.object({ [field.key]: field.schema })
    }
    let fieldSchema: z.ZodTypeAny
    switch (field.type) {
      case 'number':
        fieldSchema = z.number()
        break
      case 'boolean':
        fieldSchema = z.boolean()
        break
      case 'url':
        fieldSchema = z.string().url()
        break
      default:
        fieldSchema = z.string()
    }
    return z.object({ [field.key]: fieldSchema })
  }, [field])

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      [field.key]: node?.data[field.key] ?? field.defaultValue ?? '',
    },
  })

  useEffect(() => {
    if (node?.data[field.key] !== undefined) {
      form.setValue(field.key, node.data[field.key])
    }
  }, [node, field.key, form])

  const debounceTimeoutRef = useRef<NodeJS.Timeout>()

  const updateNodeValue = (value: any) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    debounceTimeoutRef.current = setTimeout(() => {
      updateNode(nodeId, { [field.key]: value })
    }, field.type === 'code' ? 500 : 300)
  }

  const handleChange = (value: any) => {
    form.setValue(field.key, value)
    updateNodeValue(value)
  }

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'url':
        return (
          <Input
            {...form.register(field.key)}
            type={field.type === 'url' ? 'url' : 'text'}
            placeholder={field.placeholder}
            onChange={(e) => {
              form.setValue(field.key, e.target.value)
              updateNodeValue(e.target.value)
            }}
          />
        )
      case 'textarea':
        return (
          <Textarea
            {...form.register(field.key)}
            placeholder={field.placeholder}
            onChange={(e) => {
              form.setValue(field.key, e.target.value)
              updateNodeValue(e.target.value)
            }}
          />
        )
      case 'number':
        return (
          <Input
            {...form.register(field.key, { valueAsNumber: true })}
            type="number"
            placeholder={field.placeholder}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : 0
              form.setValue(field.key, value)
              updateNodeValue(value)
            }}
          />
        )
      case 'boolean':
        return (
          <Select
            value={form.watch(field.key) ? 'true' : 'false'}
            onValueChange={(value) => handleChange(value === 'true')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        )
      case 'select':
        return (
          <Select
            value={form.watch(field.key) || field.defaultValue}
            onValueChange={handleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'json':
        return (
          <Editor
            height="200px"
            defaultLanguage="json"
            value={JSON.stringify(node?.data[field.key] || field.defaultValue || {}, null, 2)}
            onChange={(value) => {
              try {
                const parsed = JSON.parse(value || '{}')
                form.setValue(field.key, parsed)
                updateNodeValue(parsed)
              } catch {
                // Invalid JSON, don't update
              }
            }}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 12,
            }}
          />
        )
      case 'code':
        return (
          <Editor
            height="300px"
            defaultLanguage="javascript"
            value={node?.data[field.key] || field.defaultValue || field.placeholder || ''}
            onChange={(value) => {
              form.setValue(field.key, value || '')
              updateNodeValue(value || '')
            }}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 12,
            }}
          />
        )
      default:
        return <Input {...form.register(field.key)} placeholder={field.placeholder} />
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.key}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {field.description && <p className="text-xs text-gray-500">{field.description}</p>}
    </div>
  )
}

