# 📋 Flow Examples & Use Cases

Ovaj dokument sadrži konkretne primere telecom flow-ova koje ćeš moći da kreiraš u TelcoFlow platformi.

---

## Example 1: Basic Customer Support IVR

**Use Case:** Glavni meni za customer support
**Complexity:** Beginner
**Estimated Nodes:** 8

### Flow Diagram

```
                    ┌─────────┐
                    │ START   │
                    └────┬────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  IVR MENU   │
                  │ "Press 1..." │
                  └──┬──┬──┬────┘
                     │  │  │
        ┌────────────┘  │  └────────────┐
        │1              │2              │3
        ▼               ▼               ▼
  ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ TRANSFER │    │  QUEUE   │    │ TRANSFER │
  │  Sales   │    │ Support  │    │ Billing  │
  └────┬─────┘    └────┬─────┘    └────┬─────┘
       │               │               │
       │               ▼               │
       │         ┌──────────┐          │
       │         │   END    │          │
       └─────────┤ (Queued) │◄─────────┘
                 └──────────┘
```

### Node Configuration

**1. START Node**

- Type: `start`
- Trigger: Inbound call
- Set variables: `${caller.phone}`, `${call.timestamp}`

**2. IVR MENU Node**

- Name: "Main Menu"
- Audio: "Thank you for calling. Press 1 for Sales, 2 for Support, 3 for Billing."
- Options:
  - 1 → Transfer to Sales
  - 2 → Queue for Support
  - 3 → Transfer to Billing
- Timeout: 5 seconds
- Max retries: 3
- Invalid input: Repeat message

**3-5. TRANSFER/QUEUE Nodes**

- Transfer Sales: Extension 1001
- Queue Support: Priority normal, max wait 300s
- Transfer Billing: Extension 1003

**6. END Node**

- Reason: "Call completed"

---

## Example 2: After-Hours Routing

**Use Case:** Različit flow za business hours vs. after hours
**Complexity:** Intermediate
**Estimated Nodes:** 12

### Flow Diagram

```
                    ┌─────────┐
                    │ START   │
                    └────┬────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  DECISION   │
                  │Business Hrs?│
                  └──┬───────┬──┘
                     │YES    │NO
            ┌────────┘       └────────┐
            ▼                         ▼
    ┌──────────────┐          ┌──────────────┐
    │  IVR MENU    │          │ PLAY MESSAGE │
    │ "Press 1..." │          │"We're closed"│
    └───┬──────┬───┘          └──────┬───────┘
        │1     │2                    │
        ▼      ▼                     ▼
    [Normal routing...]        ┌──────────┐
                               │ IVR MENU │
                               │"Press 1" │
                               └─┬──────┬─┘
                                 │1     │2
                                 ▼      ▼
                           [Voicemail] [Emergency]
```

### Variables Used

```javascript
${system.time}           // Current time (HH:mm)
${system.day}            // Day of week (Mon-Sun)
${business.start}        // "09:00"
${business.end}          // "17:00"
${business.days}         // ["Mon","Tue","Wed","Thu","Fri"]
```

### Decision Logic

```javascript
// Business hours check
(${system.time} >= ${business.start} &&
 ${system.time} <= ${business.end} &&
 ${business.days}.includes(${system.day}))
```

---

## Example 3: VIP Customer Fast Track

**Use Case:** Premium korisnici dobijaju prioritet
**Complexity:** Advanced
**Estimated Nodes:** 15

### Flow Diagram

```
                     ┌─────────┐
                     │ START   │
                     └────┬────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  API CALL   │
                   │Get Customer │
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  DECISION   │
                   │  VIP Tier?  │
                   └──┬───────┬──┘
                      │VIP    │Regular
             ┌────────┘       └────────┐
             ▼                         ▼
      ┌─────────────┐          ┌─────────────┐
      │PLAY MESSAGE │          │  IVR MENU   │
      │ "Welcome,   │          │ "Press 1..."│
      │  Mr. Smith" │          └─────────────┘
      └──────┬──────┘
             ▼
      ┌─────────────┐
      │  TRANSFER   │
      │VIP Agent Pool│
      └─────────────┘
```

### API Integration

```javascript
// CRM Lookup
Endpoint: POST /api/crm/lookup
Headers: {
  "Authorization": "Bearer ${api.key}",
  "Content-Type": "application/json"
}
Body: {
  "phone": "${caller.phone}"
}

Response Mapping:
${customer.id} = response.customer_id
${customer.name} = response.name
${customer.tier} = response.tier
${customer.account_balance} = response.balance
```

### Conditional Routing

```javascript
// VIP check
${customer.tier} == "platinum" || ${customer.tier} == "gold"

// Name personalization
"Welcome, " + ${customer.name} + ". We're connecting you to a dedicated agent."
```

---

## Example 4: Survey After Support Call

**Use Case:** Post-call satisfaction survey
**Complexity:** Intermediate
**Estimated Nodes:** 10

### Flow Diagram

```
                   ┌─────────┐
                   │ START   │
                   └────┬────┘
                        │
                        ▼
                 ┌─────────────┐
                 │PLAY MESSAGE │
                 │"Thank you..." │
                 └──────┬──────┘
                        │
                        ▼
                 ┌─────────────┐
                 │  GET INPUT  │
                 │"Rate 1-5"   │
                 └──────┬──────┘
                        │
                        ▼
                 ┌─────────────┐
                 │ SET VARIABLE│
                 │${rating} = X│
                 └──────┬──────┘
                        │
                        ▼
                 ┌─────────────┐
                 │  API CALL   │
                 │ Send to CRM │
                 └──────┬──────┘
                        │
                        ▼
                   ┌─────────┐
                   │   END   │
                   └─────────┘
```

### Variables

```javascript
${rating}                // 1-5 user input
${call.previous_agent}   // Agent who handled call
${call.previous_queue}   // Which queue it was
${call.wait_time}        // How long they waited
${survey.timestamp}      // When survey completed
```

### API Call (Send Feedback)

```javascript
Endpoint: POST /api/feedback
Body: {
  "caller_id": "${caller.phone}",
  "rating": ${rating},
  "agent_id": "${call.previous_agent}",
  "queue": "${call.previous_queue}",
  "wait_time": ${call.wait_time},
  "timestamp": "${survey.timestamp}"
}
```

---

## Example 5: Callback Queue

**Use Case:** Offer callback umesto čekanja u redu
**Complexity:** Advanced
**Estimated Nodes:** 18

### Flow Diagram

```
                    ┌─────────┐
                    │ START   │
                    └────┬────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  API CALL   │
                  │Queue Status │
                  └──────┬──────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  DECISION   │
                  │Wait > 5min? │
                  └──┬───────┬──┘
                     │YES    │NO
            ┌────────┘       └────────┐
            ▼                         ▼
    ┌──────────────┐          ┌──────────────┐
    │ PLAY MESSAGE │          │   QUEUE      │
    │"Callback?"   │          │  Normal      │
    └──────┬───────┘          └──────────────┘
           │
           ▼
    ┌──────────────┐
    │  GET INPUT   │
    │ "Press 1"    │
    └──┬───────┬───┘
      │1      │2
      ▼       ▼
[Callback] [Queue]
```

### Callback Logic

```javascript
// Check queue status
GET /api/queue/support/status
Response: {
  "wait_time": 320,  // seconds
  "position": 12,
  "available_agents": 3
}

// If wait > 300s, offer callback
if (${queue.wait_time} > 300) {
  // Schedule callback
  POST /api/callback/schedule
  Body: {
    "phone": "${caller.phone}",
    "queue": "support",
    "estimated_time": ${queue.wait_time} + 60
  }
}
```

---

## Example 6: Multi-Language Support

**Use Case:** Podrška za više jezika
**Complexity:** Intermediate
**Estimated Nodes:** 14

### Flow Diagram

```
                    ┌─────────┐
                    │ START   │
                    └────┬────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  IVR MENU   │
                  │"Press 1 EN" │
                  │"Pritisnite 2│
                  │   za RS"    │
                  └──┬───────┬──┘
                     │1      │2
            ┌────────┘       └────────┐
            ▼                         ▼
    ┌──────────────┐          ┌──────────────┐
    │SET VARIABLE  │          │SET VARIABLE  │
    │lang = "en"   │          │lang = "sr"   │
    └──────┬───────┘          └──────┬───────┘
           │                         │
           └──────────┬──────────────┘
                      ▼
              [Main Menu in ${lang}]
```

### Language Variables

```javascript
${lang}                    // "en", "sr", "de", etc.
${messages.welcome[lang]}  // Localized messages
${tts.voice[lang]}         // TTS voice for language

// Message library
${messages} = {
  "welcome": {
    "en": "Welcome to customer support",
    "sr": "Dobrodošli u korisničku podršku",
    "de": "Willkommen beim Kundensupport"
  },
  "menu": {
    "en": "Press 1 for Sales, 2 for Support",
    "sr": "Pritisnite 1 za prodaju, 2 za podršku",
    "de": "Drücken Sie 1 für Vertrieb, 2 für Support"
  }
}
```

---

## Example 7: Emergency Escalation

**Use Case:** Automatic escalation za urgentne slučajeve
**Complexity:** Advanced
**Estimated Nodes:** 20

### Flow Diagram

```
                    ┌─────────┐
                    │ START   │
                    └────┬────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  IVR MENU   │
                  │"Emergency?" │
                  └──┬───────┬──┘
                     │YES    │NO
            ┌────────┘       └────────┐
            ▼                         ▼
    ┌──────────────┐          [Normal Flow]
    │ PLAY MESSAGE │
    │"Connecting..." │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  TRANSFER    │
    │Emergency Team│
    │(No wait!)    │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  API CALL    │
    │Send Alert    │
    │(SMS/Email)   │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  RECORD      │
    │ Full Call    │
    └──────────────┘
```

### Emergency Features

- **Immediate Transfer**: No queue, direct to available agent
- **Alert System**: SMS/Email to supervisor
- **Full Recording**: Auto-enable recording
- **Priority Routing**: Override normal routing rules
- **Real-time Monitoring**: Dashboard alert

---

## Example 8: Account Balance Inquiry

**Use Case:** Self-service balance check
**Complexity:** Intermediate
**Estimated Nodes:** 12

### Flow Diagram

```
                    ┌─────────┐
                    │ START   │
                    └────┬────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  GET INPUT  │
                  │"Enter ID"   │
                  └──────┬──────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  API CALL   │
                  │Get Balance  │
                  └──────┬──────┘
                         │
                         ▼
                  ┌─────────────┐
                  │PLAY MESSAGE │
                  │"Balance: $X"│
                  │(TTS dynamic)│
                  └──────┬──────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  IVR MENU   │
                  │"Press 1..."  │
                  └──┬───────┬──┘
                     │Repeat │Main
                     ▼       ▼
                  [Loop]  [Menu]
```

### Dynamic TTS

```javascript
// Fetch balance
GET /api/account/${account_id}/balance
Response: {
  "balance": 1250.50,
  "currency": "EUR",
  "last_payment": "2025-01-01"
}

// Generate dynamic message
message = "Your current balance is " +
          ${balance.currency} + " " +
          ${balance.balance} +
          ". Last payment was on " +
          ${balance.last_payment} + "."

// Result: "Your current balance is EUR 1250.50.
//          Last payment was on 2025-01-01."
```

---

## Template Categories

### 1. **Basic Templates**

- Simple IVR Menu
- Two-Option Choice
- Direct Transfer
- Queue & Hold

### 2. **Customer Service**

- Support IVR
- Complaint Handling
- Satisfaction Survey
- Callback Request

### 3. **Sales & Marketing**

- Sales IVR
- Product Information
- Order Status
- Promotional Campaign

### 4. **Technical Support**

- Tiered Support
- Troubleshooting Guide
- Remote Assistance
- Ticket Creation

### 5. **Self-Service**

- Balance Inquiry
- Bill Payment
- Appointment Booking
- Status Check

### 6. **Advanced**

- Multi-Language
- Business Hours Routing
- VIP Fast Track
- Emergency Escalation

---

## Testing Scenarios

Za svaki flow, treba testirati:

### Happy Path

✓ Normalan tok bez greške  
✓ Sve opcije funkcionišu  
✓ API pozivi uspešni  
✓ Završava se na END node-u

### Edge Cases

⚠ Invalid user input  
⚠ Timeout na input  
⚠ API failure/timeout  
⚠ No available agents  
⚠ Queue full

### Error Handling

❌ Network error  
❌ Invalid data format  
❌ Missing required field  
❌ Circular reference  
❌ Orphaned nodes

---

## Performance Benchmarks

| Metric           | Target  | Excellent |
| ---------------- | ------- | --------- |
| Node execution   | < 100ms | < 50ms    |
| API call         | < 500ms | < 200ms   |
| TTS generation   | < 1s    | < 500ms   |
| Total flow time  | < 30s   | < 15s     |
| Concurrent calls | 100+    | 500+      |

---

## Export Examples

### JSON Export

```json
{
  "version": "1.0",
  "metadata": {
    "name": "Customer Support IVR",
    "description": "Main support entry point",
    "created": "2025-01-15T10:30:00Z",
    "author": "Bob",
    "tags": ["support", "ivr", "production"]
  },
  "nodes": [...],
  "edges": [...],
  "variables": {...}
}
```

### Documentation Export

- PDF with flow diagram
- Node configuration table
- Variable reference
- API documentation
- Test results

---

**Flow Examples Version:** 1.0  
**Last Updated:** December 7, 2025  
**Author:** Bob
