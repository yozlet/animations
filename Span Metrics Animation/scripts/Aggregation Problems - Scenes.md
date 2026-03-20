---
This file contains the narration and visual scene descriptions for the "Aggregation Problems" animation. Each section has the narration paragraph followed by the detailed scene description.
---

## Scene 1

**Narration:**
Tracing creates spans - basically records of individual operations happening in your system. Each span has attributes like duration, service name, and operation type. Think of these as the context clues that help you understand the behavior of your software.

**Scene Description:**
- **Top half**: 3-4 individual span cards appearing with fade-in and float-up animation
  - Each card shows key attributes: service name, endpoint, duration, status code
  - Icons appear next to each attribute type (clock for duration, server for service, etc.)
  - Cards are colorful and distinct, emphasizing their individual context
- **Bottom half**: Bar graph appearing below as spans appear
  - Each span gets a corresponding bar showing its duration
  - Bars are wide and distinct with plenty of space between them
  - Heights represent duration in milliseconds
  - Color-coded to match their span cards above
  - X-axis: span IDs, Y-axis: duration (ms)

---

## Scene 2

**Narration:**
When you've got instrumented software running under heavy load, you end up with a ton of spans. We're talking potentially millions per minute for a busy web service.

**Scene Description:**
- **Top**: Span cards shrink and multiply, flowing in rapidly from the left as a continuous stream
- **Bottom**: Bar graph bars get progressively narrower as more spans arrive
  - Animation sequence: 5 wide bars → 20 medium bars → 50 narrow bars → 200+ thin lines
  - The graph becomes so dense it looks like a packed waveform
- **Overlay**: Counter showing "Spans/minute: 1,247,391" counting up rapidly
- Visual conveys overwhelming volume and density

---

## Scene 3

**Narration:**
Now, let's say you want to know the average duration of your spans. If they were sitting in a nice, well-indexed database, you could just run a query like `SELECT AVG(duration) FROM spans;`

**Scene Description:**
- **Background**: The dense bar graph remains (hundreds of thin lines)
- **Query panel appears**: Simplified SQL interface showing:
  ```sql
  SELECT AVG(duration) FROM spans;
  ```
- **Interaction sequence**:
  - Cursor blinks at end of query
  - "Execute" button highlights
  - When pressed, a colored scan line appears at the left edge of the bar graph
  - Scan line begins moving slowly from left to right across all bars
  - As it passes each bar, that bar briefly lights up/highlights
- **Visual metaphor**: The query is literally reading through every single bar

---

## Scene 4

**Narration:**
However, in practice, spans are usually stored in systems that are built for blazing-fast writes, not fancy queries. Try to query a full day's worth of spans and you'll be waiting... and waiting. Real-time analysis becomes pretty painful.

**Scene Description:**
- **Split screen** showing the tension:
  - **Left side**: New spans continue flowing in rapidly, adding more thin bars to the right edge of the graph (fast writes)
  - **Right side**: The query scan line still crawling through bars from Scene 3, barely 25% through (slow reads)
- **Timer overlay**: "Query time: 47s... 48s... 49s..." counting up
- **Visual tension**: Graph keeps growing on the right while scan struggles on the left
- **Queue indicator**: Visual "backlog" building up - the query falling further behind
- Optional: Hourglass or waiting animation emphasizing the slowness

---

## Scene 5

**Narration:**
So what's the solution? Aggregate as you go. Keep running totals and counts for things like span durations per service, and record this data once per minute. That way, you can calculate averages quickly without having to scan through everything.

**Scene Description:**
- **Top**: Spans continue flowing in from the left
- **Middle**: Processing pipeline appears
  - Spans flow through a "processing" node/aggregator
  - Node groups spans by service (shows service icons/names)
  - Visual indication of grouping/bucketing happening
- **Bottom**: Clean aggregation table appears
  - Columns: `Service | Count | Avg Duration | Last Updated`
  - Rows populate per-service:
    - "API Gateway | 1,247 | 125ms | 14:32:00"
    - "User Service | 892 | 98ms | 14:32:00"
    - "Payment Service | 445 | 203ms | 14:32:00"
  - Timer: "Updated: every 60s"
- **Contrast**: Small, manageable table vs. the overwhelming bar graph from before

---

## Scene 6

**Narration:**
Of course, there's a tradeoff. When you aggregate, you lose the fine details - you can't zoom in on individual spans anymore. And if you want to subdivide by a dimension like operation type, you have to maintain separate aggregates for each combination, which can get complex fast.

**Scene Description:**
- **Split screen** showing what's lost:
  - **Left side** (dimmed/faded): Individual span cards with full detail (all attributes visible)
  - **Arrow** pointing right labeled "Aggregation"
  - **Right side** (bright): The aggregation table showing only summary stats
- **Zoom attempt**:
  - Magnifying glass appears over a table row
  - Zoom fails - can't see individual spans, just summary numbers
  - "Detail unavailable" indicator
- **Dimension selector** appears below: "Group by: [Service ▼]"
- **Combinatorial growth animation**:
  - Adding "Endpoint" dimension: 4 rows → 12 rows
  - Adding "HTTP Method": 12 rows → 48 rows
  - Visual indication of table exploding in size

---

## Scene 7

**Narration:**
This is fine as long as you know in advance what dimensions you care about. And as long as your software doesn't change too often, because every time you add a new attribute to track, you have to update your aggregation logic.

**Scene Description:**
- **Timeline view**: Calendar/timeline showing "Day 1" → "Day 30" → "Day 60"
- **Code/config panel** showing aggregation configuration:
  - **Day 1**: `dimensions: [service, endpoint]`
  - Aggregation running smoothly
- **Day 30**:
  - New attribute appears in incoming span cards: `cache_hit: true/false`
  - Attribute highlighted but doesn't match any dimension in config
  - Warning icon: "⚠️ New attribute detected but not aggregated"
  - Data flowing past without being captured
- **Developer action sequence**:
  - Developer updates config file
  - Code review → Deploy pipeline → Rollout
  - Time passes (loading/deployment animation)
- **Day 60**:
  - Config updated: `dimensions: [service, endpoint, cache_hit]`
  - Aggregation now capturing the new dimension
- **Visual emphasis**: The feedback loop - code changes → config updates → redeployment cycle

---

## Scene 8

**Narration:**
Plus, every time you realise that you want to investigate a new dimension, you're out of luck unless you've been aggregating it from the start. Retrospective analysis becomes impossible, unless you want to go back and reprocess all your raw spans.

**Scene Description:**
- **Incident scenario**:
  - **Top left**: Alert appears: "🚨 Latency spike detected at 14:35"
  - **Center**: Developer/investigator attempting to query aggregation data
- **Query panel**:
  ```
  Show me: Service=API, Endpoint=/checkout, User_Tier=Premium
  ```
  - `User_Tier` dimension highlighted in red/crossed out
  - Error message: "❌ Dimension not available - not aggregated"
- **Two paths diverge** at bottom:
  - **Path A** (left, dimmed): Database labeled "Raw Spans"
    - Faded/grayed out
    - Warning: "30 day retention - data expired"
    - Trash icon or "Data deleted" indicator
  - **Path B** (right, crossed out): "Reprocess historical data"
    - Cost estimate: "💰 $$$"
    - Time estimate: "⏱️ ~48 hours"
    - Progress bar stuck at 0%
- **Result**: Blocked/dead-end indicator - investigation cannot proceed
- Visual tone: Frustration, missed opportunity

---

## Scene 9

**Narration:**
So, you start off with as many dimensions as you think you'll need. If you have too few, you miss out on insights. Too many, and your aggregation tables explode in size - especially if some dimensions have high cardinality, like user IDs or request paths.

**Scene Description:**
- **Center**: Balance scale showing the tension/dilemma
- **Left side**: "Too Few Dimensions"
  - Shows 2-3 simple dimensions: `[service, endpoint]`
  - Magnifying glass icon showing "Insight gaps"
  - Alert icons: "❌ Can't drill down to root cause"
  - "❌ Missing context for debugging"
  - Scale side is light/floating
- **Right side**: "Too Many Dimensions"
  - Shows 8+ dimensions: `[service, endpoint, method, status, region, tier, user_id, request_path]`
  - `user_id` and `request_path` highlighted with "⚠️ High cardinality" warnings
  - Explosion effect radiating from these dimensions
  - Counter: "Time series: 2,847,392 combinations"
  - Meters showing strain:
    - "💾 Storage: ████████░ 94% full"
    - "💰 Cost: $$$$$$"
  - Scale side heavily weighted down
- **Bottom**: Cardinality formula visualization
  - `4 × 5 × 4 × 6 × 1000 users × 500 paths = 2,400,000`
  - Visual showing exponential growth
- **Result**: Scale tips dramatically to the right, crashes down
- Echo of the cardinality explosion from the existing animation

---

## Technical Notes

**Animation Structure:**
- Step-by-step progression (Next/Previous buttons)
- Each scene plays its animation when entered
- Integrated captions with toggle option
- When captions disabled, narration logged to console (presenter mode)

**Visual Style:**
- Hybrid: simplified realistic (matching existing Span Metrics animation)
- Color scheme: Slate/blue/purple gradients (consistent with existing)
- Motion: Smooth transitions with Framer Motion
- Icons: Lucide React icons

**Scene Transitions:**
- Smooth fade between scenes
- Elements from previous scene can morph into next scene where logical
- Navigation controls: Next, Previous, Scene indicator (1/9)
