# Product Requirements Document (PRD): FlowGraph Builder

## 1. Overview
### 1.1 Product Description
FlowGraph Builder is a web-based application for visually constructing and managing graph-based workflows. Users can drag-and-drop premade nodes and edges to create customizable flows, similar to a low-code workflow editor (e.g., inspired by tools like Node-RED or Retool). The app leverages React Flow (@xyflow/react) for the graph canvas, enabling intuitive node connection, property editing, and flow execution simulation.

The core value: Empower non-technical users to design complex processes (e.g., data pipelines, automation triggers) via a graph UI, with extensibility for custom nodes, triggers, and integrations.

### 1.2 Version
- **MVP Version**: 1.0
- **Release Date Target**: Q1 2026 (internal alpha in 4 weeks)

### 1.3 Target Audience
- **Primary Users**: Developers, product managers, and business analysts building prototypes or automations.
- **Secondary Users**: End-users in ops teams for simple workflow customization.
- **Assumptions**: Users have basic familiarity with drag-and-drop interfaces; no deep coding required.

## 2. Goals and Objectives
### 2.1 Business Goals
- Provide a reusable graph-building toolkit to accelerate prototyping of flow-based apps.
- Enable extensibility for future features like real-time collaboration or API integrations.
- Achieve 80% user satisfaction in usability testing (measured via NPS).

### 2.2 User Goals
- Quickly assemble flows using premade components.
- Customize node/edge behaviors without code.
- Simulate and validate flows before deployment.

### 2.3 Success Metrics
- **Quantitative**: 50+ flows built in beta testing; <5s average node addition time.
- **Qualitative**: Feedback on intuitiveness of property editing.

## 3. User Stories
As a [user], I want [feature] so that [benefit].

| User Story ID | Description | Priority |
|---------------|-------------|----------|
| US-001 | As a user, I want to drag premade nodes from a sidebar library onto the canvas so I can start building a flow quickly. | High |
| US-002 | As a user, I want to connect nodes with edges and set edge properties (e.g., data type, condition) so flows have logical routing. | High |
| US-003 | As a user, I want to click a node to edit its properties (e.g., inputs, outputs, triggers) in a sidebar panel so I can tailor behaviors. | High |
| US-004 | As a user, I want a "Run Simulation" button to test the flow step-by-step so I can debug issues visually. | Medium |
| US-005 | As a user, I want to save/load flows as JSON so I can iterate or share designs. | Medium |
| US-006 | As a user, I want to add custom nodes via a simple config upload so I can extend the library for specific use cases. | Low (Post-MVP) |

## 4. Functional Requirements
### 4.1 Core Features
- **Graph Canvas**:
  - Infinite zoom/pan using React Flow's built-in controls.
  - Node dragging, connecting, and disconnecting with snap-to-grid.
  - Undo/Redo stack for all interactions.

- **Node System**:
  - **Premade Nodes** (Initial Library: 10 nodes, extensible):
    | Node Type | Description | Properties |
    |-----------|-------------|------------|
    | Trigger | Starts flow (e.g., on timer, webhook). | Interval (ms), Payload schema. |
    | Data Input | Fetches external data (e.g., API call). | URL, Method (GET/POST), Headers. |
    | Transform | Manipulates data (e.g., filter, map). | Script (simple JS expressions), Input/Output schemas. |
    | Decision | Branches based on conditions. | Condition (if/else logic), Branches (array). |
    | Output | Sends results (e.g., email, log). | Target (email/DB), Format (JSON/CSV). |
    | Delay | Pauses execution. | Duration (s). |
    | Loop | Repeats a sub-flow. | Max iterations, Condition. |
    | Merge | Combines multiple inputs. | Merge type (union/intersect). |
    | Error Handler | Catches and logs errors. | Retry count, Notification. |
    | Custom | User-defined placeholder. | Extensible fields (key-value pairs). |
  - Each node supports:
    - Visual icons/labels.
    - Input/Output handles (multi-port for complex nodes).
    - Inline editing for quick props; full sidebar for advanced.

- **Edge System**:
  - **Premade Edges** (Types: Default, Conditional, Data Flow):
    | Edge Type | Description | Properties |
    |-----------|-------------|------------|
    | Default | Basic connection. | Label, Color (for grouping). |
    | Conditional | For decision branches. | Condition expression (e.g., `${input.value > 10}`). |
    | Data Flow | Carries payload. | Data type (string/number/object), Validation rules. |
  - Edges auto-route to avoid overlaps; support labels and tooltips.

- **Property Editing**:
  - Sidebar panel with form-based editors (e.g., React Hook Form for validation).
  - Real-time previews of prop changes on nodes/edges.
  - Validation: Required fields, type checks (e.g., number-only for delays).

- **Flow Management**:
  - Save flows to localStorage (MVP); export/import as JSON.
  - Basic simulation: Traverse graph, highlight active nodes, log outputs in a console panel.

### 4.2 Extensibility Hooks
- Node/Edge registry: Allow dynamic registration via props (e.g., `registerNodeTypes`).
- Triggers: Nodes can emit events (e.g., "onSuccess") for chaining.
- Future: Plugin system for new node types (e.g., integrate with external APIs like Stripe).

## 5. Non-Functional Requirements
### 5.1 Performance
- Render <100 nodes without lag (target 60fps on mid-range devices).
- Bundle size <2MB (Vite optimization).

### 5.2 Accessibility
- Keyboard navigation for nodes/edges (ARIA labels).
- High-contrast mode; screen reader support for props.

### 5.3 Security
- Sanitize user inputs in props (e.g., no eval() in transforms; use safe expressions).
- No persistent storage beyond local (MVP).

### 5.4 Compatibility
- Browsers: Chrome 90+, Firefox 88+, Safari 14+.
- Responsive: Mobile view (touch-friendly dragging).

## 6. UI/UX Design Guidelines
- **Layout**: 
  - Left sidebar: Node/Edge library (searchable, collapsible).
  - Center: Canvas with toolbar (zoom, sim run, save).
  - Right sidebar: Selected item properties (toggleable).
- **Theming**: Clean, modern (e.g., Tailwind CSS); blue accents for nodes, green for edges.
- **Wireframes** (High-Level):
  - Landing: Empty canvas with "Drag a Trigger Node to Start" prompt.
  - Editing: Hover states for connections; error badges on invalid props.
- **User Flow**: Onboard with a 3-step tutorial (add node → connect → run).

## 7. Technical Stack
- **Frontend**: Vite (build tool), React 18+.
- **Graph Library**: @xyflow/react (core canvas, nodes, edges).
- **State Management**: Zustand (for global flow state).
- **UI Components**: shadcn/ui or Headless UI (forms, modals).
- **Other**: TypeScript for type-safe nodes/props; Vitest for unit tests.
- **Development Setup**: `npm create vite@latest --template react-ts`, then `npm i @xyflow/react`.

## 8. Risks and Dependencies
- **Risks**: React Flow API changes (mitigate: Pin version ^12.0).
- **Dependencies**: None external (MVP self-contained).
- **Out of Scope (MVP)**: Real-time collab, cloud storage, production auth.

## 9. Next Steps
- **Week 1**: Set up Vite project, integrate React Flow basics.
- **Week 2**: Implement node/edge library and properties.
- **Week 3**: Add simulation and persistence.
- **Week 4**: Testing, tutorial, alpha release.
