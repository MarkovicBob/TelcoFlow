# 📞 TelcoFlow - Low-Code Call Flow Builder

> **Modern, intuitive visual programming platform for telecommunications call flows**  
> Design complex IVR systems, call routing, and customer interactions without coding.

## 🎯 Features

### ✨ Core Functionality

- **Visual Flow Designer**: Drag-and-drop interface to build call flows
- **Node Library**: Pre-built telecom nodes (Start, End, IVR Menu, Transfer, Queue, Decision, API Call, etc.)
- **Real-time Flow Simulation**: Test your flows with interactive simulator
- **Flow Validation**: Automatic validation with detailed error/warning messages
- **Export Options**: Download flows as JSON, PNG, or PDF documentation

### 💾 Data Persistence

- **Auto-Save on Changes**: Flow automatically saves 1 second after you stop making changes
- **Periodic Backup**: Additional auto-save every 2 minutes as failsafe
- **Empty Canvas**: Starts fresh on first launch, no default nodes
- **LocalStorage**: All data persists in browser across sessions

### 🎨 User Experience

- **Custom Dialogs**: Beautiful, styled confirmation and info dialogs (no browser alerts)
- **Profile Management**: Upload and display custom profile images
- **Dark Theme**: Professional dark slate UI with blue accent colors
- **Responsive Design**: Works on desktop and mobile devices

### 📱 UI/UX Polish

- **Toolbar Controls**: Undo/Redo, Zoom, Fit View, Test Flow, Templates, Simulator, Clear Canvas
- **Validation Panel**: Real-time error and warning display
- **Node Details Panel**: Configure individual nodes with properties
- **Mini Map**: Navigate large flows easily
- **Keyboard Shortcuts**: Ctrl+Z (Undo), Ctrl+Y (Redo), Ctrl+C (Copy), Ctrl+V (Paste), Delete

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (LTS)
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd telcoflow

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

### Docker

```bash
# Build image
docker build -t telcoflow .

# Run container
docker run -p 8080:80 telcoflow

# Using docker-compose
docker compose up --build
```

---

## 🎨 User Interface

### Main Components

- **Header**: Project title, export buttons, profile menu
- **Sidebar**: Node library for drag-and-drop
- **Canvas**: Main visual editor with toolbar
- **Right Panel**: Node properties and settings
- **Validation Panel**: Error/warning messages
- **Simulator**: Test flows with interactive controls

### Keyboard Shortcuts

| Shortcut           | Action                  |
| ------------------ | ----------------------- |
| `Ctrl+Z` / `Cmd+Z` | Undo                    |
| `Ctrl+Y` / `Cmd+Y` | Redo                    |
| `Ctrl+C` / `Cmd+C` | Copy node               |
| `Ctrl+V` / `Cmd+V` | Paste node              |
| `Delete`           | Delete selected node(s) |
| `Ctrl+S` / `Cmd+S` | Save flow               |

---

## 💾 Data Management

### Auto-Save System

The application implements a dual-layer auto-save mechanism:

1. **Real-time Save (1 second debounce)**

   - Activates after you stop making changes
   - Stores complete flow state in localStorage
   - Console logs: "Auto-saved flow (on change)"

2. **Periodic Backup (2 minute interval)**
   - Runs automatically every 2 minutes
   - Creates backup if nodes exist in flow
   - Survives page refresh, browser restart

### Persistence Details

```typescript
// localStorage keys used:
-telcoflow_saved - // Complete flow data (nodes, edges, metadata)
  telcoflow_initialized_v2 - // First-time initialization flag
  telcoflow_user; // User profile (name, image, settings)
```

### Export Options

| Format   | Use Case                                           |
| -------- | -------------------------------------------------- |
| **JSON** | Full flow data for backup/integration with backend |
| **PNG**  | Visual diagram for documentation                   |
| **PDF**  | Professional documentation package                 |

### Profile & Settings

- **Profile Image**: Upload custom avatar (stored as base64 in localStorage)
- **Settings Panel**: Access via avatar dropdown menu
- **Theme**: Dark slate UI with blue accents (fixed theme)

---

## 📊 Flow Simulation

### Testing Your Flows

1. **Click "Test Flow"** button in toolbar
2. **Validation Panel** shows any errors/warnings
3. **Validation Issues** detected:
   - Missing End node
   - Orphaned nodes (disconnected)
   - Unreachable nodes
   - Missing required properties

### Node Types Available

| Type             | Icon | Purpose                | Key Settings          |
| ---------------- | ---- | ---------------------- | --------------------- |
| **Start**        | 🟢   | Entry point for flow   | Trigger type          |
| **End**          | 🔴   | Terminate call         | Exit reason           |
| **IVR Menu**     | 📱   | DTMF menu with options | Options, timeout      |
| **Play Message** | 🔊   | Play audio/TTS         | Message text, audio   |
| **Get Input**    | ⌨️   | Collect DTMF input     | Input length, timeout |
| **Decision**     | 🔀   | Conditional routing    | Conditions            |
| **Transfer**     | ☎️   | Transfer call          | Destination           |
| **Queue**        | 👥   | Place in queue         | Queue name, priority  |
| **API Call**     | 🌐   | External API call      | URL, method, headers  |
| **Record**       | 🎙️   | Record audio           | Duration, format      |
| **Wait**         | ⏱️   | Time delay             | Duration              |
| **Set Variable** | 📝   | Store data             | Variable name, value  |

---

## 🛠️ Technical Stack

```
Frontend Framework:  React 19 + TypeScript 5.9
Visual Editor:       ReactFlow 11
Styling:             Tailwind CSS 4 + Custom Components
State Management:    Zustand
Build Tool:          Vite 5
Icons:               Lucide React
Utilities:           nanoid, html2canvas

Version Control:     Git + GitHub
Containerization:    Docker (node:22-alpine, nginx:latest-alpine)
```

### Build Information

```
✓ 2366 modules transformed
✓ ~1800 kB gzip size
✓ 3-5 second build time
✓ 0 TypeScript strict mode errors
✓ Production ready
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── FlowCanvas.tsx          # Main canvas editor (ReactFlow integration)
│   ├── Header.tsx              # Top navigation bar with export/profile
│   ├── Sidebar.tsx             # Node library panel
│   ├── NodeDetailsPanel.tsx    # Node property editor (right panel)
│   ├── Toolbar.tsx             # Action buttons (undo/redo/zoom/test)
│   ├── ValidationPanel.tsx     # Error/warning display
│   ├── SimulatorPanel.tsx      # Flow testing interface
│   ├── ConfirmDialog.tsx       # Custom info/danger dialogs
│   ├── Account.tsx             # Profile settings (v1: image only)
│   ├── TemplatesModal.tsx      # Template library
│   └── nodes/                  # Node component definitions
│       ├── StartNode.tsx
│       ├── EndNode.tsx
│       ├── IVRMenuNode.tsx
│       ├── PlayMessageNode.tsx
│       ├── GetInputNode.tsx
│       ├── DecisionNode.tsx
│       ├── TransferNode.tsx
│       ├── QueueNode.tsx
│       ├── APICallNode.tsx
│       ├── RecordNode.tsx
│       ├── WaitNode.tsx
│       └── SetVariableNode.tsx
├── store/
│   ├── flowStore.ts            # Zustand flow state management
│   └── userStore.ts            # Zustand user profile state
├── types/
│   ├── flow.ts                 # Flow, node, edge TypeScript interfaces
│   └── nodes.ts                # Node-specific type definitions
├── utils/
│   ├── flowValidation.ts       # Flow validation engine
│   ├── flowTemplates.ts        # Pre-built template definitions
│   └── nodeDefaults.ts         # Default configuration per node type
└── hooks/
    └── useFlowStore.ts         # Custom Zustand hooks

public/
├── favicon.svg
└── ... (static assets)

dist/                           # Production build output
node_modules/                   # Dependencies
Dockerfile                      # Multi-stage production container
docker-compose.yml             # Local development environment
tailwind.config.js             # Tailwind CSS configuration
tsconfig.json                  # TypeScript compiler options
tsconfig.app.json              # App-specific TypeScript config
tsconfig.node.json             # Node.js environment config
vite.config.ts                 # Vite bundler configuration
eslint.config.js               # ESLint rules
```

---

## 🔧 Recent Updates (v1.1)

### ✨ New Features

- **Real-time Auto-Save**: Saves automatically 1 second after changes with debounce
- **Periodic Backup**: Additional auto-save every 2 minutes as failsafe
- **Custom Dialogs**: Beautiful styled confirmations instead of browser alerts
- **Profile Images**: Upload and display custom avatars (base64 storage)
- **Empty Canvas**: Fresh start on first launch - no default nodes

### 🐛 Improvements & Fixes

- **Docker Security**: Updated node:18-alpine → node:22-alpine, nginx:alpine → nginx:latest-alpine
- **Flow Persistence**: Enhanced localStorage strategy with initialization flags
- **Error Handling**: Better error logging and debugging in console
- **Account Modal**: Simplified for v1 (profile image only, v2 features deferred)
- **Logout Button**: Disabled pending authentication system (v2 feature)

### 🔌 Integration Ready

- **JSON Export**: Full flow data compatible with backend APIs
- **REST API**: Preparation for flow execution endpoints
- **Webhook Ready**: Architecture supports incoming webhooks
- **Docker Ready**: Production container ready to deploy

---

## 📝 Roadmap

### Current Release (v1.1) ✅

- ✅ Visual flow builder with 12+ node types
- ✅ Real-time auto-save persistence (debounce 1s + periodic 2min)
- ✅ Empty canvas on first launch
- ✅ Custom dialog system (info/danger modes)
- ✅ Flow validation with error reporting
- ✅ Export (JSON/PNG/PDF)
- ✅ Profile image upload
- ✅ Responsive UI/UX
- ✅ Keyboard shortcuts
- ✅ Docker security updates

### Next Release (v2.0) 🚧

- ⬜ User authentication system
- ⬜ Multiple projects support
- ⬜ Project metadata (name, description, tags)
- ⬜ Flow templates library with sharing
- ⬜ Collaboration features (team sharing)
- ⬜ Advanced variable system
- ⬜ REST API backend
- ⬜ Database persistence (PostgreSQL)
- ⬜ Flow versioning and history
- ⬜ Full Account modal (name, email, settings)

### Future (v3.0+) 📅

- Workflow scheduler and execution
- Analytics & metrics dashboard
- Team management system
- Enterprise features
- Mobile app
- WebSocket real-time collaboration
- AI-assisted flow suggestions
- Advanced debugging tools

---

## 🎬 Demo Scenarios

### Simple IVR Flow (5 nodes)

1. **Start** → Entry point
2. **Play Message** → "Welcome to support"
3. **IVR Menu** → "Press 1 for sales, 2 for support"
4. **Decision** → Route based on selection
5. **Transfer** → Connect to appropriate department
6. **End** → Call complete

### Complex Call Routing (8+ nodes)

1. **Start** → Entry
2. **Decision** → Check business hours
3. **IVR Menu** → Department selection
4. **Decision** → Route to correct queue
5. **Queue** → Hold with music
6. **Decision** → Transfer or voicemail
7. **API Call** → Log interaction to CRM
8. **Record** → Optional voicemail recording
9. **End** → Call complete

---

## 🛠️ Development Guide

### Setting up for Development

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Project Scripts

| Script               | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Start Vite dev server on port 5173         |
| `npm run build`      | Create optimized production build in dist/ |
| `npm run preview`    | Preview production build locally           |
| `npm run type-check` | Run TypeScript type checking               |
| `npm run lint`       | Run ESLint on source files                 |

### Docker Development

```bash
# Build Docker image
docker build -t telcoflow:dev .

# Run with live reload (mount source)
docker run -v /path/to/src:/app/src -p 8080:80 telcoflow:dev

# Using docker-compose for convenience
docker compose up --build

# View logs
docker compose logs -f web
```

---

## 📚 Additional Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - How to deploy to production (Vercel, Netlify, Docker)
- **[DESIGN.md](DESIGN.md)** - Design patterns, architecture decisions, technical deep dives
- **[FLOW-EXAMPLES.md](FLOW-EXAMPLES.md)** - Example flows to try and learn from
- **[SUMMARY.md](SUMMARY.md)** - Project overview and key features summary

---

## 🤝 Contributing

This is a demonstration project. For modifications:

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test thoroughly: `npm run build`
4. Commit with clear messages: `git commit -m "feat: description"`
5. Push and open a pull request

### Code Style

- TypeScript strict mode enabled
- ESLint configuration enforced
- Prettier formatting for consistency
- Component-based architecture

---

## 📄 License

This project is provided as-is for demonstration and portfolio purposes.

---

## 🙋 Questions & Support

- Check the documentation files listed above
- Review example flows in [FLOW-EXAMPLES.md](FLOW-EXAMPLES.md)
- Test the simulator with provided templates
- Refer to [DESIGN.md](DESIGN.md) for architecture and technical details
- Review console logs during development (auto-save, validation messages)

---

## 🎯 Key Talking Points for Interviews

When presenting this project:

1. **Problem Statement**

   - "Telecom operators need rapid service development without vendor lock-in"
   - Months-long development timelines with traditional approaches

2. **Solution Overview**

   - Visual low-code platform reducing time-to-market from months to days
   - Type-safe TypeScript architecture
   - Real-time simulation and validation

3. **Technical Achievements**

   - Custom flow validation engine
   - Real-time auto-save with debounce strategy
   - Responsive React 19 + TypeScript implementation
   - Docker containerization with security best practices

4. **User Experience**

   - Intuitive drag-and-drop interface
   - Immediate visual feedback
   - No-code flow building
   - Professional UI/UX with dark theme

5. **Scalability & Integration**

   - JSON export for backend integration
   - REST API ready
   - Docker deployment ready
   - Zustand state management

6. **What's Next (v2.0)**
   - Multi-user collaboration
   - Project management
   - Advanced variable system
   - REST API backend with database

---

**Happy flow building!** 🚀📞

_Last updated: January 9, 2026_

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

### How to Use the Simulator

1. **Open the Simulator Panel**

   - Located at bottom-left of the canvas
   - Auto-opens when you start simulation

2. **Run Your Flow**

   ```
   Play   → Run entire flow automatically
   Step   → Execute one node at a time
   Pause  → Pause during execution
   Reset  → Clear state and start over
   ```

3. **Monitor Execution**

   - **Variables**: View all variable values in real-time
   - **Logs**: See execution history with timestamps
   - **Metrics**: Track performance and error counts
   - **Issues**: Quick access to errors and warnings

4. **Filter & Debug**
   - Filter logs by level (All/Info/Warn/Error)
   - Click on Issues to see all errors at once
   - Red banner appears on execution errors

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

#### 2.3 Flow Simulator & Testing

**Real-time Flow Execution**

- ✅ Step-by-step execution engine
- ✅ Play/Pause/Step/Reset controls
- ✅ Visual node highlighting during execution
- ✅ Variable tracking and inspection
- ✅ Execution metrics (duration, node counts)
- ✅ Error detection and reporting

**Expression Evaluator**

```javascript
// Supported operators
==, !=, >, <, >=, <=   // Comparisons
&&, ||                  // Logical operators

// Example conditions
plan === "gold"
balance > 100 && status === "active"
call_duration > 300 || priority === "high"
```

**Execution Logs**

- Color-coded by level (INFO, WARN, ERROR)
- Per-node execution duration
- Filter logs by level
- Detailed error messages with node context

**Metrics Dashboard**

- Total execution duration
- Node execution counts by type
- Error and warning counts
- Real-time variable values
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

- ✅ Templates library
- ✅ Documentation generator (Markdown)
- ✅ Export to PNG/PDF
- ✅ Docker setup
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

### Docker

```bash
# Build image
docker build -t telcoflow:latest .

# Run container
docker run --rm -p 8080:80 telcoflow:latest

# docker-compose (development convenience)
docker compose up --build
```

Served at http://localhost:8080 when using Docker or docker-compose.

### Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to:

- Vercel (recommended)
- Netlify
- Docker
- Any static hosting provider

---

## � Demo

See [DEMO.md](DEMO.md) for:

- How to record a demo video
- Tools and tips for GIF creation
- Custom domain setup instructions
- Interview talking points

---

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
