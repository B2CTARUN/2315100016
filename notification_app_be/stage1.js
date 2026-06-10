const http = require('http');
const { Log, configure } = require('../logging_middleware/index.js');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ0YXJ1bi5jaGFuZHdhbmlfY3MuY2N2MjNAZ2xhLmFjLmluIiwiZXhwIjoxNzgxMDczNjk0LCJpYXQiOjE3ODEwNzI3OTQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIwMzg2ZmZlYS1hMGIzLTQ2OWEtOGUwMS1lYmYwNDQ0YzY3ZTAiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJ0YXJ1biBjaGFuZHdhbmkiLCJzdWIiOiI1ZjY3ZDA1ZS02ZDZhLTQ3OTItYjBiMC1hMGViMWZkZTc0YjYifSwiZW1haWwiOiJ0YXJ1bi5jaGFuZHdhbmlfY3MuY2N2MjNAZ2xhLmFjLmluIiwibmFtZSI6InRhcnVuIGNoYW5kd2FuaSIsInJvbGxObyI6IjIzMTUxMDAwMTYiLCJhY2Nlc3NDb2RlIjoiUlBzZ1l0IiwiY2xpZW50SUQiOiI1ZjY3ZDA1ZS02ZDZhLTQ3OTItYjBiMC1hMGViMWZkZTc0YjYiLCJjbGllbnRTZWNyZXQiOiJxalpCREFLaE5HYnN1bXlaIn0.ai9JLQZzv15BMMfHJGtMcasi07oq6L-oRSgvyD9-_RU";
const serverUrl = "http://4.224.186.213/evaluation-service/logs";
const notificationsUrl = "http://4.224.186.213/evaluation-service/notifications";

configure({ serverUrl, tokenId: token, tokenType: "Bearer" });

const weightMap = {
  placement: 3,
  result: 2,
  event: 1
};

function getWeight(type) {
  if (!type) return 0;
  return weightMap[type.toLowerCase()] || 0;
}

function compareNotifications(a, b) {
  const weightA = getWeight(a.Type);
  const weightB = getWeight(b.Type);
  if (weightA !== weightB) {
    return weightB - weightA;
  }
  const dateA = new Date(a.Timestamp);
  const dateB = new Date(b.Timestamp);
  return dateB - dateA;
}

function fetchNotifications() {
  return new Promise((resolve, reject) => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    http.get(notificationsUrl, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.notifications || []);
          } catch (e) {
            reject(new Error("Failed to parse notifications JSON"));
          }
        } else {
          reject(new Error(`Failed to fetch notifications: Status ${res.statusCode} - ${data}`));
        }
      });
    }).on('error', err => {
      reject(err);
    });
  });
}

async function run() {
  try {
    await Log("backend", "info", "service", "Fetching notifications from test server");
    const list = await fetchNotifications();
    await Log("backend", "info", "service", `Successfully fetched ${list.length} notifications`);

    const sorted = [...list].sort(compareNotifications);
    const top10 = sorted.slice(0, 10);

    await Log("backend", "info", "service", "Displaying Top 10 Priority Notifications");
    for (let i = 0; i < top10.length; i++) {
      const item = top10[i];
      const message = `${i + 1}: [${item.Type}] ${item.Message}`;
      await Log("backend", "info", "service", message);
    }
  } catch (err) {
    await Log("backend", "error", "service", `Error: ${err.message}`);
  }
}

run();
