#!/usr/bin/env node

/**
 * nanobot-node - Ultra-Lightweight Personal AI Assistant
 */

import { Command } from 'commander';
import { onboard } from './cli/commands/onboard';
import { agent } from './cli/commands/agent';
import { gateway } from './cli/commands/gateway';
import { status } from './cli/commands/status';

const program = new Command();

program
  .name('nanobot-node')
  .description('Ultra-Lightweight Personal AI Assistant (Node.js Version)')
  .version('0.1.0');

program
  .command('onboard')
  .description('Initialize config & workspace')
  .action(onboard);

program
  .command('agent')
  .description('Chat with the agent')
  .option('-m, --message <message>', 'Message to send')
  .action(agent);

program
  .command('gateway')
  .description('Start the gateway')
  .action(gateway);

program
  .command('status')
  .description('Show status')
  .action(status);

program.parse(process.argv);
