/**
 * Event definitions for message bus
 */

export interface InboundMessage {
  channel: string;
  sender_id: string;
  chat_id: string;
  content: string;
  media?: any;
  metadata?: Record<string, any>;
  session_key?: string;
}

export interface OutboundMessage {
  channel: string;
  chat_id: string;
  content: string;
  metadata?: Record<string, any>;
}
