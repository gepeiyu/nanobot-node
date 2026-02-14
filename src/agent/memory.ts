/**
 * Memory store for long-term memory management
 */

import { join } from 'path';
import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import { logger } from '../utils/logger';

export class MemoryStore {
  private memoryDir: string;
  private memoryFile: string;
  private historyFile: string;

  constructor(workspace: string) {
    this.memoryDir = join(workspace, 'memory');
    this.memoryFile = join(this.memoryDir, 'MEMORY.md');
    this.historyFile = join(this.memoryDir, 'HISTORY.md');

    // Create memory directory if it doesn't exist
    if (!existsSync(this.memoryDir)) {
      mkdirSync(this.memoryDir, { recursive: true });
    }

    // Create memory files if they don't exist
    if (!existsSync(this.memoryFile)) {
      writeFileSync(this.memoryFile, '# Memory\n\nThis file stores long-term memory.\n');
    }

    if (!existsSync(this.historyFile)) {
      writeFileSync(this.historyFile, '# History\n\nThis file stores conversation history.\n');
    }
  }

  /**
   * Read long-term memory
   */
  public readLongTerm(): string {
    try {
      if (!existsSync(this.memoryFile)) {
        return '';
      }
      return readFileSync(this.memoryFile, 'utf8');
    } catch (error) {
      logger.error(`Error reading memory: ${error}`);
      return '';
    }
  }

  /**
   * Write long-term memory
   */
  public writeLongTerm(content: string): void {
    try {
      writeFileSync(this.memoryFile, content);
      logger.debug('Updated long-term memory');
    } catch (error) {
      logger.error(`Error writing memory: ${error}`);
    }
  }

  /**
   * Append to history
   */
  public appendHistory(entry: string): void {
    try {
      appendFileSync(this.historyFile, `\n${entry}`);
      logger.debug('Appended to history');
    } catch (error) {
      logger.error(`Error appending to history: ${error}`);
    }
  }

  /**
   * Read history
   */
  public readHistory(): string {
    try {
      if (!existsSync(this.historyFile)) {
        return '';
      }
      return readFileSync(this.historyFile, 'utf8');
    } catch (error) {
      logger.error(`Error reading history: ${error}`);
      return '';
    }
  }
}
