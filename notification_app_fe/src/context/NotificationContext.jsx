import React, { createContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const [authToken, setAuthToken] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const AUTH_URL = import.meta.env.VITE_AUTH_URL;
  const EMAIL = import.meta.env.VITE_EMAIL;
  const NAME = import.meta.env.VITE_NAME;
  const ROLL_NO = import.meta.env.VITE_ROLL_NO;
  const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE;
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

  useEffect(() => {
    const stored = localStorage.getItem('readNotifications');
    if (stored) {
      try {
        setReadNotifications(new Set(JSON.parse(stored)));
      } catch (e) {
        console.error('Failed to parse stored read notifications');
      }
    }
  }, []);

  const authenticate = useCallback(async () => {
    try {
console.log('AUTH_URL =', AUTH_URL);
console.log('EMAIL =', EMAIL);
console.log('ROLL_NO =', ROLL_NO);
console.log('CLIENT_ID =', CLIENT_ID);
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
  email: EMAIL,
  name: NAME,
  rollNo: ROLL_NO,
  accessCode: ACCESS_CODE,
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET
})
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Auth failed: ${response.status} - ${text}`);
      }

      const data = await response.json();
      console.log('Auth success, token:', data.access_token?.substring(0, 20) + '...');
      setAuthToken(data.access_token);
      return data.access_token;
    } catch (err) {
      console.error('Authentication error:', err);
      setError(`Auth failed: ${err.message}`);
      return null;
    }
  }, [AUTH_URL, EMAIL, NAME, ACCESS_CODE, CLIENT_ID, CLIENT_SECRET]);


  const fetchNotifications = useCallback(async (limit = null, offset = 0, notificationType = null) => {
    setLoading(true);
    setError(null);
    try {
      let token = authToken;

if (!token) {
  token = await authenticate();
}

if (!token) {
  throw new Error('Failed to obtain authentication token');
}

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const params = new URLSearchParams();
      if (limit) params.append('limit', limit);
      if (offset > 0) params.append('offset', offset);
      if (notificationType) params.append('notification_type', notificationType);

      const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
      console.log('Fetching from:', url);

      const response = await fetch(url, {
        headers,
        mode: 'cors'
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${response.status} - ${text}`);
      }
      const data = await response.json();
      console.log('Notifications received:', data.notifications?.length);
      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [authToken, authenticate, API_URL]);

  useEffect(() => {
    if (!authToken) {
      authenticate().then(token => {
        if (token) {
          setAuthToken(token);
        }
      });
    }
  }, [authenticate]);
  useEffect(() => {
    if (authToken) {
      fetchNotifications();
    }
  }, [authToken, fetchNotifications]);

  const markAsRead = useCallback((notificationId) => {
    setReadNotifications(prev => {
      const updated = new Set(prev);
      updated.add(notificationId);
      localStorage.setItem('readNotifications', JSON.stringify([...updated]));
      return updated;
    });
  }, []);

  const isRead = useCallback((notificationId) => {
    return readNotifications.has(notificationId);
  }, [readNotifications]);

  const value = {
    notifications,
    readNotifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    isRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
