/**
 * Agent loop - core processing engine
 */

import { InboundMessage, OutboundMessage } from '../bus/events';
import { MessageBus } from '../bus/queue';
import { LLMProvider, Message } from '../providers/base';
import { ContextBuilder } from './context';
import { SessionManager } from '../session/manager';
import { ToolRegistry } from './tools/registry';
import { ReadFileTool, WriteFileTool, EditFileTool, ListDirTool } from './tools/filesystem';
import { ExecTool } from './tools/shell';
import { WebSearchTool, WebFetchTool } from './tools/web';
import { logger } from '../utils/logger';

export interface AgentLoopOptions {
  bus: MessageBus;
  provider: LLMProvider;
  workspace: string;
  model?: string;
  maxIterations?: number;
  temperature?: number;
  maxTokens?: number;
  memoryWindow?: number;
  restrictToWorkspace?: boolean;
  sessionManager?: SessionManager;
}

export class AgentLoop {
  private bus: MessageBus;
  private provider: LLMProvider;
  private workspace: string;
  private model: string;
  private maxIterations: number;
  private temperature: number;
  private maxTokens: number;
  private memoryWindow: number;
  private restrictToWorkspace: boolean;
  private context: ContextBuilder;
  private sessions: SessionManager;
  private tools: ToolRegistry;
  private running: boolean = false;

  constructor(options: AgentLoopOptions) {
    this.bus = options.bus;
    this.provider = options.provider;
    this.workspace = options.workspace;
    this.model = options.model || 'gpt-3.5-turbo';
    this.maxIterations = options.maxIterations || 20;
    this.temperature = options.temperature || 0.7;
    this.maxTokens = options.maxTokens || 4096;
    this.memoryWindow = options.memoryWindow || 50;
    this.restrictToWorkspace = options.restrictToWorkspace || false;

    this.context = new ContextBuilder(this.workspace);
    this.sessions = options.sessionManager || new SessionManager(this.workspace);
    this.tools = new ToolRegistry();

    // Register default tools
    this.registerDefaultTools();
  }

  /**
   * Register default tools
   */
  private registerDefaultTools(): void {
    // File tools
    const allowedDir = this.restrictToWorkspace ? this.workspace : undefined;
    this.tools.register(new ReadFileTool(allowedDir));
    this.tools.register(new WriteFileTool(allowedDir));
    this.tools.register(new EditFileTool(allowedDir));
    this.tools.register(new ListDirTool(allowedDir));
    
    // Shell tool
    this.tools.register(new ExecTool(this.workspace));
    
    // Web tools
    this.tools.register(new WebSearchTool());
    this.tools.register(new WebFetchTool());
  }

  /**
   * Run the agent loop
   */
  public run(): void {
    this.running = true;
    logger.info('Agent loop started');
    this.processMessages();
  }

  /**
   * Stop the agent loop
   */
  public stop(): void {
    this.running = false;
    logger.info('Agent loop stopped');
  }

  /**
   * Process messages from the bus
   */
  private async processMessages(): Promise<void> {
    while (this.running) {
      try {
        const msg = await this.bus.consumeInbound();
        const response = await this.processMessage(msg);
        if (response) {
          await this.bus.publishOutbound(response);
        }
      } catch (error) {
        logger.error(`Error processing message: ${error}`);
      }
      // Small delay to prevent busy loop
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Process a single message
   */
  public async processMessage(msg: InboundMessage): Promise<OutboundMessage | null> {
    try {
      const sessionKey = msg.session_key || `${msg.channel}:${msg.chat_id}`;
      const session = this.sessions.getOrCreate(sessionKey);

      // Build initial messages
      const initialMessages = this.context.buildMessages(
        session.getHistory(this.memoryWindow),
        msg.content
      );

      // Run agent loop
      const { finalContent } = await this.runAgentLoop(initialMessages);

      // Add messages to session
      session.addMessage('user', msg.content);
      session.addMessage('assistant', finalContent);
      this.sessions.save(session);

      // Return response
      return {
        channel: msg.channel,
        chat_id: msg.chat_id,
        content: finalContent,
        metadata: msg.metadata
      };
    } catch (error) {
      logger.error(`Error processing message: ${error}`);
      return {
        channel: msg.channel,
        chat_id: msg.chat_id,
        content: `Sorry, I encountered an error: ${error}`
      };
    }
  }

  /**
   * Run agent iteration loop
   */
  private async runAgentLoop(initialMessages: Message[]): Promise<{ finalContent: string }> {
    let messages = initialMessages;
    let iteration = 0;
    let finalContent = '';

    while (iteration < this.maxIterations) {
      iteration++;

      // Get tool definitions
      const toolDefinitions = this.tools.getDefinitions();

      // Call LLM
      const response = await this.provider.chat(
        messages,
        toolDefinitions.length > 0 ? toolDefinitions : undefined,
        this.model,
        this.temperature,
        this.maxTokens
      );

      if (response.hasToolCalls) {
        // Process tool calls
        messages.push({
          role: 'assistant',
          content: response.content,
          tool_calls: response.toolCalls.map(tc => ({
            id: tc.id,
            type: 'function',
            function: {
              name: tc.name,
              arguments: JSON.stringify(tc.arguments)
            }
          }))
        });

        // Execute each tool call
        for (const toolCall of response.toolCalls) {
          logger.info(`Executing tool: ${toolCall.name}`);
          const result = await this.tools.execute(toolCall.name, toolCall.arguments);
          
          // Add tool result to messages
          messages.push({
            role: 'tool',
            content: `Tool ${toolCall.name} returned: ${result}`,
            tool_call_id: toolCall.id
          });
        }

        // Add user prompt to continue
        messages.push({
          role: 'user',
          content: 'Reflect on the results and decide next steps.'
        });
      } else {
        // No more tool calls, use the content as final response
        finalContent = response.content;
        break;
      }
    }

    if (!finalContent) {
      finalContent = 'I\'ve completed processing but have no response to give.';
    }

    return { finalContent };
  }

  /**
   * Process a direct message (for CLI)
   */
  public async processDirect(content: string, sessionKey: string = 'cli:direct'): Promise<string> {
    const session = this.sessions.getOrCreate(sessionKey);

    // Build initial messages
    const initialMessages = this.context.buildMessages(
      session.getHistory(this.memoryWindow),
      content
    );

    // Run agent loop
    const { finalContent } = await this.runAgentLoop(initialMessages);

    // Add messages to session
    session.addMessage('user', content);
    session.addMessage('assistant', finalContent);
    this.sessions.save(session);

    return finalContent;
  }
}
