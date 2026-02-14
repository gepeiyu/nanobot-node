/**
 * LLM Provider base class
 */

import { ProvidersConfig } from '../config/loader';
import { OpenAIProvider } from './openai';
import { DeepSeekProvider } from './deepseek';
import { logger } from '../utils/logger';

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
}

export interface ChatResponse {
  content: string;
  hasToolCalls: boolean;
  toolCalls: ToolCall[];
  reasoningContent?: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_calls?: any[];
  tool_call_id?: string;
}

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required?: string[];
    };
  };
}

export class LLMProvider {
  private provider: any;

  constructor(providersConfig: ProvidersConfig = {}) {
    // Choose provider based on config
    if (providersConfig.deepseek?.apiKey) {
      this.provider = new DeepSeekProvider(providersConfig.deepseek);
      logger.info('Using DeepSeek provider');
    } else if (providersConfig.openai?.apiKey) {
      this.provider = new OpenAIProvider(providersConfig.openai);
      logger.info('Using OpenAI provider');
    } else {
      // Default to OpenAI with dummy config
      this.provider = new OpenAIProvider({});
      logger.warn('No provider configured, using default OpenAI provider');
    }
  }

  /**
   * Chat with the LLM
   */
  public async chat(
    messages: Message[],
    tools?: ToolDefinition[],
    model?: string,
    temperature?: number,
    maxTokens?: number
  ): Promise<ChatResponse> {
    return this.provider.chat(messages, tools, model, temperature, maxTokens);
  }

  /**
   * Get the default model
   */
  public getDefaultModel(): string {
    return this.provider.getDefaultModel();
  }
}
