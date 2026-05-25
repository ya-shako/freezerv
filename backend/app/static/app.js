// Пока заглушка
console.log("App loaded");

async function apiRequest(endpoint, method = 'GET', body = null) {
    const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null
    });
    return response;
}
