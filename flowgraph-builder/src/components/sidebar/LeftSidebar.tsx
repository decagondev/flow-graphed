import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { nodeRegistry } from '@/lib/nodeRegistry'
import { useState, useMemo } from 'react'
import { createElement } from 'react'

export const LeftSidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const allNodeTypes = useMemo(() => nodeRegistry.getAllNodeTypes(), [])
  const filteredNodes = useMemo(() => {
    if (!searchQuery) return allNodeTypes
    const query = searchQuery.toLowerCase()
    return allNodeTypes.filter((entry) =>
      entry.config.label.toLowerCase().includes(query) ||
      entry.config.description?.toLowerCase().includes(query)
    )
  }, [allNodeTypes, searchQuery])

  const nodesByCategory = useMemo(() => {
    const categories: Record<string, typeof filteredNodes> = {
      trigger: [],
      logic: [],
      action: [],
      data: [],
    }
    filteredNodes.forEach((entry) => {
      const category = entry.config.category
      if (categories[category]) {
        categories[category].push(entry)
      }
    })
    return categories
  }, [filteredNodes])

  return (
    <Sheet defaultOpen>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Node Library</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <Input
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <Accordion type="multiple" className="w-full">
            {Object.entries(nodesByCategory).map(([category, nodes]) => {
              if (nodes.length === 0) return null
              return (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="capitalize">{category}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {nodes.map((entry) => {
                        const Icon = entry.config.icon
                        return (
                          <div
                            key={entry.config.type}
                            draggable
                            onDragStart={(e) => onDragStart(e, entry.config.type)}
                            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 cursor-move hover:border-blue-400 transition-colors"
                          >
                            {createElement(Icon, { className: 'w-5 h-5', style: { color: entry.config.color } })}
                            <div className="flex-1">
                              <div className="font-medium text-sm">{entry.config.label}</div>
                              {entry.config.description && (
                                <div className="text-xs text-gray-500">{entry.config.description}</div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  )
}