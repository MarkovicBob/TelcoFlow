# 📞 TelcoFlow - Professional Low-Code Call Flow Builder

> **A production-grade telecom flow builder inspired by ECT Telecoms' T-LCAP platform**  
> Built to demonstrate advanced low-code development capabilities for telecom operators.

## 🎯 Project Vision

TelcoFlow is a visual programming platform for designing, testing, and deploying telecommunications call flows. It empowers telecom engineers and business users to create complex IVR systems, call routing logic, and customer interaction workflows without deep programming knowledge.

### Key Differentiators

- **Telecom-Specific**: Built specifically for telecom use cases (IVR, call routing, queue management)
- **Production-Ready**: Enterprise-grade validation, error handling, and testing capabilities
- **Visual First**: Intuitive drag-and-drop interface with real-time flow simulation
- **Developer Friendly**: Export flows as JSON, integrate with existing telecom infrastructure

---

## 🎨 UI/UX Mockup & Wireframe

### Main Application Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ⚡ TelcoFlow                    [Project: Customer Support IVR]   [👤 Bob]│
├───────────┬─────────────────────────────────────────────────┬───────────┤
│           │  📋 CANVAS TOOLBAR                              │           │
│           │  [◀ Undo] [▶ Redo] [🔍-] [🔍+] [⊞ Fit] [▶ Test] │  MINIMAP  │
│  NODE     ├─────────────────────────────────────────────────┤  ┌─────┐  │
│  LIBRARY  │                                                 │  │ ▪▪▪ │  │
│           │        ┌──────┐                                 │  │▪█▪▪ │  │
│ [Start]   │        │START │                                 │  │▪▪▪▪ │  │
│ [IVR Menu]│        └──┬───┘                                 │  └─────┘  │
│ [Get Input│           │                                     │           │
│ [Play Msg]│           ▼                                     │  LAYERS   │
│ [Decision]│     ┌─────────────┐                            │  ☑ Nodes  │
│ [Transfer]│     │  IVR MENU   │                            │  ☑ Edges  │
│ [Queue]   │     │ "Press 1..." │                            │  ☑ Labels │
│ [Record]  │     └─┬─────────┬─┘                            │           │
│ [API Call]│       │1        │2                              │  VALIDATE │
│ [Wait]    │       ▼         ▼                               │  ✓ No Err │
│ [End]     │  ┌────────┐  ┌────────┐                        │           │
│           │  │Transfer│  │ Queue  │                         │  EXPORT   │
│  ───────  │  │ Sales  │  │Support │                         │  [JSON]   │
│           │  └────────┘  └───┬────┘                         │  [PNG]    │
│ TEMPLATES │                  ▼                              │  [Deploy] │
│ • Basic   │            ┌──────────┐                         │           │
│ • IVR     │            │   END    │                         │           │
│ • Support │            └──────────┘                         │           │
├───────────┴─────────────────────────────────────────────────┴───────────┤
│ 💾 Auto-saved 2 min ago                      📊 Nodes: 5 │ Edges: 4    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Node Details Panel (Right Sidebar - Appears on Node Click)

```
┌─────────────────────────┐
│ IVR MENU NODE          │
│ ─────────────────────── │
│                         │
│ 📝 Basic Settings       │
│  Name: "Main Menu"      │
│  ID: ivr-001            │
│                         │
│ 🎵 Audio Configuration  │
│  ○ Text-to-Speech       │
│  ● Upload Audio         │
│  [Choose File...]       │
│  Preview: main_menu.wav │
│                         │
│ ⌨️ DTMF Options         │
│  [1] → Sales Dept       │
│  [2] → Support Queue    │
│  [3] → Billing Info     │
│  [0] → Operator         │
│  [#] → Repeat Menu      │
│  [+ Add Option]         │
│                         │
│ ⚙️ Advanced             │
│  Timeout: [5] seconds   │
│  Max Retries: [3]       │
│  Invalid Input: [msg]   │
│  No Input: [repeat]     │
│                         │
│ ┌─────────┐ ┌─────────┐│
│ │ Cancel  │ │  Save   ││
│ └─────────┘ └─────────┘│
└─────────────────────────┘
```

### Flow Simulator/Test Mode

```
┌──────────────────────────────────────────────────────────┐
│ 🎬 FLOW SIMULATOR                              [✕ Close] │
├──────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌───────────────────────────┐   │
│  │  CALL CONTROLS  │    │  EXECUTION LOG            │   │
│  │                 │    │  ──────────────────────── │   │
│  │ [▶ Start]       │    │  ✓ Call Started           │   │
│  │ [⏸ Pause]       │    │  ✓ Entered: START node    │   │
│  │ [⏹ Stop]        │    │  ► Playing: IVR Menu      │   │
│  │ [⏭ Step]        │    │    "Press 1 for Sales..." │   │
│  │                 │    │  ⏳ Waiting for input     │   │
│  │ Speed: [1x ▼]   │    │                           │   │
│  └─────────────────┘    │  [Clear Log]              │   │
│                         └───────────────────────────┘   │
│  ┌────────────────────────────────────────────────┐     │
│  │  DTMF SIMULATOR                                │     │
│  │  [1] [2] [3]                                   │     │
│  │  [4] [5] [6]        Caller Input: "1"          │     │
│  │  [7] [8] [9]        Timestamp: 00:03           │     │
│  │  [*] [0] [#]                                   │     │
│  └────────────────────────────────────────────────┘     │
│                                                          │
│  📊 VARIABLES:  caller_id: +1234567890                  │
│                 selected_option: 1                       │
│                 queue_position: -                        │
└──────────────────────────────────────────────────────────┘
```

---

## 🏗️ Detailed Feature Specifications

### Phase 1: Core Flow Builder (Week 1-2)

#### 1.1 Node Types Library

| Node Type        | Icon | Purpose              | Key Properties                     |
| ---------------- | ---- | -------------------- | ---------------------------------- |
| **Start**        | 🟢   | Entry point          | Trigger type (inbound/scheduled)   |
| **IVR Menu**     | 📱   | DTMF/Voice input     | Audio, options, timeout, retries   |
| **Play Message** | 🔊   | Play audio/TTS       | Message text, audio file, language |
| **Get Input**    | ⌨️   | Collect DTMF/speech  | Input length, timeout, validation  |
| **Decision**     | 🔀   | Conditional routing  | Conditions, variables, operators   |
| **Transfer**     | ☎️   | Call transfer        | Destination, type (warm/cold)      |
| **Queue**        | 👥   | Hold queue           | Queue name, priority, max wait     |
| **API Call**     | 🌐   | External integration | URL, method, headers, mapping      |
| **Record**       | 🎙️   | Call recording       | Duration, format, storage          |
| **Wait**         | ⏱️   | Delay execution      | Duration, units                    |
| **Set Variable** | 📝   | Store data           | Variable name, value, type         |
| **End**          | 🔴   | Terminate call       | Reason, disposition code           |

#### 1.2 Canvas Features

- ✅ Drag & drop nodes from library
- ✅ Connect nodes with edges (arrows)
- ✅ Multi-select (Ctrl+Click)
- ✅ Copy/Paste (Ctrl+C/V)
- ✅ Delete (Del key)
- ✅ Undo/Redo (Ctrl+Z/Y)
- ✅ Zoom controls (+/- 10%-200%)
- ✅ Pan (drag background)
- ✅ Mini-map navigation
- ✅ Grid snap
- ✅ Auto-layout algorithm

#### 1.3 Node Properties Panel

- Dynamic form based on node type
- Real-time validation
- Error highlighting
- Help tooltips
- Audio file uploader
- Variable picker/autocomplete
- Expression builder

### Phase 2: Business Logic & Testing (Week 2-3)

#### 2.1 Variables & Expressions

```javascript
// Built-in variables
${caller.phone}      // Caller's phone number
${caller.name}       // Caller's name (from CRM)
${call.duration}     // Call duration in seconds
${call.timestamp}    // Call start time
${system.date}       // Current date
${system.time}       // Current time
${node.input}        // Last node input

// Custom variables
${customer_id}
${account_balance}
${queue_position}

// Expressions
${call.duration > 300}
${system.time >= '09:00' && system.time <= '17:00'}
${customer.tier == 'premium'}
```

#### 2.2 Flow Validation

- ✓ No orphaned nodes
- ✓ All paths lead to END node
- ✓ No circular references
- ✓ Required fields filled
- ✓ Valid expressions
- ✓ Audio files exist
- ✓ API endpoints reachable

#### 2.3 Flow Simulator

- Step-by-step execution
- Variable inspector
- Breakpoints
- Call controls (play/pause/stop)
- DTMF simulator
- Mock API responses
- Execution timeline
- Export test logs

### Phase 3: Professional Features (Week 3-4)

#### 3.1 Project Management

- Multiple flow projects
- Project metadata (name, description, tags)
- Version history
- Flow templates library
- Search flows
- Duplicate flow
- Archive/Delete

#### 3.2 Import/Export

```json
{
  "version": "1.0",
  "metadata": {
    "name": "Customer Support IVR",
    "created": "2025-01-15",
    "author": "Bob",
    "description": "Main customer support flow"
  },
  "nodes": [...],
  "edges": [...],
  "variables": [...]
}
```

#### 3.3 Deployment & Integration

- Export as JSON
- Generate documentation (Markdown/PDF)
- Export flow diagram (PNG/SVG)
- REST API for flow execution
- Webhook integration
- Docker deployment
- CI/CD ready

---

## 🛠️ Technical Architecture

### Tech Stack

```
Frontend:
├── React 19 + TypeScript
├── ReactFlow (visual flow editor)
├── Tailwind CSS (styling)
├── Zustand (state management)
├── React Hook Form + Zod (forms & validation)
├── Lucide Icons (iconography)
└── Vite (build tool)

Backend (Optional):
├── Node.js + Express
├── SQLite (local) / PostgreSQL (production)
├── WebSocket (real-time simulation)
└── REST API

DevOps:
├── Docker + Docker Compose
├── GitHub Actions (CI/CD)
└── Vercel/Netlify (deployment)
```

### Folder Structure

```
src/
├── components/
│   ├── FlowCanvas.tsx         # Main canvas
│   ├── NodeLibrary.tsx        # Sidebar with nodes
│   ├── NodeDetailsPanel.tsx   # Right panel for editing
│   ├── FlowSimulator.tsx      # Test mode
│   ├── MiniMap.tsx            # Navigation
│   ├── Toolbar.tsx            # Action buttons
│   └── nodes/                 # Custom node components
│       ├── StartNode.tsx
│       ├── IVRMenuNode.tsx
│       ├── TransferNode.tsx
│       └── ...
├── store/
│   ├── flowStore.ts           # Zustand store
│   └── simulatorStore.ts
├── types/
│   ├── flow.ts                # Flow types
│   └── nodes.ts               # Node types
├── utils/
│   ├── validation.ts          # Flow validation
│   ├── simulator.ts           # Flow execution engine
│   └── export.ts              # Import/export logic
└── hooks/
    ├── useFlowValidation.ts
    └── useFlowSimulation.ts
```

---

## 📅 Development Roadmap

### Week 1: Foundation

- ✅ Setup project structure
- ✅ Basic ReactFlow integration
- ✅ Custom node components (5-6 types)
- ✅ Node library sidebar
- ✅ Basic canvas controls

### Week 2: Advanced Features

- ⬜ Node properties panel (dynamic forms)
- ⬜ Flow validation system
- ⬜ Variable system
- ⬜ Expression builder
- ⬜ Import/Export JSON

### Week 3: Testing & Simulation

- ⬜ Flow simulator UI
- ⬜ Execution engine
- ⬜ DTMF simulator
- ⬜ Variable inspector
- ⬜ Test logs & timeline

### Week 4: Polish & Deploy

- ⬜ Templates library
- ⬜ Documentation generator
- ⬜ Export to PNG/PDF
- ⬜ Docker setup
- ⬜ Deploy to production
- ⬜ Demo video & documentation

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📸 Screenshots (Coming Soon)

- Main Canvas View
- Node Configuration
- Flow Simulator
- Templates Library
- Export Options

---

## 🎯 Interview Talking Points

When presenting this project:

1. **Problem Statement**: "Telecom operators need rapid service development without vendor lock-in"
2. **Solution**: "Visual low-code platform reducing time-to-market from months to days"
3. **Technical Depth**:
   - Type-safe TypeScript architecture
   - Custom validation engine
   - Real-time flow simulation
   - Production-ready export formats
4. **Business Value**:
   - Faster feature deployment
   - Lower OPEX (non-technical users can create flows)
   - Reduced errors (visual validation)
   - Better customer experience

---

## 📝 License

MIT License - Built as a learning project inspired by ECT Telecoms' T-LCAP platform.

---

**Built with ❤️ by Bob | December 2025**
