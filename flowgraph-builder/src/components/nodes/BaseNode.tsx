import { memo, createElement } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LucideIcon } from 'lucide-react'
import type { HandleConfig } from '@/types/node.types'
import { useFlowStore } from '@/store/usFlowStore'

export const BaseNode = memo(({ data, selected: nodeSelected, id }: NodeProps & { icon: LucideIcon; color: string }) => {
  const selectedId = useFlowStore((state) => state.selectedId)
  const isSelected = nodeSelected || selectedId === id
  const Icon = data.icon
  const inputs = (data.inputs as HandleConfig[]) || []
  const outputs = (data.outputs as HandleConfig[]) || []
  const status = data.status as string | undefined
  const isActive = status === 'success' || status === 'executing'
  const isError = status === 'error'

  const getPosition = (position: string) => {
    switch (position) {
      case 'top':
        return Position.Top
      case 'bottom':
        return Position.Bottom
      case 'left':
        return Position.Left
      case 'right':
        return Position.Right
      default:
        return Position.Left
    }
  }

  return (
    <Card
      className={`px-4 py-3 shadow-lg border-2 transition-all ${
        isActive
          ? 'border-green-500 ring-2 ring-green-200 animate-pulse'
          : isError
            ? 'border-red-500 ring-2 ring-red-200'
            : isSelected
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-gray-200'
      } dark:border-gray-700`}
      role="button"
      tabIndex={0}
      aria-label={`Node ${data.label}, ${isSelected ? 'selected' : 'not selected'}`}
    >
      <div className="flex items-center gap-2">
        {Icon && createElement(Icon as React.ElementType, { className: 'w-5 h-5', style: { color: data.color as string } })}
        <span className="font-semibold">{data.label as string}</span>
        {typeof data.status === 'string' && (
          <Badge variant={data.status as 'default' | 'secondary' | 'destructive' | 'outline'}>
            {data.status}
          </Badge>
        )}
      </div>

      {inputs.map((handle: HandleConfig) => (
        <Handle
          key={handle.id}
          type="target"
          position={getPosition(handle.position)}
          id={handle.id}
          style={{ ...handle.style }}
          label={handle.label}
          aria-label={`Input handle ${handle.label || handle.id} for ${data.label}`}
        />
      ))}
      {outputs.map((handle: HandleConfig) => (
        <Handle
          key={handle.id}
          type="source"
          position={getPosition(handle.position)}
          id={handle.id}
          style={{ ...handle.style }}
          label={handle.label}
          aria-label={`Output handle ${handle.label || handle.id} for ${data.label}`}
        />
      ))}
    </Card>
  )
})