/**
 * Config loader
 */

import { homedir } from 'os';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { logger } from '../utils/logger';

export interface ProviderConfig {
  apiKey?: string;
  apiBase?: string;
}

export interface ProvidersConfig {
  openai?: ProviderConfig;
  anthropic?: ProviderConfig;
  openrouter?: ProviderConfig;
  deepseek?: ProviderConfig;
  [key: string]: ProviderConfig | undefined;
}

export interface AgentDefaults {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AgentsConfig {
  defaults?: AgentDefaults;
}

export interface ChannelConfig {
  enabled?: boolean;
  [key: string]: any;
}

export interface ChannelsConfig {
  telegram?: ChannelConfig;
  discord?: ChannelConfig;
  whatsapp?: ChannelConfig;
  [key: string]: ChannelConfig | undefined;
}

export interface ToolsConfig {
  restrictToWorkspace?: boolean;
}

export interface Config {
  providers?: ProvidersConfig;
  agents?: AgentsConfig;
  channels?: ChannelsConfig;
  tools?: ToolsConfig;
}

/**
 * Get the config directory path
 */
function getConfigDir(): string {
  return join(homedir(), '.nanobot-node');
}

/**
 * Get the config file path
 */
function getConfigPath(): string {
  return join(getConfigDir(), 'config.json');
}

/**
 * Load the config file
 */
export function getConfig(): Config {
  const configPath = getConfigPath();

  if (!existsSync(configPath)) {
    logger.warn(`Config file not found at ${configPath}. Using default config.`);
    return {};
  }

  try {
    const configContent = readFileSync(configPath, 'utf8');
    const config = JSON.parse(configContent);
    logger.debug('Loaded config successfully');
    return config;
  } catch (error) {
    logger.error(`Error loading config: ${error}`);
    return {};
  }
}

/**
 * Get a specific provider config
 */
export function getProviderConfig(name: string): ProviderConfig | undefined {
  const config = getConfig();
  return config.providers?.[name];
}
