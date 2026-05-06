import { EventEmitter } from 'events';

// Global emitter for real-time events
const eventEmitter = new EventEmitter();

// Increase max listeners for many KDS screens
eventEmitter.setMaxListeners(100);

export const EVENTS = {
  NEW_ORDER: 'NEW_ORDER',
  ORDER_UPDATED: 'ORDER_UPDATED',
  NEW_RESERVATION: 'NEW_RESERVATION',
};


export default eventEmitter;
