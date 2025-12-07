# 🎨 TelcoFlow - Design System & Visual Specifications

## Color Palette

### Dark Theme (Primary)
```css
--slate-950: #020617    /* Background */
--slate-900: #0f172a    /* Panels */
--slate-800: #1e293b    /* Borders */
--slate-700: #334155    /* Hover states */
--slate-400: #94a3b8    /* Secondary text */
--slate-100: #f1f5f9    /* Primary text */

--blue-500: #3b82f6     /* Primary actions */
--blue-600: #2563eb     /* Hover */
--green-500: #22c55e    /* Success */
--red-500: #ef4444      /* Error */
--amber-500: #f59e0b    /* Warning */
--purple-500: #a855f7   /* Info */
```

### Node Colors (by Type)
```css
--node-start: #22c55e      /* Green - Entry point */
--node-end: #ef4444        /* Red - Terminate */
--node-ivr: #3b82f6        /* Blue - User interaction */
--node-transfer: #8b5cf6   /* Purple - Call routing */
--node-queue: #f59e0b      /* Amber - Waiting */
--node-api: #06b6d4        /* Cyan - Integration */
--node-decision: #ec4899   /* Pink - Logic */
--node-message: #6366f1    /* Indigo - Communication */
```

---

## Typography

```css
/* Headings */
h1: 24px, font-semibold
h2: 18px, font-semibold
h3: 16px, font-medium
h4: 14px, font-medium

/* Body */
body: 14px, font-normal
small: 12px, font-normal
tiny: 10px, font-normal

/* Font Family */
font-family: 'Inter', -apple-system, system-ui, sans-serif
```

---

## Component Specifications

### Node Component
```
┌─────────────────────────┐
│ 🟢 START               │ ← Header (colored by type)
├─────────────────────────┤
│                         │
│  Entry Point            │ ← Title
│  Trigger: Inbound Call  │ ← Subtitle
│                         │
├─────────────────────────┤
│        ◉               │ ← Connection point (bottom)
└─────────────────────────┘

Size: 200px × 100px (default)
Border-radius: 8px
Shadow: 0 4px 6px rgba(0,0,0,0.1)
Border: 2px solid (color varies by type)
```

### IVR Menu Node (Detailed)
```
┌─────────────────────────┐
│ 📱 IVR MENU            │
├─────────────────────────┤
│                         │
│  Main Menu              │
│  "Press 1 for Sales..." │
│                         │
│  Options: 4             │
│  Timeout: 5s            │
├─────────────────────────┤
│    ◉    ◉    ◉    ◉    │ ← Multiple outputs (1,2,3,0)
└──────────────────────────┘

Size: 220px × 140px
Multiple connection points at bottom
```

### Decision Node
```
      ┌───────────────┐
      │ 🔀 DECISION  │
      ├───────────────┤
      │               │
      │ Business Hrs? │
      │               │
      ├─────┬─────────┤
      │  ◉  │    ◉    │ ← Two outputs (true/false)
      └─────┴─────────┘
       YES      NO

Size: 180px × 120px
Diamond shape (optional visual)
```

---

## Layout Specifications

### Main Application Grid
```
┌─────────────────────────────────────────────────────┐
│ Header: 64px height                                 │
├──────────┬──────────────────────────┬───────────────┤
│ Sidebar  │ Canvas                   │ Details Panel │
│ 280px    │ flex-1                   │ 360px         │
│          │                          │ (collapsible) │
│          │                          │               │
│          │                          │               │
│          │                          │               │
│          │                          │               │
├──────────┴──────────────────────────┴───────────────┤
│ Footer: 40px height                                 │
└─────────────────────────────────────────────────────┘
```

### Sidebar Structure
```
┌──────────────────────┐
│  NODE LIBRARY        │ ← Section header
│  ──────────────────  │
│                      │
│  [🟢 Start]         │ ← Draggable node
│  [📱 IVR Menu]      │
│  [⌨️ Get Input]     │
│  [🔊 Play Message]  │
│  [🔀 Decision]      │
│  [☎️ Transfer]      │
│  [👥 Queue]         │
│  [🌐 API Call]      │
│  [🎙️ Record]        │
│  [⏱️ Wait]          │
│  [📝 Set Variable]  │
│  [🔴 End]           │
│                      │
│  ───────────────     │
│                      │
│  TEMPLATES ▼         │
│  • Basic Flow        │
│  • Customer Support  │
│  • Sales IVR         │
│  • After Hours       │
└──────────────────────┘

Width: 280px
Padding: 16px
Gap between items: 8px
```

### Canvas Toolbar
```
┌─────────────────────────────────────────────────────────┐
│ [◀ Undo] [▶ Redo] │ [🔍-] [100%] [🔍+] │ [⊞ Fit View]  │
│                   │                    │ [▶ Test Flow]  │
└─────────────────────────────────────────────────────────┘

Height: 48px
Background: slate-900
Border-bottom: 1px solid slate-800
```

### Details Panel (Right Sidebar)
```
┌──────────────────────────────┐
│ [✕ Close]                    │
│                              │
│ NODE DETAILS                 │
│ ══════════════════════════   │
│                              │
│ 📝 Basic Information         │ ← Collapsible sections
│ ┌──────────────────────────┐ │
│ │ Name:                    │ │
│ │ [Main Menu          ]    │ │
│ │                          │ │
│ │ ID: ivr-001              │ │
│ └──────────────────────────┘ │
│                              │
│ 🎵 Audio Configuration       │
│ ┌──────────────────────────┐ │
│ │ ○ Text-to-Speech         │ │
│ │ ● Audio File             │ │
│ │ [📁 Choose File...]      │ │
│ │ main_menu.wav            │ │
│ └──────────────────────────┘ │
│                              │
│ ⌨️ DTMF Options              │
│ ┌──────────────────────────┐ │
│ │ [1] → Sales Department   │ │
│ │ [2] → Support Queue      │ │
│ │ [3] → Billing Info       │ │
│ │ [+ Add Option]           │ │
│ └──────────────────────────┘ │
│                              │
│ ⚙️ Advanced Settings ▼       │
│                              │
│ [Cancel] [Save Changes]      │
└──────────────────────────────┘

Width: 360px
Padding: 24px
Scrollable content
```

---

## Flow Simulator UI

### Simulator Modal (Overlay)
```
┌─────────────────────────────────────────────────────────────┐
│ 🎬 FLOW SIMULATOR - Customer Support IVR      [Minimize] [✕]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐  ┌────────────────────────────────┐  │
│  │ CALL CONTROLS    │  │ EXECUTION LOG                  │  │
│  │                  │  │                                │  │
│  │  [▶ Start Call]  │  │ 10:23:45 - Call initiated     │  │
│  │  [⏸ Pause]       │  │ 10:23:45 - START node         │  │
│  │  [⏹ Stop]        │  │ 10:23:46 - IVR Menu playing   │  │
│  │  [⏭ Step Fwd]    │  │ 10:23:51 - User pressed: 1    │  │
│  │                  │  │ 10:23:51 - Transfer → Sales   │  │
│  │  Speed: [1x ▼]   │  │ 10:23:52 - Call ended         │  │
│  │                  │  │                                │  │
│  │  Duration: 00:07 │  │ [Clear] [Export Log]           │  │
│  └──────────────────┘  └────────────────────────────────┘  │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ DTMF PAD                                           │    │
│  │                                                    │    │
│  │     [1]   [2]   [3]         Last Input: 1         │    │
│  │     [4]   [5]   [6]         Time: 00:05           │    │
│  │     [7]   [8]   [9]                               │    │
│  │     [*]   [0]   [#]                               │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ VARIABLES                                          │    │
│  │                                                    │    │
│  │  ${caller.phone} = "+1234567890"                  │    │
│  │  ${caller.name} = "John Doe"                      │    │
│  │  ${selected_option} = 1                           │    │
│  │  ${call.duration} = 7                             │    │
│  │  ${node.current} = "transfer-sales"               │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Size: 900px × 700px
Centered overlay with backdrop
Border-radius: 12px
Shadow: 0 25px 50px rgba(0,0,0,0.5)
```

---

## Interaction States

### Node States
```
Normal:     border-2, shadow-md
Hover:      border-3, shadow-lg, scale-105
Selected:   border-4, glow effect, ring-2
Error:      border-red-500, shake animation
Executing:  pulse animation, border-green-500
```

### Button States
```
Primary:
  Normal:  bg-blue-500, text-white
  Hover:   bg-blue-600, scale-105
  Active:  bg-blue-700, scale-95
  Disabled: bg-slate-700, opacity-50

Secondary:
  Normal:  border, bg-transparent
  Hover:   bg-slate-800
  Active:  bg-slate-700
```

### Connection Lines (Edges)
```
Normal:     stroke-slate-600, stroke-width-2
Hover:      stroke-blue-400, stroke-width-3
Selected:   stroke-blue-500, stroke-width-4
Animated:   stroke-dasharray animated (for execution)
```

---

## Icons & Visual Assets

### Node Icons (Lucide Icons)
- Start: `PlayCircle`
- IVR Menu: `Menu`
- Get Input: `Keyboard`
- Play Message: `Volume2`
- Decision: `GitBranch`
- Transfer: `PhoneForwarded`
- Queue: `Users`
- API Call: `Plug`
- Record: `Mic`
- Wait: `Clock`
- Set Variable: `FileEdit`
- End: `XCircle`

### Toolbar Icons
- Undo: `Undo2`
- Redo: `Redo2`
- Zoom In: `ZoomIn`
- Zoom Out: `ZoomOut`
- Fit View: `Maximize2`
- Test: `Play`
- Save: `Save`
- Export: `Download`
- Settings: `Settings`

---

## Animations

### Entrance Animations
```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide in from right */
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* Scale in */
@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

### Interactive Animations
```css
/* Pulse (for executing nodes) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Shake (for errors) */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

/* Flow animation (for edges during execution) */
@keyframes flowAnimation {
  from { stroke-dashoffset: 24; }
  to { stroke-dashoffset: 0; }
}
```

---

## Responsive Breakpoints

```css
/* Mobile (collapse sidebars) */
@media (max-width: 768px) {
  sidebar: hidden (toggle with hamburger)
  details-panel: hidden (modal overlay)
  canvas: full width
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  sidebar: 240px
  details-panel: 320px
}

/* Desktop */
@media (min-width: 1025px) {
  sidebar: 280px
  details-panel: 360px
}

/* Large Desktop */
@media (min-width: 1440px) {
  sidebar: 320px
  details-panel: 400px
  canvas: more whitespace
}
```

---

## Accessibility

- All interactive elements have focus states (ring-2)
- Keyboard navigation support (Tab, Arrow keys)
- ARIA labels for screen readers
- High contrast mode support
- Minimum touch target size: 44×44px
- Color contrast ratio: 4.5:1 minimum

---

## Export Formats

### Flow Diagram (PNG)
- Resolution: 2400×1600 (high-res)
- Background: white or transparent
- Include: grid, nodes, edges, labels
- Watermark: "TelcoFlow" (optional)

### Documentation (PDF)
```
Page 1: Cover (flow name, metadata)
Page 2: Flow diagram (full size)
Page 3: Node details table
Page 4: Variables & settings
Page 5: Test results (if available)
```

### JSON Schema
```json
{
  "version": "1.0",
  "metadata": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "created": "ISO8601",
    "modified": "ISO8601",
    "author": "string",
    "tags": ["string"]
  },
  "nodes": [
    {
      "id": "string",
      "type": "start|ivr|transfer|...",
      "position": { "x": number, "y": number },
      "data": { "...": "type-specific" }
    }
  ],
  "edges": [
    {
      "id": "string",
      "source": "nodeId",
      "target": "nodeId",
      "sourceHandle": "string?",
      "targetHandle": "string?",
      "label": "string?"
    }
  ],
  "variables": {
    "name": { "type": "string|number|boolean", "value": "any" }
  }
}
```

---

**Design System Version:** 1.0  
**Last Updated:** December 7, 2025  
**Designer:** Bob
