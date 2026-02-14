/**
 * Shell execution tool
 */
import { Tool } from './registry';
import { exec } from 'child_process';
import { logger } from '../../utils/logger';

export class ExecTool implements Tool {
  public name: string = 'exec';
  public description: string = 'Execute a shell command';
  public parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  } = {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description: 'Shell command to execute'
      }
    },
    required: ['command']
  };

  constructor(private workspace: string) {
    this.workspace = workspace;
  }

  async execute(args: Record<string, any>): Promise<string> {
    const { command } = args;
    logger.info(`Executing shell command: ${command}`);
    
    return new Promise((resolve, reject) => {
      exec(command, { cwd: this.workspace, timeout: 60000 }, (error, stdout, stderr) => {
        if (error) {
          reject(`Error executing command: ${error.message}\nStderr: ${stderr}`);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}
