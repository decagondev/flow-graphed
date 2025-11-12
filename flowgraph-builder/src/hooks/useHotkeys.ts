import { useEffect } from 'react'
import { useFlowStore } from '@/store/usFlowStore'
import { useUndoRedo } from './useUndoRedo'

export const useHotkeys = () => {
  const nodes = useFlowStore((state) => state.nodes)
  const selectedId = useFlowStore((state) => state.selectedId)
  const setSelected = useFlowStore((state) => state.setSelected)
  const onNodesChange = useFlowStore((state) => state.onNodesChange)
  const { undo, redo } = useUndoRedo()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (
        (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA' ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      // Delete selected node
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          onNodesChange([{ type: 'remove', id: selectedId }])
          setSelected(null)
          e.preventDefault()
        }
      }

      // Copy (Ctrl+C / Cmd+C)
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (selectedId) {
          const node = nodes.find((n) => n.id === selectedId)
          if (node) {
            navigator.clipboard.writeText(JSON.stringify(node, null, 2))
            e.preventDefault()
          }
        }
      }

      // Escape to deselect
      if (e.key === 'Escape') {
        setSelected(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, selectedId, setSelected, onNodesChange])
}

