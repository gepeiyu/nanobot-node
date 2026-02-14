/**
 * Filesystem tools
 */

import { Tool } from './registry';
import { join, resolve, normalize } from 'path';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';

/**
 * Read file tool
 */
export class ReadFileTool implements Tool {
  public name: string = 'read_file';
  public description: string = 'Read the content of a file';
  public parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  } = {
    type: 'object',
    properties: {
      file_path: {
        type: 'string',
        description: 'Path to the file to read'
      }
    },
    required: ['file_path']
  };

  private allowedDir?: string;

  constructor(allowedDir?: string) {
    this.allowedDir = allowedDir;
  }

  public async execute(args: Record<string, any>): Promise<string> {
    try {
      const filePath = this.sanitizePath(args['file_path']);
      
      if (!existsSync(filePath)) {
        return `Error: File not found: ${filePath}`;
      }

      const content = readFileSync(filePath, 'utf8');
      return `File content of ${filePath}:\n\n${content}`;
    } catch (error) {
      return `Error reading file: ${error}`;
    }
  }

  private sanitizePath(path: string): string {
    let sanitizedPath = resolve(path);
    
    if (this.allowedDir) {
      const allowedPath = resolve(this.allowedDir);
      const normalizedPath = normalize(sanitizedPath);
      
      if (!normalizedPath.startsWith(allowedPath)) {
        throw new Error(`Access denied: Path ${path} is outside the allowed directory`);
      }
    }
    
    return sanitizedPath;
  }
}

/**
 * Write file tool
 */
export class WriteFileTool implements Tool {
  public name: string = 'write_file';
  public description: string = 'Write content to a file';
  public parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  } = {
    type: 'object',
    properties: {
      file_path: {
        type: 'string',
        description: 'Path to the file to write'
      },
      content: {
        type: 'string',
        description: 'Content to write to the file'
      }
    },
    required: ['file_path', 'content']
  };

  private allowedDir?: string;

  constructor(allowedDir?: string) {
    this.allowedDir = allowedDir;
  }

  public async execute(args: Record<string, any>): Promise<string> {
    try {
      const filePath = this.sanitizePath(args['file_path']);
      writeFileSync(filePath, args['content']);
      return `Successfully wrote to file: ${filePath}`;
    } catch (error) {
      return `Error writing file: ${error}`;
    }
  }

  private sanitizePath(path: string): string {
    let sanitizedPath = resolve(path);
    
    if (this.allowedDir) {
      const allowedPath = resolve(this.allowedDir);
      const normalizedPath = normalize(sanitizedPath);
      
      if (!normalizedPath.startsWith(allowedPath)) {
        throw new Error(`Access denied: Path ${path} is outside the allowed directory`);
      }
    }
    
    return sanitizedPath;
  }
}

/**
 * Edit file tool
 */
export class EditFileTool implements Tool {
  public name: string = 'edit_file';
  public description: string = 'Edit a file by replacing content';
  public parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  } = {
    type: 'object',
    properties: {
      file_path: {
        type: 'string',
        description: 'Path to the file to edit'
      },
      old_string: {
        type: 'string',
        description: 'String to replace'
      },
      new_string: {
        type: 'string',
        description: 'New string to insert'
      }
    },
    required: ['file_path', 'old_string', 'new_string']
  };

  private allowedDir?: string;

  constructor(allowedDir?: string) {
    this.allowedDir = allowedDir;
  }

  public async execute(args: Record<string, any>): Promise<string> {
    try {
      const filePath = this.sanitizePath(args['file_path']);
      
      if (!existsSync(filePath)) {
        return `Error: File not found: ${filePath}`;
      }

      const content = readFileSync(filePath, 'utf8');
      const newContent = content.replace(args['old_string'], args['new_string']);
      writeFileSync(filePath, newContent);
      
      return `Successfully edited file: ${filePath}`;
    } catch (error) {
      return `Error editing file: ${error}`;
    }
  }

  private sanitizePath(path: string): string {
    let sanitizedPath = resolve(path);
    
    if (this.allowedDir) {
      const allowedPath = resolve(this.allowedDir);
      const normalizedPath = normalize(sanitizedPath);
      
      if (!normalizedPath.startsWith(allowedPath)) {
        throw new Error(`Access denied: Path ${path} is outside the allowed directory`);
      }
    }
    
    return sanitizedPath;
  }
}

/**
 * List directory tool
 */
export class ListDirTool implements Tool {
  public name: string = 'list_dir';
  public description: string = 'List files and directories in a directory';
  public parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  } = {
    type: 'object',
    properties: {
      dir_path: {
        type: 'string',
        description: 'Path to the directory to list'
      }
    },
    required: ['dir_path']
  };

  private allowedDir?: string;

  constructor(allowedDir?: string) {
    this.allowedDir = allowedDir;
  }

  public async execute(args: Record<string, any>): Promise<string> {
    try {
      const dirPath = this.sanitizePath(args['dir_path']);
      
      if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) {
        return `Error: Directory not found: ${dirPath}`;
      }

      const entries = readdirSync(dirPath);
      const listing = entries.map(entry => {
        const entryPath = join(dirPath, entry);
        const isDir = statSync(entryPath).isDirectory();
        return `${isDir ? '📁' : '📄'} ${entry}`;
      }).join('\n');

      return `Directory listing of ${dirPath}:\n\n${listing}`;
    } catch (error) {
      return `Error listing directory: ${error}`;
    }
  }

  private sanitizePath(path: string): string {
    let sanitizedPath = resolve(path);
    
    if (this.allowedDir) {
      const allowedPath = resolve(this.allowedDir);
      const normalizedPath = normalize(sanitizedPath);
      
      if (!normalizedPath.startsWith(allowedPath)) {
        throw new Error(`Access denied: Path ${path} is outside the allowed directory`);
      }
    }
    
    return sanitizedPath;
  }
}
