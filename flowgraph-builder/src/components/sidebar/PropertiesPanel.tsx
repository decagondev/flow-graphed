import { useFlowStore } from '@/store/usFlowStore'
import { nodeRegistry } from '@/lib/nodeRegistry'
import { FieldRenderer } from './FieldRenderer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const PropertiesPanel: React.FC = () => {
  const selectedId = useFlowStore((state) => state.selectedId)
  const nodes = useFlowStore((state) => state.nodes)
  const edges = useFlowStore((state) => state.edges)

  const selectedNode = nodes.find((n) => n.id === selectedId)
  const selectedEdge = edges.find((e) => e.id === selectedId)

  if (!selectedNode && !selectedEdge) {
    return (
      <div className="mt-6 p-4 text-center text-gray-500">
        <p>No selection</p>
        <p className="text-sm mt-2">Click a node or edge to edit its properties</p>
      </div>
    )
  }

  if (selectedNode) {
    const nodeType = nodeRegistry.getNodeType(selectedNode.type || '')
    if (!nodeType) {
      return <div className="mt-6 p-4 text-center text-gray-500">Unknown node type</div>
    }

    return (
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{nodeType.config.label}</CardTitle>
            <CardDescription>{nodeType.config.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 mt-4">
                {nodeType.config.fields
                  .filter((field) => field.type !== 'code' && field.type !== 'json')
                  .map((field) => (
                    <FieldRenderer key={field.key} field={field} nodeId={selectedNode.id} />
                  ))}
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4 mt-4">
                {nodeType.config.fields
                  .filter((field) => field.type === 'json')
                  .map((field) => (
                    <FieldRenderer key={field.key} field={field} nodeId={selectedNode.id} />
                  ))}
              </TabsContent>
              <TabsContent value="code" className="space-y-4 mt-4">
                {nodeType.config.fields
                  .filter((field) => field.type === 'code')
                  .map((field) => (
                    <FieldRenderer key={field.key} field={field} nodeId={selectedNode.id} />
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Edge properties (simplified for now)
  return (
    <div className="mt-6 p-4">
      <p className="text-sm text-gray-500">Edge properties coming soon</p>
    </div>
  )
}

