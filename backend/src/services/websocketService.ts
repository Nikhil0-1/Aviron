import WebSocket, { WebSocketServer } from 'ws';
import { Server } from 'http';

let wss: WebSocketServer | null = null;
const clients = new Set<WebSocket>();

export function initWebSocketServer(server: Server) {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    clients.add(ws);
    console.log(`📡 WebSocket client connected from ${req.socket.remoteAddress}. Total clients: ${clients.size}`);

    // Send initial welcome message
    ws.send(
      JSON.stringify({
        event: 'connection_status',
        data: { status: 'CONNECTED', message: 'Connected to AVIRON WebSocket Command Gateway' },
      })
    );

    ws.on('message', (message: string) => {
      try {
        const parsed = JSON.parse(message.toString());
        if (parsed.event === 'ping') {
          ws.send(JSON.stringify({ event: 'pong', timestamp: new Date().toISOString() }));
        }
      } catch (e) {
        console.error('Invalid WS JSON message received:', message);
      }
    });

    ws.on('close', () => {
      clients.delete(ws);
      console.log(`🔌 Client disconnected. Total clients remaining: ${clients.size}`);
    });

    ws.on('error', (err) => {
      console.error('WebSocket client error:', err);
    });
  });

  // Heartbeat interval
  setInterval(() => {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ event: 'heartbeat', timestamp: new Date().toISOString() }));
      }
    });
  }, 15000);
}

export function broadcastEvent(event: string, data: any) {
  const payload = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}
