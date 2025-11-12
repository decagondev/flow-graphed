import { type NodeTypes } from '@xyflow/react'
import { type NodeConfig, type RegisteredNodeType } from '@/types/node.types'
import { TriggerNode } from '@/components/nodes/TriggerNode'
import { APINode } from '@/components/nodes/APINode'
import { TransformNode } from '@/components/nodes/TransformNode'
import { DecisionNode } from '@/components/nodes/DecisionNode'
import { OutputNode } from '@/components/nodes/OutputNode'
import { DelayNode } from '@/components/nodes/DelayNode'
import { LoopNode } from '@/components/nodes/LoopNode'
import { MergeNode } from '@/components/nodes/MergeNode'
import { ErrorHandlerNode } from '@/components/nodes/ErrorHandlerNode'
import { CustomNode } from '@/components/nodes/CustomNode'
import { Timer, Globe, Code2, GitBranch, Send, Clock, Repeat, GitMerge, AlertCircle, Box } from 'lucide-react'

class NodeRegistry {
  private registry = new Map<string, RegisteredNodeType>()

  registerNodeType(config: NodeConfig, component: React.ComponentType<any>) {
    this.registry.set(config.type, { config, component })
  }

  getNodeType(type: string): RegisteredNodeType | undefined {
    return this.registry.get(type)
  }

  getAllNodeTypes(): RegisteredNodeType[] {
    return Array.from(this.registry.values())
  }

  getNodeTypesByCategory(category: NodeConfig['category']): RegisteredNodeType[] {
    return this.getAllNodeTypes().filter((entry) => entry.config.category === category)
  }

  getNodeTypesConfig(): NodeConfig[] {
    return this.getAllNodeTypes().map((entry) => entry.config)
  }

  getReactFlowNodeTypes(): NodeTypes {
    const nodeTypes: NodeTypes = {}
    this.registry.forEach((entry, type) => {
      nodeTypes[type] = entry.component
    })
    return nodeTypes
  }
}

export const nodeRegistry = new NodeRegistry()

// Register all node types
nodeRegistry.registerNodeType(
  {
    id: 'trigger',
    type: 'trigger',
    label: 'Timer Trigger',
    icon: Timer,
    color: '#10b981',
    category: 'trigger',
    inputs: [],
    outputs: [{ id: 'out', type: 'source', position: 'right', label: 'Output' }],
    fields: [
      { key: 'interval', label: 'Interval (ms)', type: 'number', required: true, defaultValue: 1000 },
      { key: 'payload', label: 'Payload Schema', type: 'json', defaultValue: {} },
    ],
    description: 'Starts flow on a timer interval',
  },
  TriggerNode
)

nodeRegistry.registerNodeType(
  {
    id: 'api',
    type: 'api',
    label: 'API Call',
    icon: Globe,
    color: '#3b82f6',
    category: 'action',
    inputs: [{ id: 'in', type: 'target', position: 'left', label: 'Input' }],
    outputs: [{ id: 'out', type: 'source', position: 'right', label: 'Output' }],
    fields: [
      { key: 'url', label: 'URL', type: 'url', required: true, placeholder: 'https://api.example.com' },
      { key: 'method', label: 'Method', type: 'select', required: true, defaultValue: 'GET', options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
      ]},
      { key: 'headers', label: 'Headers', type: 'json', defaultValue: {} },
    ],
    description: 'Fetches data from an external API',
  },
  APINode
)

nodeRegistry.registerNodeType(
  {
    id: 'transform',
    type: 'transform',
    label: 'Transform',
    icon: Code2,
    color: '#f59e0b',
    category: 'logic',
    inputs: [{ id: 'in', type: 'target', position: 'left', label: 'Input' }],
    outputs: [{ id: 'out', type: 'source', position: 'right', label: 'Output' }],
    fields: [
      { key: 'script', label: 'Script', type: 'code', required: true, placeholder: 'return input' },
      { key: 'inputSchema', label: 'Input Schema', type: 'json', defaultValue: {} },
      { key: 'outputSchema', label: 'Output Schema', type: 'json', defaultValue: {} },
    ],
    description: 'Manipulates data using JavaScript expressions',
  },
  TransformNode
)

nodeRegistry.registerNodeType(
  {
    id: 'decision',
    type: 'decision',
    label: 'Decision',
    icon: GitBranch,
    color: '#8b5cf6',
    category: 'logic',
    inputs: [{ id: 'in', type: 'target', position: 'left', label: 'Input' }],
    outputs: [
      { id: 'true', type: 'source', position: 'right', label: 'True', style: { top: '30%' } },
      { id: 'false', type: 'source', position: 'right', label: 'False', style: { top: '70%' } },
    ],
    fields: [
      { key: 'condition', label: 'Condition', type: 'code', required: true, placeholder: 'input.value > 10' },
      { key: 'branches', label: 'Branches', type: 'json', defaultValue: ['true', 'false'] },
    ],
    description: 'Branches flow based on conditions',
  },
  DecisionNode
)

nodeRegistry.registerNodeType(
  {
    id: 'output',
    type: 'output',
    label: 'Output',
    icon: Send,
    color: '#ef4444',
    category: 'action',
    inputs: [{ id: 'in', type: 'target', position: 'left', label: 'Input' }],
    outputs: [],
    fields: [
      { key: 'target', label: 'Target', type: 'select', required: true, options: [
        { value: 'email', label: 'Email' },
        { value: 'database', label: 'Database' },
        { value: 'log', label: 'Log' },
      ]},
      { key: 'format', label: 'Format', type: 'select', defaultValue: 'json', options: [
        { value: 'json', label: 'JSON' },
        { value: 'csv', label: 'CSV' },
      ]},
    ],
    description: 'Sends results to a target',
  },
  OutputNode
)

nodeRegistry.registerNodeType(
  {
    id: 'delay',
    type: 'delay',
    label: 'Delay',
    icon: Clock,
    color: '#06b6d4',
    category: 'logic',
    inputs: [{ id: 'in', type: 'target', position: 'left', label: 'Input' }],
    outputs: [{ id: 'out', type: 'source', position: 'right', label: 'Output' }],
    fields: [
      { key: 'duration', label: 'Duration (seconds)', type: 'number', required: true, defaultValue: 1 },
    ],
    description: 'Pauses execution for a specified duration',
  },
  DelayNode
)

nodeRegistry.registerNodeType(
  {
    id: 'loop',
    type: 'loop',
    label: 'Loop',
    icon: Repeat,
    color: '#f97316',
    category: 'logic',
    inputs: [{ id: 'in', type: 'target', position: 'left', label: 'Input' }],
    outputs: [
      { id: 'out', type: 'source', position: 'right', label: 'Output', style: { top: '30%' } },
      { id: 'done', type: 'source', position: 'right', label: 'Done', style: { top: '70%' } },
    ],
    fields: [
      { key: 'maxIterations', label: 'Max Iterations', type: 'number', required: true, defaultValue: 10 },
      { key: 'condition', label: 'Condition', type: 'code', placeholder: 'i < maxIterations' },
    ],
    description: 'Repeats a sub-flow',
  },
  LoopNode
)

nodeRegistry.registerNodeType(
  {
    id: 'merge',
    type: 'merge',
    label: 'Merge',
    icon: GitMerge,
    color: '#6366f1',
    category: 'logic',
    inputs: [
      { id: 'in1', type: 'target', position: 'left', label: 'Input 1', style: { top: '30%' } },
      { id: 'in2', type: 'target', position: 'left', label: 'Input 2', style: { top: '70%' } },
    ],
    outputs: [{ id: 'out', type: 'source', position: 'right', label: 'Output' }],
    fields: [
      { key: 'mergeType', label: 'Merge Type', type: 'select', required: true, defaultValue: 'union', options: [
        { value: 'union', label: 'Union' },
        { value: 'intersect', label: 'Intersect' },
      ]},
    ],
    description: 'Combines multiple inputs',
  },
  MergeNode
)

nodeRegistry.registerNodeType(
  {
    id: 'errorHandler',
    type: 'errorHandler',
    label: 'Error Handler',
    icon: AlertCircle,
    color: '#dc2626',
    category: 'logic',
    inputs: [{ id: 'in', type: 'target', position: 'left', label: 'Input' }],
    outputs: [
      { id: 'out', type: 'source', position: 'right', label: 'Output', style: { top: '30%' } },
      { id: 'error', type: 'source', position: 'right', label: 'Error', style: { top: '70%' } },
    ],
    fields: [
      { key: 'retryCount', label: 'Retry Count', type: 'number', defaultValue: 3 },
      { key: 'notification', label: 'Notification', type: 'text', placeholder: 'Error occurred' },
    ],
    description: 'Catches and logs errors',
  },
  ErrorHandlerNode
)

nodeRegistry.registerNodeType(
  {
    id: 'custom',
    type: 'custom',
    label: 'Custom',
    icon: Box,
    color: '#64748b',
    category: 'action',
    inputs: [{ id: 'in', type: 'target', position: 'left', label: 'Input' }],
    outputs: [{ id: 'out', type: 'source', position: 'right', label: 'Output' }],
    fields: [
      { key: 'customFields', label: 'Custom Fields', type: 'json', defaultValue: {} },
    ],
    description: 'User-defined placeholder node',
  },
  CustomNode
)

