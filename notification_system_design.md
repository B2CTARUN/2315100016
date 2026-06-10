# Campus Notifications System Design

This document details the system design and architecture for the Campus Notifications Platform.

## Architecture Overview

The system consists of:
- **Frontend App (`notification_app_fe`)**: A React/Vite web application where users receive real-time notifications.
- **Backend App (`notification_app_be`)**: A Node.js/Express application managing notifications, placements, events, and results.
- **Logging Middleware (`logging_middleware`)**: A package designed to capture the lifecycle of events and report them to the test server.
