import { NextRequest } from 'next/server';
import eventEmitter, { EVENTS } from '@/lib/events';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const onNewOrder = (order: any) => {
    writer.write(encoder.encode(`event: ${EVENTS.NEW_ORDER}\ndata: ${JSON.stringify(order)}\n\n`));
  };

  const onOrderUpdate = (order: any) => {
    writer.write(encoder.encode(`event: ${EVENTS.ORDER_UPDATED}\ndata: ${JSON.stringify(order)}\n\n`));
  };

  eventEmitter.on(EVENTS.NEW_ORDER, onNewOrder);
  eventEmitter.on(EVENTS.ORDER_UPDATED, onOrderUpdate);

  // Keep-alive heartbeat every 15 seconds
  const heartbeat = setInterval(() => {
    writer.write(encoder.encode(': heartbeat\n\n'));
  }, 15000);

  req.signal.onabort = () => {
    clearInterval(heartbeat);
    eventEmitter.off(EVENTS.NEW_ORDER, onNewOrder);
    eventEmitter.off(EVENTS.ORDER_UPDATED, onOrderUpdate);
    writer.close();
  };

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
