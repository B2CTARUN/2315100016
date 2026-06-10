# Campus Notifications Backend - Stage 1

Node.js script for fetching and sorting priority notifications.

## Setup

```bash
cd notification_app_be
```

## Running Stage 1

```bash
node stage1.js
```

## What It Does

1. Fetches notifications from the test server API
2. Applies priority sorting:
   - Placement (weight 3) > Result (weight 2) > Event (weight 1) > Others (weight 0)
   - Newer timestamps first for same priority
3. Displays top 10 notifications using custom logging middleware
4. Logs all operations to the test server

## Configuration

The script uses:
- API URL: `http://4.224.186.213/evaluation-service/notifications`
- Logging Server: `http://4.224.186.213/evaluation-service/logs`
- Bearer Token: Embedded in the script (pre-configured)
