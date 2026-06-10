# Campus Notifications Frontend

React + Vite frontend application for the Campus Notifications Platform.

## Setup

```bash
cd notification_app_fe
npm install
```

## Environment Variables

Update `.env` with your API configuration:
```
VITE_API_URL=http://4.224.186.213/evaluation-service/notifications
VITE_BEARER_TOKEN=<your_bearer_token>
```

## Run Development Server

```bash
npm run dev
```

The app will start on `http://localhost:3000`

## Features

- **All Notifications**: Browse all notifications with pagination and type filtering
- **Priority Notifications**: View top priority notifications sorted by weight and recency
- **Read/Unread Tracking**: Marks notifications as read and persists state in localStorage
- **Material UI**: Modern, responsive UI using Material-UI components

## Type Weights

- Placement: 3
- Result: 2
- Event: 1
- Other: 0

## Build

```bash
npm run build
```
