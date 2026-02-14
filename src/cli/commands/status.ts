/**
 * Status command - show status
 */

import { logger } from '../../utils/logger';
import { getConfig } from '../../config/loader';
import { join } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';

export async function status(): Promise<void> {
  try {
    const config = getConfig();
    const configDir = join(homedir(), '.nanobot-node');
    const configPath = join(configDir, 'config.json');
    const workspaceDir = join(configDir, 'workspace');

    logger.info('=== nanobot-node Status ===');

    // Config status
    logger.info(`Config directory: ${configDir}`);
    logger.info(`Config file: ${existsSync(configPath) ? '✓ Exists' : '✗ Missing'}`);

    // Workspace status
    logger.info(`Workspace directory: ${workspaceDir}`);
    logger.info(`Workspace: ${existsSync(workspaceDir) ? '✓ Exists' : '✗ Missing'}`);

    // Provider status
    logger.info('\n=== Providers ===');
    if (config.providers) {
      for (const [name, provider] of Object.entries(config.providers)) {
        if (provider && provider.apiKey) {
          logger.info(`${name}: ✓ Configured`);
        } else {
          logger.info(`${name}: ✗ Not configured`);
        }
      }
    } else {
      logger.info('No providers configured');
    }

    // Agent status
    logger.info('\n=== Agent ===');
    logger.info(`Default model: ${config.agents?.defaults?.model || 'gpt-3.5-turbo'}`);

    logger.info('\n=== Channels ===');
    if (config.channels) {
      for (const [name, channel] of Object.entries(config.channels)) {
        if (channel && channel.enabled) {
          logger.info(`${name}: ✓ Enabled`);
        } else {
          logger.info(`${name}: ✗ Disabled`);
        }
      }
    } else {
      logger.info('No channels configured');
    }

    logger.info('\nStatus check completed.');
  } catch (error) {
    logger.error(`Error in status command: ${error}`);
  }
}
