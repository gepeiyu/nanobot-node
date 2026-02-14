/**
 * Message bus queue
 */

import { InboundMessage, OutboundMessage } from './events';
import { logger } from '../utils/logger';

export class MessageBus {
  private inboundQueue: InboundMessage[] = [];
  private outboundQueue: OutboundMessage[] = [];

  /**
   * Publish an inbound message to the bus
   */
  public publishInbound(message: InboundMessage): void {
    this.inboundQueue.push(message);
    logger.debug(`Published inbound message from ${message.channel}:${message.sender_id}`);
  }

  /**
   * Publish an outbound message to the bus
   */
  public publishOutbound(message: OutboundMessage): void {
    this.outboundQueue.push(message);
    logger.debug(`Published outbound message to ${message.channel}:${message.chat_id}`);
  }

  /**
   * Consume an inbound message from the bus
   */
  public async consumeInbound(): Promise<InboundMessage> {
    while (this.inboundQueue.length === 0) {
      // Wait for a message to be available
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const message = this.inboundQueue.shift()!;
    logger.debug(`Consumed inbound message from ${message.channel}:${message.sender_id}`);
    return message;
  }

  /**
   * Consume an outbound message from the bus
   */
  public async consumeOutbound(): Promise<OutboundMessage> {
    while (this.outboundQueue.length === 0) {
      // Wait for a message to be available
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const message = this.outboundQueue.shift()!;
    logger.debug(`Consumed outbound message to ${message.channel}:${message.chat_id}`);
    return message;
  }

  /**
   * Get the length of the inbound queue
   */
  public getInboundQueueLength(): number {
    return this.inboundQueue.length;
  }

  /**
   * Get the length of the outbound queue
   */
  public getOutboundQueueLength(): number {
    return this.outboundQueue.length;
  }
}
