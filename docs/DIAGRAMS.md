# FlowGraph Builder – Full Mermaid Diagrams Document

Copy-paste this entire document into any Markdown/Mermaid renderer (Obsidian, Notion, GitHub, VS Code + Mermaid plugin, mermaid.live) to see **14 interactive, production-grade diagrams**.

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'14px','primaryColor':'#3b82f6','primaryTextColor':'#fff','primaryBorderColor':'#2563eb','lineColor':'#64748b','secondaryColor':'#10b981','tertiaryColor':'#f59e0b'}}}%%
flowchart TD
    Start[FlowGraph Builder] --> Architecture[System Architecture]
    Start --> UserFlows[User Flows]
    
    Architecture --> Frontend[Frontend Layer]
    Architecture --> Backend[Backend Layer]
    Architecture --> Data[Data Layer]
    
    Frontend --> UI[UI Components]
    Frontend --> State[State Management]
    
    Backend --> API[API Endpoints]
    Backend --> Logic[Business Logic]
    
    Data --> Storage[Storage]
    Data --> Models[Data Models]
    
    UserFlows --> Create[Create Flow]
    UserFlows --> Edit[Edit Flow]
    UserFlows --> View[View Flow]
    
    style Start fill:#3b82f6,stroke:#2563eb,color:#fff
    style Architecture fill:#10b981,stroke:#059669,color:#fff
    style UserFlows fill:#10b981,stroke:#059669,color:#fff
    style Frontend fill:#f59e0b,stroke:#d97706,color:#fff
    style Backend fill:#f59e0b,stroke:#d97706,color:#fff
    style Data fill:#f59e0b,stroke:#d97706,color:#fff
```

## 1. High-Level Product User Journey (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Web App (Vite)
    participant RF as React Flow Canvas
    participant Z as Zustand Store
    participant LS as localStorage
    participant SIM as Simulator Engine

    U->>UI: Opens app
    UI->>LS: Load last flow (if any)
    LS-->>UI: flow.json
    UI->>Z: hydrateStore(flow)
    UI->>RF: Render nodes/edges

    U->>UI: Drags Trigger node from sidebar
    UI->>RF: onPaneReady + getViewport()
    RF->>Z: addNode(newNode)
    Z->>Z: pushToHistory()

    U->>UI: Connects nodes
    RF->>Z: addEdge(edge)
    Z->>Z: undo/redo stack update

    U->>UI: Clicks node → opens Properties
    UI->>Z: selectNode(id)
    Z-->>UI: node.data
    UI->>UI: Render dynamic form

    U->>UI: Changes property (e.g. API URL)
    UI->>Z: updateNode(id, data)
    Z->>RF: React Flow re-render

    U->>UI: Click "Run Simulation"
    UI->>SIM: simulateFlow(nodes, edges)
    SIM->>SIM: Topological sort → execution queue
    loop Every step
        SIM->>RF: highlightNode(activeId)
        SIM->>UI: appendLog(payload)
    end

    U->>UI: Export → download JSON
    Z->>UI: getFlowJSON()
    UI->>U: flow-export-2025.json
```

---

## 2. System Architecture (Component Diagram)

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'14px','primaryColor':'#3b82f6','primaryTextColor':'#fff','primaryBorderColor':'#2563eb','lineColor':'#64748b','secondaryColor':'#10b981','tertiaryColor':'#f59e0b'}}}%%
graph TB
    subgraph Browser["Browser"]
        A["App.tsx"] --> B["FlowCanvas.tsx<br/>@xyflow/react"]
        A --> C["LeftSidebar.tsx<br/>Node Library"]
        A --> D["RightSidebar.tsx<br/>PropertiesPanel"]
        A --> E["Toolbar.tsx<br/>Undo/Run/Save"]
        A --> F["LogPanel.tsx<br/>Simulation Output"]

        B --> G["Zustand Store<br/>useFlowStore"]
        C --> G
        D --> G
        E --> G

        G --> H["localStorage<br/>flowgraph-data"]
        G --> I["History Stack<br/>undo/redo"]
    end

    subgraph NodeSystem["Node System"]
        J["NodeRegistry.ts"] --> K["NodeTypes/<br/>Trigger.tsx<br/>API.tsx<br/>Transform.tsx"]
        K --> L["BaseNode.tsx"]
        L --> M["HandleFactory"]
    end

    subgraph SimEngine["Simulation Engine"]
        N["simulator.ts"] --> O["topologicalSort()"]
        N --> P["executeNode()"]
        N --> Q["conditionEvaluator()"]
    end

    B --> N
    J --> C
    
    style J fill:#10b981,stroke:#059669,color:#fff
    style N fill:#f59e0b,stroke:#d97706,color:#fff
```

---

## 3. Node Type Class Diagram (UML)

```mermaid
classDiagram
    class NodeConfig {
        +string id
        +string type
        +string label
        +Icon icon
        +Handle[] inputs
        +Handle[] outputs
        +Field[] fields
        +validate(data): boolean
    }

    class Handle {
        +string id
        +string type (source/target)
        +string position (top/bottom/left/right)
        +string label
        +string dataType
    }

    class Field {
        +string key
        +string label
        +FieldType type
        +boolean required
        +any defaultValue
        +ZodSchema schema
    }

    class BaseNodeProps {
        +Node data
        +boolean selected
        +boolean dragging
    }

    class TriggerNode
    class APINode
    class TransformNode
    class DecisionNode
    class OutputNode

    NodeConfig <|-- TriggerNode
    NodeConfig <|-- APINode
    NodeConfig <|-- TransformNode
    NodeConfig <|-- DecisionNode
    NodeConfig <|-- OutputNode

    BaseNodeProps --> NodeConfig
```

---

## 4. State Management Flow (Zustand Store)

```mermaid
stateDiagram-v2
    [*] --> Initializing
    Initializing --> Loading: loadFromLocalStorage()
    Loading --> EmptyFlow: no data
    Loading --> Hydrated: has data

    EmptyFlow --> TemplateSelected: user picks template
    EmptyFlow --> NodeDropped: first node added

    Hydrated --> Editing
    TemplateSelected --> Editing
    NodeDropped --> Editing

    state Editing {
        [*] --> Idle
        Idle --> NodeSelected: click node
        Idle --> EdgeConnecting: drag handle
        Idle --> DraggingNode: drag from sidebar

        NodeSelected --> PropertyChanged: form submit
        PropertyChanged --> Validated
        PropertyChanged --> Invalid: zod error

        EdgeConnecting --> EdgeCreated
        EdgeCreated --> Validated
    }

    Validated --> SimulationReady
    Invalid --> Editing

    SimulationReady --> Running: click "Run"
    Running --> StepExecuting
    StepExecuting --> StepComplete
    StepComplete --> Running: next node
    StepComplete --> Finished: queue empty
    Finished --> SimulationReady

    state History {
        [*] --> Clean
        Clean --> Dirty: any change
        Dirty --> Clean: undo/redo
    }
```

---

## 5. Drag & Drop User Flow (Flowchart)

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'14px','primaryColor':'#3b82f6','primaryTextColor':'#fff','primaryBorderColor':'#2563eb','lineColor':'#64748b','secondaryColor':'#10b981','tertiaryColor':'#f59e0b'}}}%%
flowchart TD
    A["User opens app"] --> B{"Is there saved flow?"}
    B -->|No| C["Show Empty State + Template Gallery"]
    B -->|Yes| D["Load flow → render canvas"]

    C --> E["User clicks Start from scratch"]
    E --> F["Left Sidebar: Node Library"]
    F --> G["User drags HTTP Trigger node"]
    G --> H["Canvas: Ghost preview follows cursor"]
    H --> I["Drop → getViewport() → calculate position"]
    I --> J["addNode() → Zustand → React Flow"]
    J --> K["Node appears with halo"]

    K --> L["User drags Send Email node"]
    L --> M["Connect: drag from Trigger.out → Email.in"]
    M --> N["Edge created with auto-route"]
    N --> O["Click Email node → Right Sidebar opens"]
    O --> P["Edit fields: To, Subject, Body"]
    P --> Q["Live preview: node label updates"]
    Q --> R["Click Run Simulation"]
    R --> S["Simulator traverses graph"]
    S --> T["Log panel: Trigger fired → Email sent"]
    T --> U["Export → download JSON"]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style B fill:#f59e0b,stroke:#d97706,color:#fff
    style R fill:#10b981,stroke:#059669,color:#fff
    style U fill:#10b981,stroke:#059669,color:#fff
```

---

## 6. Simulation Execution Engine (Detailed Flowchart)

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'14px','primaryColor':'#3b82f6','primaryTextColor':'#fff','primaryBorderColor':'#2563eb','lineColor':'#64748b','secondaryColor':'#10b981','tertiaryColor':'#f59e0b'}}}%%
flowchart TD
    Start["Run Simulation"] --> A["buildGraph: nodes + edges"]
    A --> B["topologicalSort - Kahns Algorithm"]
    B --> C{"Valid DAG?"}
    C -->|No| D["Error: Cycle detected!"]
    C -->|Yes| E["initializeQueue rootNodes"]
    E --> F["resetNodeStates"]
    F --> G["Start timer"]

    G --> H{"queue.length > 0"}
    H -->|Yes| I["dequeue nextNode"]
    I --> J["highlightNode active"]
    J --> K["executeNode node.type"]
    K --> L{"node.type"}
    L -->|Trigger| M["fire webhook / timer"]
    L -->|API| N["fetch URL"]
    L -->|Transform| O["eval JS sandbox"]
    L -->|Decision| P["evaluate conditions"]
    P --> Q["route to correct output handle"]

    Q --> R["enqueue downstream nodes"]
    R --> S["log payload"]
    S --> H

    H -->|No| T["Simulation Complete"]
    T --> U["show success/confetti"]
    U --> V["auto-save snapshot"]
    
    style Start fill:#3b82f6,stroke:#2563eb,color:#fff
    style C fill:#f59e0b,stroke:#d97706,color:#fff
    style D fill:#ef4444,stroke:#dc2626,color:#fff
    style L fill:#f59e0b,stroke:#d97706,color:#fff
    style T fill:#10b981,stroke:#059669,color:#fff
    style U fill:#10b981,stroke:#059669,color:#fff
```

---

## 7. File Structure (Tree Diagram)

```bash
    src/
    ├── App.tsx
    ├── main.tsx
    ├── components/
    │   ├── canvas/
    │   │   ├── FlowCanvas.tsx
    │   │   └── MiniMapCustom.tsx
    │   ├── sidebar/
    │   │   ├── LeftSidebar.tsx
    │   │   ├── RightSidebar.tsx
    │   │   └── PropertiesPanel.tsx
    │   ├── nodes/
    │   │   ├── BaseNode.tsx
    │   │   ├── custom/
    │   │   │   ├── TriggerNode.tsx
    │   │   │   ├── APINode.tsx
    │   │   │   └── TransformNode.tsx
    │   │   └── NodeIcon.tsx
    │   ├── ui/
    │   │   ├── Toolbar.tsx
    │   │   ├── LogPanel.tsx
    │   │   └── TourOverlay.tsx
    ├── store/
    │   ├── useFlowStore.ts
    │   └── historyMiddleware.ts
    ├── lib/
    │   ├── nodeRegistry.ts
    │   ├── edgeRegistry.ts
    │   ├── simulator.ts
    │   └── validators.ts
    ├── types/
    │   ├── flow.types.ts
    │   └── node.types.ts
    ├── templates/
    │   ├── api-to-slack.json
    │   └── cron-email.json
    ├── assets/
    │   └── icons/
    └── utils/
        ├── topologicalSort.ts
        └── safeEval.ts
```
```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'13px','primaryColor':'#3b82f6','primaryTextColor':'#fff','primaryBorderColor':'#2563eb','lineColor':'#64748b','secondaryColor':'#10b981','tertiaryColor':'#f59e0b'}}}%%
graph TD
    Root["src/"] --> App["App.tsx"]
    Root --> Main["main.tsx"]
    Root --> Components["components/"]
    Root --> Store["store/"]
    Root --> Lib["lib/"]
    Root --> Types["types/"]
    Root --> Templates["templates/"]
    Root --> Assets["assets/"]
    Root --> Utils["utils/"]

    Components --> Canvas["canvas/"]
    Components --> Sidebar["sidebar/"]
    Components --> Nodes["nodes/"]
    Components --> UI["ui/"]

    Canvas --> FlowCanvas["FlowCanvas.tsx"]
    Canvas --> MiniMap["MiniMapCustom.tsx"]

    Sidebar --> LeftSidebar["LeftSidebar.tsx"]
    Sidebar --> RightSidebar["RightSidebar.tsx"]
    Sidebar --> PropertiesPanel["PropertiesPanel.tsx"]

    Nodes --> BaseNode["BaseNode.tsx"]
    Nodes --> Custom["custom/"]
    Nodes --> NodeIcon["NodeIcon.tsx"]

    Custom --> TriggerNode["TriggerNode.tsx"]
    Custom --> APINode["APINode.tsx"]
    Custom --> TransformNode["TransformNode.tsx"]

    UI --> Toolbar["Toolbar.tsx"]
    UI --> LogPanel["LogPanel.tsx"]
    UI --> TourOverlay["TourOverlay.tsx"]

    Store --> FlowStore["useFlowStore.ts"]
    Store --> History["historyMiddleware.ts"]

    Lib --> NodeRegistry["nodeRegistry.ts"]
    Lib --> EdgeRegistry["edgeRegistry.ts"]
    Lib --> Simulator["simulator.ts"]
    Lib --> Validators["validators.ts"]

    Types --> FlowTypes["flow.types.ts"]
    Types --> NodeTypes["node.types.ts"]

    Templates --> ApiSlack["api-to-slack.json"]
    Templates --> CronEmail["cron-email.json"]

    Assets --> Icons["icons/"]

    Utils --> TopoSort["topologicalSort.ts"]
    Utils --> SafeEval["safeEval.ts"]

    style Root fill:#3b82f6,stroke:#2563eb,color:#fff
    style Components fill:#10b981,stroke:#059669,color:#fff
    style Store fill:#10b981,stroke:#059669,color:#fff
    style Lib fill:#10b981,stroke:#059669,color:#fff
    style Types fill:#10b981,stroke:#059669,color:#fff
    style Canvas fill:#f59e0b,stroke:#d97706,color:#fff
    style Sidebar fill:#f59e0b,stroke:#d97706,color:#fff
    style Nodes fill:#f59e0b,stroke:#d97706,color:#fff
    style UI fill:#f59e0b,stroke:#d97706,color:#fff
```

---

## 8. Data Flow (C4 Context → Container → Component)

```mermaid
flowchart LR
    subgraph C4-Level-1 [Context]
        User --> WebApp
        WebApp --> LocalStorage
    end

    subgraph C4-Level-2 [Container]
        Browser --> ViteDevServer
        Browser --> ReactFlow
        Browser --> Zustand
        Browser --> MonacoEditor
    end

    subgraph C4-Level-3 [Component]
        ReactFlow --> NodesComponent
        ReactFlow --> EdgesComponent
        NodesComponent --> BaseNode
        BaseNode --> HandleFactory
        PropertiesPanel --> FieldRenderer
        FieldRenderer --> ZodValidator
        Simulator --> ExecutionQueue
    end
```

---

## 9. Onboarding Tour Steps (Sequence)

```mermaid
journey
    title FlowGraph Builder Onboarding Tour
    section First 30 seconds
      Open app: 5: New User
      See empty canvas + templates: 4: New User
      Pick "Webhook → Slack" template: 5: New User
    section Build your first flow
      Drag a new node from left: 5: Curious User
      Connect two nodes: 5: Confident
      Open properties panel: 4: Detail-oriented
    section Run and debug
      Click "Run Simulation": 5: Excited
      Watch nodes light up: 5: Amazed
      See logs in bottom panel: 4: Analyst
    section Save & share
      Export as JSON: 5: Product Manager
      Import into new tab: 5: Collaborator
```

---

## 10. MVP vs Post-MVP Roadmap (Gantt)

```mermaid
gantt
    title FlowGraph Builder Roadmap
    dateFormat  YYYY-MM-DD
    axisFormat %m/%d

    section MVP (4 weeks)
    Project Setup            :done, 2025-11-10, 3d
    React Flow Integration   :done, 2025-11-13, 4d
    Node Registry + Library  :active, 2025-11-17, 7d
    Properties Panel         : 2025-11-24, 5d
    Simulation Engine        : 2025-12-01, 7d
    Save/Load + Templates    : 2025-12-08, 5d
    Polish + Tour            : 2025-12-13, 4d

    section Post-MVP
    Real-time Collab (WebSocket) : 2026-01-01, 14d
    Cloud Sync + Auth        : 2026-01-15, 21d
    Plugin Marketplace       : 2026-02-05, 30d
    Mobile App (React Native): 2026-03-01, 60d
```

---
