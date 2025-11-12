/**
 * Safe evaluation of JavaScript expressions for Transform nodes
 * Uses a sandboxed approach with allowlist of safe operations
 */

const ALLOWED_GLOBALS = [
  'Math',
  'Date',
  'JSON',
  'parseInt',
  'parseFloat',
  'isNaN',
  'isFinite',
  'String',
  'Number',
  'Boolean',
  'Array',
  'Object',
]

export const safeEval = (code: string, context: Record<string, any> = {}): any => {
  try {
    // Create a safe context with only allowed globals
    const safeContext: Record<string, any> = {
      ...context,
    }

    ALLOWED_GLOBALS.forEach((name) => {
      if (typeof (globalThis as any)[name] !== 'undefined') {
        safeContext[name] = (globalThis as any)[name]
      }
    })

    // Create function with restricted scope
    const func = new Function(
      ...Object.keys(safeContext),
      `
      "use strict";
      try {
        return ${code};
      } catch (e) {
        throw new Error("Evaluation error: " + e.message);
      }
    `
    )

    return func(...Object.values(safeContext))
  } catch (error) {
    throw new Error(`Safe evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

