Here is a **production-ready, granular task breakdown** structured as **Epics → Stories → PRs → Commits**, specifically designed for engineering teams (or AI agents using Cursor, GitHub, or LLM-driven dev tools) to execute with zero ambiguity.

This follows the PRD exactly and is optimized for **parallel work**, **clear merge order**, and **fast iteration**.

---

### Epic 1: Project Setup & Core Infrastructure
**Goal**: Bootstrap a production-grade Vite + React + TypeScript + React Flow app

| Story | PR Title | Commits (in order) |
|------|----------|---------------------|
| ES-01: Initialize Vite React TS project | `chore: initialize vite react typescript project with strict config` | 1. `npm create vite@latest flowgraph-builder -- --template react-ts`<br>2. `init: add typescript strict mode & paths`<br>3. `chore: add eslint, prettier, husky, lint-staged`<br>4. `chore: add vitest + react-testing-library` |
| ES-02: Setup UI foundation | `feat: setup tailwind + shadcn/ui + dark mode` | 1. `feat: install tailwindcss + postcss + autoprefixer`<br>2. `feat: initialize shadcn/ui with custom theme`<br>3. `feat: add global CSS reset & dark mode toggle`<br>4. `feat: create layout components (SidebarLeft, Canvas, SidebarRight)` |
| ES-03: Install & configure React Flow | `feat: integrate @xyflow/react with custom theme` | 1. `feat: install @xyflow/react@latest`<br>2. `feat: create <FlowCanvas /> wrapper with controls, background, minimap`<br>3. `style: custom node styles using tailwind + xyflow theming`<br>4. `feat: add grid snap + zoom limits` |

---

### Epic 2: State Management & Flow Persistence
**Goal**: Centralized, serializable flow state with undo/redo

| Story | PR Title | Commits |
|------|----------|--------|
| ES-04: Global store with Zustand | `feat: setup zustand store with persist + devtools` | 1. `feat: install zustand + middleware`<br>2. `feat: create useFlowStore with nodes, edges, viewport`<br>3. `feat: add persist to localStorage (flowgraph-data)`<br>4. `feat: add zustand devtools middleware` |
| ES-05: Undo/Redo system | `feat: implement undo/redo with history stack` | 1. `feat: add history middleware to store`<br>2. `feat: create UndoRedoToolbar component`<br>3. `test: add tests for undo/redo edge cases` |

---

### Epic 3: Node & Edge Registry System
**Goal**: Dynamic, extensible node/edge type system

| Story | PR Title | Commits |
|------|----------|--------|
| ES-06: Node type registry | `feat: create node type registry with icons & handles` | 1. `types: define NodeType, NodeConfig, HandleConfig`<br>2. `feat: create registerNodeType() factory`<br>3. `feat: create NodeLibrarySidebar with search`<br>4. `feat: premade nodes: Trigger, API, Transform, Decision, Output` |
| ES-07: Custom node rendering | `feat: custom node components with handles & property badges` | 1. `feat: BaseNode component with title, icon, status dot`<br>2. `feat: dynamic handles (top/bottom/left/right, multiple)`<br>3. `feat: node selection halo + error/warning badges` |
| ES-08: Edge type registry | `feat: edge types with labels, conditions, animations` | 1. `feat: registerEdgeType: default, conditional, data`<br>2. `feat: animated dashed edges for conditional`<br>3. `feat: edge label with editable condition chip` |

---

### Epic 4: Property Panel & Form System
**Goal**: Real-time node/edge property editing

| Story | PR Title | Commits |
|------|----------|--------|
| ES-09: Property sidebar foundation | `feat: property sidebar with tabs (Basic, Advanced, Code)` | 1. `feat: <PropertiesPanel /> with collapsible sections`<br>2. `feat: context-based rendering (node vs edge vs none)`<br>3. `feat: "No selection" placeholder with tips` |
| ES-10: Dynamic forms per node type | `feat: form generator from node.config.fields` | 1. `feat: FieldRenderer component (text, number, select, json, code)`<br>2. `feat: use React Hook Form + Zod for validation`<br>3. `feat: live preview updates on canvas`<br>4. `fix: debounce rapid prop changes` |
| ES-11: Code editor for Transform node | `feat: monaco editor integration for JS expressions` | 1. `feat: install @monaco-editor/react`<br>2. `feat: safe sandboxed eval (math.js + allowlist)`<br>3. `feat: error boundary + linting` |

---

### Epic 5: Drag & Drop Node Library
**Goal**: Intuitive node palette

| Story | PR Title | Commits |
|------|----------|--------|
| ES-12: Draggable node library | `feat: drag-from-sidebar to canvas with preview` | 1. `feat: useReactFlow.getViewport() for drop position`<br>2. `feat: ghost preview during drag`<br>3. `feat: category accordion (Triggers, Logic, Actions)`<br>4. `feat: search + recent used section` |

---

### Epic 6: Flow Simulation & Debugging
**Goal**: Visual execution engine

| Story | PR Title | Commits |
|------|----------|--------|
| ES-13: Simulation engine | `feat: flow simulator with step-by-step execution` | 1. `feat: create simulateFlow() topological sort + execution queue`<br>2. `feat: highlight active node + pulse animation`<br>3. `feat: log panel with timestamp, node, payload`<br>4. `feat: pause / step / reset controls` |
| ES-14: Runtime error visualization | `feat: error badges + console errors` | 1. `feat: error boundary per node`<br>2. `feat: red pulse + tooltip on failure`<br>3. `feat: auto-scroll log to error` |

---

### Epic 7: Import / Export & Templates
**Goal**: Shareable flows

| Story | PR Title | Commits |
|------|----------|--------|
| ES-15: JSON import/export | `feat: save/load flow as JSON with version` | 1. `feat: export button → download flow.v1.json`<br>2. `feat: import drag & drop or file picker`<br>3. `feat: schema validation on import` |
| ES-16: Template gallery | `feat: built-in templates (API → Transform → Email)` | 1. `feat: /templates folder with JSON files`<br>2. `feat: template carousel on empty state`<br>3. `feat: "Use this template" button` |

---

### Epic 8: Polish, Onboarding & Accessibility
**Goal**: Production-ready UX

| Story | PR Title | Commits |
|------|----------|--------|
| ES-17: Onboarding tour | `feat: guided tour with shepherd.js` | 1. `feat: install shepherd.js`<br>2. `feat: 5-step tour: drag node → connect → edit → run → save`<br>3. `feat: skip / replay button` |
| ES-18: Keyboard shortcuts | `feat: keyboard shortcuts (delete, copy, undo, etc)` | 1. `feat: useHotkeys hook`<br>2. `feat: shortcut cheat sheet modal (Cmd+K)` |
| ES-19: Accessibility & mobile | `feat: a11y + touch support` | 1. `feat: ARIA labels on nodes/handles`<br>2. `feat: touch drag support (react-flow touch events)`<br>3. `feat: responsive layout (stack sidebars on mobile)` |

---

### Epic 9: Testing & CI/CD
**Goal**: Reliable builds

| Story | PR Title | Commits |
|------|----------|--------|
| ES-20: Test coverage | `test: achieve 85% coverage on core logic` | 1. `test: unit tests for store, simulator, registry`<br>2. `test: e2e with Playwright (create flow → run → export)` |
| ES-21: GitHub Actions | `ci: setup vitest + playwright + lint` | 1. `ci: add workflow with cache`<br>2. `ci: deploy to Vercel/Netlify on main` |

---

### Execution Order (Recommended Merge Sequence)

```
Epic 1 → Epic 2 → Epic 3 → Epic 4 → Epic 5 → Epic 6 → Epic 7 → Epic 8 → Epic 9
```

**Parallelizable**:  
- Epic 1 + Epic 2 can be worked on by 2 engineers simultaneously  
- Node registry (E3) and Property panel (E4) can be paired  
- Simulation (E6) depends on E3 + E4

---

### Labels for GitHub Issues/PRs
```
enhancement, bug, chore, feat, fix, test, ci, docs, ui, backend, mvp, post-mvp
priority: p0 (blocker), p1 (critical), p2 (important), p3 (nice)
size: xs (1day), s (2-3d), m (1wk), l (2wk)
```

---

### Final Deliverable
Copy this entire structure into your project management tool (Linear, Jira, Notion, GitHub Projects) and assign away.

AI agents (Cursor, Continue.dev, etc.) can now execute **per commit** with full context.
- Zod schemas for all node types

Let’s ship this thing.
