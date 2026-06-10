# Campus Notifications System Design

This document details the system design and architecture for the Campus Notifications Platform.

## Architecture Overview

The system consists of:
- **Frontend App (`notification_app_fe`)**: A React/Vite web application where users receive real-time notifications.
- **Backend App (`notification_app_be`)**: A Node.js/Express application managing notifications, placements, events, and results.
- **Logging Middleware (`logging_middleware`)**: A package designed to capture the lifecycle of events and report them to the test server.

## Stage 1: Priority Sorting Backend Script

### Sorting Algorithm

The Stage 1 script implements a weighted priority sorting algorithm:

**Type Weights:**
- Placement: 3
- Result: 2
- Event: 1
- Other: 0

**Sorting Logic:**
1. Primary sort: Descending by weight (higher weight first)
2. Secondary sort: Descending by timestamp (newer first) for ties

**Implementation:**
```
sort(notifications) {
  return notifications.sort((a, b) => {
    let weightDiff = weight(b.Type) - weight(a.Type)
    if (weightDiff !== 0) return weightDiff
    return timestamp(b) - timestamp(a)
  })
}
top10 = sorted.slice(0, 10)
```

### Data Structures & Complexity

- **Notifications Array**: O(n) space
- **Sorting**: O(n log n) time complexity using comparison-based sort
- **Selecting Top 10**: O(1) time after sorting (slice operation)
- **Total Time Complexity**: O(n log n)
- **Total Space Complexity**: O(n)

### Efficient Streaming with Min-Heap

For streaming scenarios with incoming notifications:
- Maintain a Min-Heap of size 10
- Each new notification: O(log 10) = O(1) insertion/comparison
- Heap root is the minimum priority notification in top 10
- If new notification has higher priority than root, remove root and insert new one
- Time per notification: O(log 10) ≈ O(1)
- Space: O(10) = O(1)

This approach is optimal for continuously arriving notifications without resorting entire dataset.
