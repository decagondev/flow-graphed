import { useCallback } from 'react'
import { useFlowStore } from '@/store/usFlowStore'

export const useUndoRedo = () => {
  const undo = useFlowStore((state) => state.undo)
  const redo = useFlowStore((state) => state.redo)
  const canUndo = useFlowStore((state) => state.canUndo())
  const canRedo = useFlowStore((state) => state.canRedo())

  const handleUndo = useCallback(() => {
    if (canUndo) undo()
  }, [undo, canUndo])

  const handleRedo = useCallback(() => {
    if (canRedo) redo()
  }, [redo, canRedo])

  return {
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
  }
}

