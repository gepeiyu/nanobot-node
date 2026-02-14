/**
 * Session manager
 */

import { Message } from '../providers/base';
import { join } from 'path';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { logger } from '../utils/logger';

export class Session {
  public key: string;
  public messages: Message[] = [];
  public lastConsolidated: number = 0;

  constructor(key: string) {
    this.key = key;
  }

  /**
   * Add a message to the session
   */
  public addMessage(role: 'user' | 'assistant' | 'system' | 'tool', content: string): void {
    this.messages.push({
      role,
      content
    });
  }

  /**
   * Get history messages
   */
  public getHistory(maxMessages: number = 50): Message[] {
    return this.messages.slice(-maxMessages);
  }

  /**
   * Clear the session
   */
  public clear(): void {
    this.messages = [];
    this.lastConsolidated = 0;
  }
}

export class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private sessionDir: string;

  constructor(workspace: string) {
    this.sessionDir = join(workspace, 'sessions');
    
    // Create session directory if it doesn't exist
    if (!existsSync(this.sessionDir)) {
      mkdirSync(this.sessionDir, { recursive: true });
    }
  }

  /**
   * Get or create a session
   */
  public getOrCreate(key: string): Session {
    if (!this.sessions.has(key)) {
      const session = new Session(key);
      this.sessions.set(key, session);
      logger.debug(`Created new session: ${key}`);
    }
    return this.sessions.get(key)!;
  }

  /**
   * Save a session to disk
   */
  public save(session: Session): void {
    try {
      const sessionPath = join(this.sessionDir, `${session.key.replace(/:/g, '_')}.json`);
      const sessionData = {
        key: session.key,
        messages: session.messages,
        lastConsolidated: session.lastConsolidated
      };
      writeFileSync(sessionPath, JSON.stringify(sessionData, null, 2));
      logger.debug(`Saved session: ${session.key}`);
    } catch (error) {
      logger.error(`Error saving session: ${error}`);
    }
  }

  /**
   * Load a session from disk
   */
  public load(key: string): Session | null {
    try {
      const sessionPath = join(this.sessionDir, `${key.replace(/:/g, '_')}.json`);
      if (!existsSync(sessionPath)) {
        return null;
      }
      const sessionData = JSON.parse(readFileSync(sessionPath, 'utf8'));
      const session = new Session(sessionData.key);
      session.messages = sessionData.messages;
      session.lastConsolidated = sessionData.lastConsolidated;
      this.sessions.set(key, session);
      logger.debug(`Loaded session: ${key}`);
      return session;
    } catch (error) {
      logger.error(`Error loading session: ${error}`);
      return null;
    }
  }

  /**
   * Invalidate a session
   */
  public invalidate(key: string): void {
    this.sessions.delete(key);
    logger.debug(`Invalidated session: ${key}`);
  }
}
