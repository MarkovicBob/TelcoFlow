# Week 1 Testing Checklist

## Desktop Testing

### Node Creation & Dragging

- [ ] Drag "Start" node from sidebar to canvas
- [ ] Drag "End" node from sidebar to canvas
- [ ] Verify node is created at drop position
- [ ] Drag each of 12 node types and verify they appear correctly:
  - [ ] Start (green)
  - [ ] End (red)
  - [ ] Decision (orange)
  - [ ] IVR Menu (blue)
  - [ ] Play Message (indigo)
  - [ ] Transfer (purple)
  - [ ] Queue (amber)
  - [ ] API Call (cyan)
  - [ ] Get Input (pink)
  - [ ] Record (rose)
  - [ ] Wait (lime)
  - [ ] Set Variable (teal)

### Node Selection

- [ ] Click a node to select it (should highlight)
- [ ] Click another node with Shift held (should add to selection)
- [ ] Click a node with Ctrl/Cmd held (should toggle selection)
- [ ] Click canvas background to deselect all
- [ ] Right-click menu (if implemented)

### Node Properties

- [ ] Select a node to see properties panel on right
- [ ] Verify panel shows correct properties for node type
- [ ] Edit a property and verify it updates
- [ ] Close panel by clicking X button
- [ ] Verify properties persist after deselection

### Connections

- [ ] Drag from node output handle to another node input
- [ ] Verify edge is created
- [ ] Delete edge by clicking X
- [ ] Verify edge connects from output to input

### Copy/Paste

- [ ] Select a node
- [ ] Press Ctrl+C to copy
- [ ] Press Ctrl+V to paste
- [ ] Verify new node appears at canvas center
- [ ] Verify new node has different ID than original
- [ ] Copy/paste multiple times

### Undo/Redo

- [ ] Drag a node and move it
- [ ] Press Ctrl+Z to undo
- [ ] Verify node returns to previous position
- [ ] Press Ctrl+Y to redo
- [ ] Verify node moves forward again
- [ ] Test undo/redo for:
  - [ ] Adding nodes
  - [ ] Deleting nodes
  - [ ] Moving nodes
  - [ ] Creating connections
  - [ ] Copy/Paste

### Canvas Controls

- [ ] Zoom in/out with mouse wheel
- [ ] Pan canvas by middle-mouse drag
- [ ] Click "Fit View" button (should center all nodes)
- [ ] Use MiniMap to navigate
- [ ] Verify snap-to-grid (nodes align to 15px grid)

### Responsive Design

- [ ] Test on desktop (1920x1080)
- [ ] Resize browser to tablet size (1024x768)
  - [ ] Toolbar wraps properly
  - [ ] Properties panel hidden on sm/md (shows on lg+)
  - [ ] Canvas fills available space
- [ ] Resize to mobile (375x667)
  - [ ] Nodes are readable
  - [ ] Toolbar vertical
  - [ ] Properties panel below canvas
  - [ ] Can still drag nodes

### Mobile Testing (Touch)

#### Drag & Drop

- [ ] Tap-hold sidebar node
- [ ] Drag to canvas
- [ ] Release to drop
- [ ] Verify node appears at touch position
- [ ] Test on multiple node types

#### Node Selection

- [ ] Tap a node to select
- [ ] Tap another with 2-finger hold for multi-select (if supported)
- [ ] Verify selection state changes

#### Canvas Controls

- [ ] Two-finger pinch to zoom
- [ ] Single-finger drag to pan
- [ ] Verify controls are touch-friendly

### Console Checks

- [ ] Open browser DevTools (F12)
- [ ] Look for any error messages
- [ ] Check for warnings
- [ ] Verify no "Unable to preventDefault" errors
- [ ] Network tab: verify assets load correctly

### Performance

- [ ] 20+ nodes on canvas
- [ ] Drag nodes smoothly
- [ ] No lag when zooming
- [ ] No lag when panning
- [ ] FPS stays 60+ (in DevTools Performance tab)

### Accessibility

- [ ] Keyboard navigation works (Tab between nodes?)
- [ ] Color contrast is sufficient
- [ ] Icons have readable sizes
- [ ] Text is readable on all backgrounds

## Test Results

### Passed Tests

- [ ] ...

### Failed Tests

- [ ] ...

### Bugs Found

- [ ] ...

### Notes

- ...
