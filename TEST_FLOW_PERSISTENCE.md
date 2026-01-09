# Test Plan: Flow Persistence & Auto-Save

## Test Case 1: Empty Canvas on First Load
**Expected**: Canvas starts completely empty
- [ ] No nodes visible
- [ ] Nodes: 0 | Edges: 0 displayed
- [ ] Console shows: "First time initialization, clearing old data"
- [ ] Console shows: "No saved flow, starting with empty canvas"

## Test Case 2: Manual Save and Refresh
**Steps**:
1. Add a "Start" node to canvas
2. Open DevTools Console
3. Look for "Auto-saved flow (on change)" message
4. Check localStorage: `JSON.parse(localStorage.getItem('telcoflow_saved')).nodes.length` should be 1
5. Refresh page (F5)
6. **Expected**: Start node is still on canvas at same position

## Test Case 3: Multiple Nodes and Edges
**Steps**:
1. Add "Start" node
2. Wait 1 second for auto-save
3. Add "IVR Menu" node
4. Connect Start → IVR with edge
5. Wait 1 second
6. Refresh page
7. **Expected**: 
   - 2 nodes visible
   - 1 edge connecting them
   - Same positions as before refresh

## Test Case 4: 2-Minute Auto-Save
**Steps**:
1. Clear canvas
2. Add nodes
3. Wait without making changes for 2 minutes
4. **Expected**: Console shows "Auto-saved flow (2 min interval)"

## Test Case 5: Reset Canvas Button
**Steps**:
1. Add multiple nodes to canvas
2. Click "Settings" in top-right corner
3. Click "Reset Canvas" button in Account modal
4. Confirm dialog
5. **Expected**: 
   - Canvas becomes empty
   - localStorage['telcoflow_saved'] is removed
   - Next refresh shows empty canvas

## Implementation Details

### main.tsx
- Clears localStorage on first initialization (if `telcoflow_initialized_v2` flag not set)
- This ensures old/corrupted data is cleaned

### App.tsx
**Three useEffect hooks**:
1. **Mount**: Load saved flow or clear if none exists
2. **Auto-save interval**: Every 2 minutes if nodes exist
3. **Auto-save on change**: 1 second after nodes/edges change

### flowStore.ts
- `loadSavedFlow()`: Returns boolean indicating if flow was loaded
- Added console logging for debugging
- `clearFlow()`: Resets state to empty

### Account.tsx
- Added "Reset Canvas" button in footer
- Opens confirmation dialog
- Clears localStorage['telcoflow_saved'] on confirm
