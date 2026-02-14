/**
 * DeepSeek Provider implementation
 */

import OpenAI from 'openai';
import { ProviderConfig } from '../config/loader';
import { Message, ChatResponse, ToolDefinition } from './base';
import { logger } from '../utils/logger';

export class DeepSeekProvider {
  private client: OpenAI;
  private defaultModel: string = 'deepseek-chat';

  constructor(config: ProviderConfig = {}) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.apiBase || 'https://api.deepseek.com/v1',
    });
  }

  /**
   * Chat with DeepSeek
   */
  public async chat(
    messages: Message[],
    tools?: ToolDefinition[],
    model?: string,
    temperature: number = 0.7,
    maxTokens: number = 4096
  ): Promise<ChatResponse> {
    try {
      // Convert our Message type to OpenAI's expected type
      const deepseekMessages = messages.map(msg => {
        const deepseekMsg: any = {
          role: msg.role,
          content: msg.content
        };
        if (msg.tool_calls) {
          deepseekMsg.tool_calls = msg.tool_calls;
        }
        if (msg.tool_call_id) {
          deepseekMsg.tool_call_id = msg.tool_call_id;
        }
        return deepseekMsg;
      });

      const response = await this.client.chat.completions.create({
        model: model || this.defaultModel,
        messages: deepseekMessages,
        tools: tools,
        temperature: temperature,
        max_tokens: maxTokens,
      });

      const choice = response.choices[0];
      if (!choice || !choice.message) {
        return {
          content: 'No response from DeepSeek',
          hasToolCalls: false,
          toolCalls: []
        };
      }
      const content = choice.message.content || '';
      const hasToolCalls = !!choice.message.tool_calls && choice.message.tool_calls.length > 0;
      const toolCalls = hasToolCalls && choice.message.tool_calls ? 
        choice.message.tool_calls.map((tc: any) => ({
          id: tc.id,
          name: tc.function.name,
          arguments: JSON.parse(tc.function.arguments)
        })) : [];

      return {
        content,
        hasToolCalls,
        toolCalls,
      };
    } catch (error) {
      logger.error(`Error calling DeepSeek: ${error}`);
      return {
        content: `I'm sorry, I encountered an error while processing your request: ${error}`,
        hasToolCalls: false,
        toolCalls: [],
      };
    }
  }

  /**
   * Get the default model
   */
  public getDefaultModel(): string {
    return this.defaultModel;
  }
}
