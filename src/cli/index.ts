/**
 * CLI entry point
 */

import { Command } from 'commander';
import { onboard } from './commands/onboard';
import { agent } from './commands/agent';
import { gateway } from './commands/gateway';
import { status } from './commands/status';
import { logger } from '../utils/logger';

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

// Handle unknown commands
program.on('command:*', () => {
  logger.error('Invalid command. See --help for available commands.');
  process.exit(1);
});

// Parse commands
program.parse(process.argv);
