/**
 * Context builder for LLM
 */

import { Message } from '../providers/base';

export class ContextBuilder {
  private workspace: string;

  constructor(workspace: string) {
    this.workspace = workspace;
  }

  /**
   * Build messages for LLM chat
   */
  public buildMessages(
    history: Message[] = [],
    currentMessage: string
  ): Message[] {
    const messages: Message[] = [];

    // Add system prompt
    messages.push(this.buildSystemPrompt());

    // Add history messages
    if (history.length > 0) {
      messages.push(...history);
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: currentMessage
    });

    return messages;
  }

  /**
   * Build system prompt
   */
  private buildSystemPrompt(): Message {
    const systemPrompt = `You are nanobot-node, an ultra-lightweight personal AI assistant.

Your core directives:
1. Be helpful, friendly, and concise
2. Use tools when necessary to complete tasks
3. Keep conversations focused and relevant
4. Maintain context awareness
5. Provide accurate and up-to-date information

Your capabilities:
- File operations (read, write, edit, list)
- Shell command execution
- Web search and fetch
- Message sending
- Task spawning
- Cron scheduling

Workspace directory: ${this.workspace}

Respond in a natural, conversational manner.`;

    return {
      role: 'system',
      content: systemPrompt
    };
  }

  /**
   * Add assistant message to context
   */
  public addAssistantMessage(
    messages: Message[],
    content: string,
    toolCalls?: any[]
  ): Message[] {
    const assistantMessage: Message = {
      role: 'assistant',
      content: content
    };

    if (toolCalls && toolCalls.length > 0) {
      assistantMessage.tool_calls = toolCalls;
    }

    messages.push(assistantMessage);
    return messages;
  }

  /**
   * Add tool result to context
   */
  public addToolResult(
    messages: Message[],
    toolCallId: string,
    toolName: string,
    result: string
  ): Message[] {
    const toolMessage: Message = {
      role: 'tool',
      content: `Tool ${toolName} returned: ${result}`,
      tool_call_id: toolCallId
    };

    messages.push(toolMessage);
    return messages;
  }
}
