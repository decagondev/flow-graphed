import { Button } from '@/components/ui/button'
import { Undo2, Redo2, Play, Pause, Square, Download, Upload, StepForward } from 'lucide-react'
import { useUndoRedo } from '@/hooks/useUndoRedo'
import { useSimulation } from '@/hooks/useSimulation'
import { useFlowStore } from '@/store/usFlowStore'
import { downloadFlow, loadFlowFromFile } from '@/lib/flowSerializer'
import { useReactFlow } from '@xyflow/react'
import { useEffect, useRef } from 'react'
import { ShortcutModal } from './ShortcutModal'

export const Toolbar: React.FC = () => {
  const { undo, redo, canUndo, canRedo } = useUndoRedo()
  const { state, start, pause, resume, reset, step } = useSimulation()
  const nodes = useFlowStore((state) => state.nodes)
  const edges = useFlowStore((state) => state.edges)
  const setNodes = useFlowStore((state) => state.setNodes)
  const setEdges = useFlowStore((state) => state.setEdges)
  const { getViewport } = useReactFlow()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        if (canUndo) undo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        if (canRedo) redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  return (
    <div className="h-16 border-b bg-white dark:bg-gray-800 px-4 flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo}>
        <Undo2 className="w-4 h-4 mr-2" /> Undo
      </Button>
      <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo}>
        <Redo2 className="w-4 h-4 mr-2" /> Redo
      </Button>
      <div className="h-8 w-px bg-gray-300 mx-2" />
      {state === 'idle' && (
        <Button className="bg-green-600 hover:bg-green-700" onClick={start}>
          <Play className="w-4 h-4 mr-2" /> Run
        </Button>
      )}
      {state === 'running' && (
        <>
          <Button variant="outline" onClick={pause}>
            <Pause className="w-4 h-4 mr-2" /> Pause
          </Button>
          <Button variant="outline" onClick={reset}>
            <Square className="w-4 h-4 mr-2" /> Reset
          </Button>
        </>
      )}
      {state === 'paused' && (
        <>
          <Button className="bg-green-600 hover:bg-green-700" onClick={resume}>
            <Play className="w-4 h-4 mr-2" /> Resume
          </Button>
          <Button variant="outline" onClick={step}>
            <StepForward className="w-4 h-4 mr-2" /> Step
          </Button>
          <Button variant="outline" onClick={reset}>
            <Square className="w-4 h-4 mr-2" /> Reset
          </Button>
        </>
      )}
      {state === 'completed' && (
        <Button variant="outline" onClick={reset}>
          <Square className="w-4 h-4 mr-2" /> Reset
        </Button>
      )}
      <div className="ml-auto flex gap-2 items-center">
        <ShortcutModal />
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (file) {
              const result = await loadFlowFromFile(file)
              if (result.success && result.data) {
                setNodes(result.data.nodes)
                setEdges(result.data.edges)
              } else {
                alert(result.error || 'Failed to import flow')
              }
            }
          }}
        />
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Upload className="w-4 h-4 mr-2" /> Import
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const viewport = getViewport()
            downloadFlow(nodes, edges, { x: viewport.x, y: viewport.y, zoom: viewport.zoom })
          }}
        >
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>
    </div>
  )
}