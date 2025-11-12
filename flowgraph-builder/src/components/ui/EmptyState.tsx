import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useFlowStore } from '@/store/usFlowStore'
import type { FlowData } from '@/lib/flowSerializer'

const apiToSlackTemplate: FlowData = {
  version: '1.0.0',
  nodes: [
    {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 100, y: 100 },
      data: {
        label: 'Timer Trigger',
        icon: null,
        color: '#10b981',
        interval: 5000,
        payload: {},
      },
    },
    {
      id: 'api-1',
      type: 'api',
      position: { x: 300, y: 100 },
      data: {
        label: 'API Call',
        icon: null,
        color: '#3b82f6',
        url: 'https://api.example.com/data',
        method: 'GET',
        headers: {},
      },
    },
    {
      id: 'transform-1',
      type: 'transform',
      position: { x: 500, y: 100 },
      data: {
        label: 'Transform',
        icon: null,
        color: '#f59e0b',
        script: 'return { message: input.response.data }',
      },
    },
    {
      id: 'output-1',
      type: 'output',
      position: { x: 700, y: 100 },
      data: {
        label: 'Output',
        icon: null,
        color: '#ef4444',
        target: 'log',
        format: 'json',
      },
    },
  ],
  edges: [
    { id: 'e1', source: 'trigger-1', target: 'api-1', type: 'smoothstep' },
    { id: 'e2', source: 'api-1', target: 'transform-1', type: 'smoothstep' },
    { id: 'e3', source: 'transform-1', target: 'output-1', type: 'smoothstep' },
  ],
}

const cronEmailTemplate: FlowData = {
  version: '1.0.0',
  nodes: [
    {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 100, y: 100 },
      data: {
        label: 'Timer Trigger',
        icon: null,
        color: '#10b981',
        interval: 3600000,
        payload: {},
      },
    },
    {
      id: 'api-1',
      type: 'api',
      position: { x: 300, y: 100 },
      data: {
        label: 'API Call',
        icon: null,
        color: '#3b82f6',
        url: 'https://api.example.com/reports',
        method: 'GET',
        headers: {},
      },
    },
    {
      id: 'output-1',
      type: 'output',
      position: { x: 500, y: 100 },
      data: {
        label: 'Output',
        icon: null,
        color: '#ef4444',
        target: 'email',
        format: 'json',
      },
    },
  ],
  edges: [
    { id: 'e1', source: 'trigger-1', target: 'api-1', type: 'smoothstep' },
    { id: 'e2', source: 'api-1', target: 'output-1', type: 'smoothstep' },
  ],
}

const templates = [
  { name: 'API to Slack', description: 'Fetch data from API and send to Slack', data: apiToSlackTemplate },
  { name: 'Cron Email', description: 'Periodic email reports', data: cronEmailTemplate },
]

export const EmptyState: React.FC = () => {
  const setNodes = useFlowStore((state) => state.setNodes)
  const setEdges = useFlowStore((state) => state.setEdges)

  const loadTemplate = (templateData: FlowData) => {
    setNodes(templateData.nodes)
    setEdges(templateData.edges)
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">Welcome to FlowGraph Builder</h2>
        <p className="text-gray-500 mb-8">Get started by dragging a node from the sidebar or choose a template</p>

        <div className="grid grid-cols-2 gap-4">
          {templates.map((template, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => loadTemplate(template.data as FlowData)}>Use this template</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

