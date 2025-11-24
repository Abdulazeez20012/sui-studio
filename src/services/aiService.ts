import { apiService } from './apiService';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  context?: any;
  createdAt: Date;
}

interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

class AIService {
  private currentConversationId: string | null = null;

  async sendMessage(
    message: string,
    context?: {
      code?: string;
      language?: string;
      fileName?: string;
    }
  ): Promise<AIMessage | null> {
    try {
      const response = await apiService.sendAIMessage(
        message,
        this.currentConversationId || undefined,
        context
      );

      // Update current conversation ID
      if (response.conversationId) {
        this.currentConversationId = response.conversationId;
      }

      return response.message;
    } catch (error) {
      console.error('Failed to send AI message:', error);
      return null;
    }
  }

  async getConversations(): Promise<AIConversation[]> {
    try {
      const response = await apiService.getAIConversations();
      return response.conversations || [];
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      return [];
    }
  }

  async loadConversation(id: string): Promise<AIConversation | null> {
    try {
      const response = await apiService.getAIConversation(id);
      this.currentConversationId = id;
      return response.conversation;
    } catch (error) {
      console.error('Failed to load conversation:', error);
      return null;
    }
  }

  async deleteConversation(id: string): Promise<boolean> {
    try {
      await apiService.deleteAIConversation(id);
      if (this.currentConversationId === id) {
        this.currentConversationId = null;
      }
      return true;
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      return false;
    }
  }

  startNewConversation(): void {
    this.currentConversationId = null;
  }

  getCurrentConversationId(): string | null {
    return this.currentConversationId;
  }

  // Helper methods for common queries
  async generateCode(description: string, language: string = 'move'): Promise<AIMessage | null> {
    return this.sendMessage(
      `Generate ${language} code for: ${description}`,
      { language }
    );
  }

  async explainCode(code: string, language: string = 'move'): Promise<AIMessage | null> {
    return this.sendMessage(
      'Explain this code:',
      { code, language }
    );
  }

  async optimizeCode(code: string, language: string = 'move'): Promise<AIMessage | null> {
    return this.sendMessage(
      'How can I optimize this code for gas efficiency?',
      { code, language }
    );
  }

  async debugError(error: string, code?: string): Promise<AIMessage | null> {
    return this.sendMessage(
      `I'm getting this error: ${error}`,
      code ? { code, language: 'move' } : undefined
    );
  }

  async suggestImprovements(code: string, language: string = 'move'): Promise<AIMessage | null> {
    return this.sendMessage(
      'Suggest improvements for this code:',
      { code, language }
    );
  }
}

export const aiService = new AIService();
