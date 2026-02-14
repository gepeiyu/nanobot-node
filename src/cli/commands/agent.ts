/**
 * Agent command - chat with the agent
 */

import { logger } from '../../utils/logger';
import { AgentLoop } from '../../agent/loop';
import { MessageBus } from '../../bus/queue';
import { LLMProvider } from '../../providers/base';
import { getConfig } from '../../config/loader';
import { join } from 'path';
import { homedir } from 'os';

export async function agent(options: { message?: string }): Promise<void> {
  try {
    const config = getConfig();
    const configDir = join(homedir(), '.nanobot-node');
    const workspaceDir = join(configDir, 'workspace');

    // Initialize message bus
    const bus = new MessageBus();

    // Initialize LLM provider
    const provider = new LLMProvider(config.providers);

    // Initialize agent loop
    const agentLoop = new AgentLoop({
      bus,
      provider,
      workspace: workspaceDir,
      model: config.agents?.defaults?.model || 'gpt-3.5-turbo',
    });

    // Start agent loop in background
    agentLoop.run();

    // If message is provided, send it
    if (options.message) {
      const response = await agentLoop.processDirect(options.message);
      logger.info(`Agent response: ${response}`);
      agentLoop.stop();
    } else {
      // Interactive mode
      logger.info('Entering interactive mode. Type "exit" to quit.');
      
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const askQuestion = (query: string): Promise<string> => {
        return new Promise(resolve => readline.question(query, resolve));
      };

      let input: string;
      while ((input = await askQuestion('> ')) !== 'exit') {
        const response = await agentLoop.processDirect(input);
        logger.info(`Agent response: ${response}`);
      }

      readline.close();
      agentLoop.stop();
    }
  } catch (error) {
    logger.error(`Error in agent command: ${error}`);
  }
}
