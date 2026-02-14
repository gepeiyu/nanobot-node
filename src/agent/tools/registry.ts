/**
 * Tool registry for managing agent tools
 */

import { ToolDefinition } from '../../providers/base';
import { logger } from '../../utils/logger';

export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  execute: (args: Record<string, any>) => Promise<string>;
}

export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  /**
   * Register a tool
   */
  public register(tool: Tool): void {
    this.tools.set(tool.name, tool);
    logger.debug(`Registered tool: ${tool.name}`);
  }

  /**
   * Get a tool by name
   */
  public get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  /**
   * Get all tool definitions
   */
  public getDefinitions(): ToolDefinition[] {
    const definitions: ToolDefinition[] = [];

    for (const tool of this.tools.values()) {
      definitions.push({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters
        }
      });
    }

    return definitions;
  }

  /**
   * Execute a tool
   */
  public async execute(name: string, args: Record<string, any>): Promise<string> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }

    try {
      logger.debug(`Executing tool: ${name} with args: ${JSON.stringify(args)}`);
      const result = await tool.execute(args);
      logger.debug(`Tool ${name} executed successfully`);
      return result;
    } catch (error) {
      logger.error(`Error executing tool ${name}: ${error}`);
      return `Error executing tool ${name}: ${error}`;
    }
  }

  /**
   * Get all registered tools
   */
  public getAll(): Tool[] {
    return Array.from(this.tools.values());
  }
}
