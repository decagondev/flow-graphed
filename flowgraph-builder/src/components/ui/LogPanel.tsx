import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useFlowStore } from '@/store/usFlowStore'
import { Button } from './button'
import { useCallback } from 'react'

export const LogPanel: React.FC = () => {
  const { logs, clearLogs } = useFlowStore.getState()

  const handleClearLogs = useCallback(() => {
    clearLogs()
  }, [])

  return (
    <Sheet defaultOpen>
      <SheetContent side="bottom" className="h-64">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Simulation Logs</h3>
          <Button variant="ghost" size="sm" onClick={handleClearLogs}>Clear</Button>
        </div>
        <div className="overflow-y-auto h-full font-mono text-sm">
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet. Run a simulation!</p>
          ) : (
            logs.map((log: { id: string; timestamp: number; message: string; type: 'info' | 'error' | 'success' }) => (
              <div key={log.id} className="py-1 flex items-center gap-2">
                <Badge variant={log.type === 'error' ? 'destructive' : log.type === 'success' ? 'default' : 'secondary'}>
                  {new Date(log.timestamp).toLocaleTimeString()}
                </Badge>
                <span>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}