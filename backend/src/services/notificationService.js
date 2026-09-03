export async function notifyUser(userId, event, payload = {}) { console.log(JSON.stringify({ userId, event, payload, createdAt: new Date().toISOString() })); }
