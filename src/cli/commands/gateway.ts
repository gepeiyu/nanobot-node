/**
 * Gateway command - start the gateway
 */

import { logger } from '../../utils/logger';
import { MessageBus } from '../../bus/queue';
import { LLMProvider } from '../../providers/base';
import { AgentLoop } from '../../agent/loop';
import { getConfig } from '../../config/loader';
import { join } from 'path';
import { homedir } from 'os';

export async function gateway(): Promise<void> {
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

    // Start agent loop
    agentLoop.run();

    logger.info('Gateway started. Press Ctrl+C to stop.');

    // Keep process running
    process.on('SIGINT', () => {
      logger.info('Stopping gateway...');
      agentLoop.stop();
      process.exit(0);
    });

    // Wait indefinitely
    await new Promise(() => {});
  } catch (error) {
    logger.error(`Error in gateway command: ${error}`);
  }
}
