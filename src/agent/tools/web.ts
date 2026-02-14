/**
 * Web search and fetch tools
 */

import { Tool } from './registry';
import axios from 'axios';

/**
 * Web search tool
 */
export class WebSearchTool implements Tool {
  public name: string = 'web_search';
  public description: string = 'Search the web for information';
  public parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  } = {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query'
      }
    },
    required: ['query']
  };

  constructor() {
    // No initialization needed
  }

  public async execute(args: Record<string, any>): Promise<string> {
    try {
      const { query } = args;
      
      // Use DuckDuckGo API for search (no API key required)
      const response = await axios.get('https://api.duckduckgo.com', {
        params: {
          q: query,
          format: 'json',
          pretty: 1
        }
      });

      const data = response.data as any;
      let result = `Search results for "${query}":\n\n`;

      if (data.Abstract) {
        result += `Abstract: ${data.Abstract}\n\n`;
      }

      if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        result += 'Related Topics:\n';
        data.RelatedTopics.slice(0, 5).forEach((topic: any) => {
          if (topic.Text) {
            result += `- ${topic.Text}\n`;
          }
        });
      }

      return result;
    } catch (error) {
      return `Error searching web: ${error}`;
    }
  }
}

/**
 * Web fetch tool
 */
export class WebFetchTool implements Tool {
  public name: string = 'web_fetch';
  public description: string = 'Fetch content from a web URL';
  public parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  } = {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        description: 'URL to fetch content from'
      }
    },
    required: ['url']
  };

  public async execute(args: Record<string, any>): Promise<string> {
    try {
      const { url } = args;
      
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      // Limit response size to avoid excessive content
      let content = response.data as string;
      if (content.length > 5000) {
        content = content.substring(0, 5000) + '\n\n[TRUNCATED: Content exceeded 5000 characters]';
      }

      return `Content fetched from ${url}:\n\n${content}`;
    } catch (error) {
      return `Error fetching URL: ${error}`;
    }
  }
}
