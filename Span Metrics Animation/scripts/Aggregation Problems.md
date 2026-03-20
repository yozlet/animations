---
This is the narration for the "Aggregation Problems" animation. Each paragraph corresponds to a scene or step in the animation. 
---

Tracing creates spans - basically records of individual operations happening in your system. Each span has attributes like duration, service name, and operation type. Think of these as the context clues that help you understand the behavior of your software.

When you've got instrumented software running under heavy load, you end up with a ton of spans. We're talking potentially millions per minute for a busy web service.

Now, let's say you want to know the average duration of your spans. If they were sitting in a nice, well-indexed database, you could just run a query like `SELECT AVG(duration) FROM spans;`

However, in practice, spans are usually stored in systems that are built for blazing-fast writes, not fancy queries. Try to query a full day's worth of spans and you'll be waiting... and waiting. Real-time analysis becomes pretty painful.

So what's the solution? Aggregate as you go. Keep running totals and counts for things like span durations per service, and record this data once per minute. That way, you can calculate averages quickly without having to scan through everything.

Of course, there's a tradeoff. When you aggregate, you lose the fine details - you can't zoom in on individual spans anymore. And if you want to subdivide by a dimension like operation type, you have to maintain separate aggregates for each combination, which can get complex fast.

This is fine as long as you know in advance what dimensions you care about. And as long as your software doesn't change too often, because every time you add a new attribute to track, you have to update your aggregation logic.

Plus, every time you realise that you want to investigate a new dimension, you're out of luck unless you've been aggregating it from the start. Retrospective analysis becomes impossible, unless you want to go back and reprocess all your raw spans.

So, you start off with as many dimensions as you think you'll need. If you have too few, you miss out on insights. Too many, and your aggregation tables explode in size - especially if some dimensions have high cardinality, like user IDs or request paths.
