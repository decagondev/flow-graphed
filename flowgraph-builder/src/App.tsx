import { FlowCanvas } from './components/canvas/FlowCanvas'
import { LeftSidebar } from './components/sidebar/LeftSidebar'
import { RightSidebar } from './components/sidebar/RightSidebar'
import { Toolbar } from '@/components/ui/Toolbar'
import { LogPanel } from './components/ui/LogPanel'
import { EmptyState } from './components/ui/EmptyState'
import { Toaster } from '@/components/ui/sonner'
import { useFlowStore } from '@/store/usFlowStore'
import { useHotkeys } from './hooks/useHotkeys'
import { useEffect } from 'react'

export const App: React.FC = () => {
  const { addLog } = useFlowStore.getState()
  const nodes = useFlowStore((state) => state.nodes)
  useHotkeys()

  useEffect(() => {
    addLog('App mounted', 'info')
  }, [])

  return (
    <>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <LeftSidebar />
        <div className="flex-1 flex flex-col">
          <Toolbar />
          {nodes.length === 0 ? (
            <div className="flex-1">
              <EmptyState />
            </div>
          ) : (
            <FlowCanvas />
          )}
          <LogPanel />
        </div>
        <RightSidebar />
      </div>
      <Toaster richColors />
    </>
  )
}

export default App