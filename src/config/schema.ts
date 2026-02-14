/**
 * Config schema definitions
 */

import { Config, ProviderConfig, AgentsConfig, ToolsConfig } from './loader';

export class ConfigSchema {
  /**
   * Validate the config schema
   */
  public static validate(config: any): Config {
    const validatedConfig: Config = {};

    // Validate providers
    if (config.providers) {
      validatedConfig.providers = {};
      for (const [name, provider] of Object.entries(config.providers)) {
        validatedConfig.providers[name] = this.validateProviderConfig(provider);
      }
    }

    // Validate agents
    if (config.agents) {
      validatedConfig.agents = this.validateAgentsConfig(config.agents);
    }

    // Validate channels
    if (config.channels) {
      validatedConfig.channels = {};
      for (const [name, channel] of Object.entries(config.channels)) {
        validatedConfig.channels[name] = this.validateChannelConfig(channel);
      }
    }

    // Validate tools
    if (config.tools) {
      validatedConfig.tools = this.validateToolsConfig(config.tools);
    }

    return validatedConfig;
  }

  /**
   * Validate provider config
   */
  private static validateProviderConfig(provider: any): ProviderConfig {
    const validated: ProviderConfig = {};

    if (typeof provider.apiKey === 'string') {
      validated.apiKey = provider.apiKey;
    }

    if (typeof provider.apiBase === 'string') {
      validated.apiBase = provider.apiBase;
    }

    return validated;
  }

  /**
   * Validate agents config
   */
  private static validateAgentsConfig(agents: any): AgentsConfig {
    const validated: AgentsConfig = {};

    if (agents.defaults) {
      validated.defaults = {};
      if (typeof agents.defaults.model === 'string') {
        validated.defaults.model = agents.defaults.model;
      }
      if (typeof agents.defaults.temperature === 'number') {
        validated.defaults.temperature = agents.defaults.temperature;
      }
      if (typeof agents.defaults.maxTokens === 'number') {
        validated.defaults.maxTokens = agents.defaults.maxTokens;
      }
    }

    return validated;
  }

  /**
   * Validate channel config
   */
  private static validateChannelConfig(channel: any): any {
    const validated: any = {};

    if (typeof channel.enabled === 'boolean') {
      validated.enabled = channel.enabled;
    }

    // Copy other properties
    for (const [key, value] of Object.entries(channel)) {
      if (key !== 'enabled') {
        validated[key] = value;
      }
    }

    return validated;
  }

  /**
   * Validate tools config
   */
  private static validateToolsConfig(tools: any): ToolsConfig {
    const validated: ToolsConfig = {};

    if (typeof tools.restrictToWorkspace === 'boolean') {
      validated.restrictToWorkspace = tools.restrictToWorkspace;
    }

    return validated;
  }
}
