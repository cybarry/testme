import { setupWebSocket } from '@/lib/websocket-server';
import { createServer } from 'http';
import { NextRequest, NextResponse } from 'next/server';

let server: any = null;

export async function GET(request: NextRequest) {
  if (!server) {
    server = createServer();
    setupWebSocket(server);
    
    const port = process.env.WS_PORT || 3001;
    server.listen(port, () => {
      console.log(`WebSocket server running on port ${port}`);
    });
  }

  return NextResponse.json({ status: 'WebSocket server initialized' });
}
