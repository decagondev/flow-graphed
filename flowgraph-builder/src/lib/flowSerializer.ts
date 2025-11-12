import { Node, Edge } from '@xyflow/react'
import { FLOW_VERSION, type FlowData } from '@/types/flow.types'
import { z } from 'zod'

const FlowDataSchema = z.object({
  version: z.string(),
  nodes: z.array(z.any()),
  edges: z.array(z.any()),
  viewport: z
    .object({
      x: z.number(),
      y: z.number(),
      zoom: z.number(),
    })
    .optional(),
})

export function exportFlow(nodes: Node[], edges: Edge[], viewport?: { x: number; y: number; zoom: number }): string {
  const flowData: FlowData = {
    version: FLOW_VERSION,
    nodes,
    edges,
    viewport,
  }

  return JSON.stringify(flowData, null, 2)
}

export function importFlow(json: string): { success: boolean; data?: FlowData; error?: string } {
  try {
    const parsed = JSON.parse(json)
    const validated = FlowDataSchema.parse(parsed)

    return {
      success: true,
      data: validated as FlowData,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid flow file format',
    }
  }
}

export function downloadFlow(nodes: Node[], edges: Edge[], viewport?: { x: number; y: number; zoom: number }): void {
  const json = exportFlow(nodes, edges, viewport)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `flowgraph-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function loadFlowFromFile(file: File): Promise<{ success: boolean; data?: FlowData; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      resolve(importFlow(text))
    }
    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read file' })
    }
    reader.readAsText(file)
  })
}

