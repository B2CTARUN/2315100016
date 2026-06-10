# Campus Notifications Microservice - Implementation Plan

Complete implementation of Campus Notifications System in two stages.

## Project Structure

```
.
├── notification_app_be/          # Stage 1: Backend Script
│   ├── stage1.js                 # Priority sorting script
│   └── README.md
├── notification_app_fe/          # Stage 2: Frontend Application
│   ├── src/
│   │   ├── App.jsx               # Main app with tab navigation
│   │   ├── main.jsx              # React entry point
│   │   ├── context/
│   │   │   └── NotificationContext.jsx  # State management
│   │   └── pages/
│   │       ├── AllNotifications.jsx     # All notifications with filter/pagination
│   │       └── PriorityNotifications.jsx # Top N priority notifications
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env                      # API configuration (not committed)
│   └── README.md
├── logging_middleware/           # Custom logging package
│   └── index.js
├── notification_system_design.md # System design with Stage 1 algorithms
└── README.md
```

## Stage 1: Priority Sorting Backend Script

### What It Does

- Fetches notifications from `http://4.224.186.213/evaluation-service/notifications`
- Applies weighted priority sorting:
  - **Placement**: weight 3
  - **Result**: weight 2
  - **Event**: weight 1
  - **Other**: weight 0
- Secondary sort by timestamp (newer first)
- Outputs top 10 notifications using custom logging middleware

### Running Stage 1

```bash
cd notification_app_be
node stage1.js
```

### Expected Output

The script logs to the test server using the logging middleware:
1. "Fetching notifications from test server"
2. "Successfully fetched X notifications"
3. "Displaying Top 10 Priority Notifications"
4. Top 10 notifications in priority order

---

## Stage 2: Frontend Application

### Features

#### All Notifications Page
- Displays all notifications in paginated list (10 per page)
- Filter by notification type (Placement, Result, Event, etc.)
- Click any notification to mark as read
- Visual indicator for read/unread state
- Responsive Material UI design

#### Priority Notifications Page
- Shows top N priority notifications (default: 10, configurable 1-100)
- Ranked display with position number
- Color-coded by type (green for Placement, blue for Result, orange for Event)
- Shows weight value for each notification
- Click to mark as read

#### State Management
- Uses React Context for state management
- localStorage persistence for read/unread state
- Automatic sync across browser tabs
- Survives page reloads

### Setup & Run

```bash
cd notification_app_fe

# Install dependencies
npm install

# Set up environment
# Edit .env and add your VITE_BEARER_TOKEN

# Start development server (runs on port 3000)
npm run dev
```

Visit `http://localhost:3000` to access the application.

### Environment Configuration

Update `notification_app_fe/.env`:
```
VITE_API_URL=http://4.224.186.213/evaluation-service/notifications
VITE_BEARER_TOKEN=<your_bearer_token_from_pre_test_setup>
```

### Build for Production

```bash
cd notification_app_fe
npm run build
```

---

## Verification Plan

### Stage 1 Verification

```bash
cd notification_app_be
node stage1.js
```

✅ Check:
- Script fetches notifications successfully
- Top 10 are displayed in correct priority order
- Logs are sent to test server (via logging middleware)
- No errors in execution

### Stage 2 Verification

```bash
cd notification_app_fe
npm install
npm run dev
```

Then open `http://localhost:3000` in browser:

#### All Notifications Page
- [ ] Page loads with notifications list
- [ ] Pagination works (page 1, 2, 3, etc.)
- [ ] Type filter works (select different types)
- [ ] Clicking notification marks it as read (visual change)
- [ ] Read status persists on page reload
- [ ] All notification types display correctly

#### Priority Notifications Page
- [ ] Shows top 10 notifications by default
- [ ] Notifications sorted by: weight (desc) → timestamp (desc)
- [ ] Change "Number of Top Priorities" updates display
- [ ] Clicking notification marks it as read
- [ ] Read status persists on page reload
- [ ] Position numbers are correct
- [ ] Weight values display correctly

#### Cross-Page Features
- [ ] Switching between tabs works
- [ ] Read status is consistent across tabs
- [ ] localStorage persists data across page reloads
- [ ] API errors display gracefully
- [ ] Loading indicators show during data fetch

---

## Technology Stack

### Stage 1
- Node.js with `http` module
- Custom logging middleware
- Sorting algorithm: O(n log n) time complexity

### Stage 2
- React 18 with Vite
- Material-UI (MUI) for styling
- React Context for state management
- localStorage for persistence
- Responsive design

---

## Notes

- **Port Configuration**: React app runs exclusively on `http://localhost:3000`
- **Logging**: All operations use custom logging_middleware (no console.log)
- **API Token**: Stored in `.env` file (not committed to Git for security)
- **Data Persistence**: Read/unread state persists in browser's localStorage
- **Styling**: Material UI components throughout, no Tailwind or ShadCN
