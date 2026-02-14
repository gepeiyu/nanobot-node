/**
 * Onboard command - initialize config & workspace
 */

import { homedir } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { logger } from '../../utils/logger';

export async function onboard(): Promise<void> {
  try {
    const configDir = join(homedir(), '.nanobot-node');
    const configPath = join(configDir, 'config.json');
    const workspaceDir = join(configDir, 'workspace');
    const memoryDir = join(workspaceDir, 'memory');

    // Create directories if they don't exist
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
      logger.info(`Created config directory: ${configDir}`);
    }

    if (!existsSync(workspaceDir)) {
      mkdirSync(workspaceDir, { recursive: true });
      logger.info(`Created workspace directory: ${workspaceDir}`);
    }

    if (!existsSync(memoryDir)) {
      mkdirSync(memoryDir, { recursive: true });
      logger.info(`Created memory directory: ${memoryDir}`);
    }

    // Create default config if it doesn't exist
    if (!existsSync(configPath)) {
      const defaultConfig = {
        providers: {
          openai: {
            apiKey: ''
          }
        },
        agents: {
          defaults: {
            model: 'gpt-3.5-turbo'
          }
        },
        channels: {},
        tools: {
          restrictToWorkspace: false
        }
      };

      writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
      logger.info(`Created default config: ${configPath}`);
    }

    // Create AGENTS.md in workspace
    const agentsMdPath = join(workspaceDir, 'AGENTS.md');
    if (!existsSync(agentsMdPath)) {
      const agentsMdContent = `# Agents

This file contains information about your nanobot agents.
`;
      writeFileSync(agentsMdPath, agentsMdContent);
      logger.info(`Created AGENTS.md: ${agentsMdPath}`);
    }

    // Create MEMORY.md in memory directory
    const memoryMdPath = join(memoryDir, 'MEMORY.md');
    if (!existsSync(memoryMdPath)) {
      const memoryMdContent = `# Memory

This file stores your nanobot's long-term memory.
`;
      writeFileSync(memoryMdPath, memoryMdContent);
      logger.info(`Created MEMORY.md: ${memoryMdPath}`);
    }

    logger.info('Onboard completed successfully!');
    logger.info('Please update your config.json with your API keys.');
  } catch (error) {
    logger.error(`Error during onboard: ${error}`);
  }
}
