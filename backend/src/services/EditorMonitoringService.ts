interface EditorEvent {
  type: 'edit' | 'cursor' | 'save' | 'open' | 'close';
  userId: string;
  userName: string;
  projectId?: string;
  fileName?: string;
  content?: string;
  position?: { line: number; column: number };
  timestamp: Date;
}

interface FileContent {
  content: string;
  lastModified: Date;
  userId: string;
  userName: string;
}

interface LiveStats {
  totalEvents: number;
  activeUsers: number;
  recentEvents: EditorEvent[];
  fileCount: number;
  projectCount: number;
}

class EditorMonitoringService {
  private events: EditorEvent[] = [];
  private fileContents: Map<string, FileContent> = new Map();
  private projectFiles: Map<string, Set<string>> = new Map();
  private readonly MAX_EVENTS = 10000; // Keep last 10k events

  logEditorEvent(event: Omit<EditorEvent, 'timestamp'>) {
    const fullEvent: EditorEvent = {
      ...event,
      timestamp: new Date()
    };

    this.events.push(fullEvent);

    // Keep only recent events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    // Update file content if it's a save event
    if (event.type === 'save' && event.projectId && event.fileName && event.content) {
      const fileKey = `${event.projectId}/${event.fileName}`;
      this.fileContents.set(fileKey, {
        content: event.content,
        lastModified: fullEvent.timestamp,
        userId: event.userId,
        userName: event.userName
      });

      // Track project files
      if (!this.projectFiles.has(event.projectId)) {
        this.projectFiles.set(event.projectId, new Set());
      }
      this.projectFiles.get(event.projectId)!.add(event.fileName);
    }

    console.log(`📝 Editor Event: ${event.type} by ${event.userName} ${event.fileName ? `on ${event.fileName}` : ''}`);
  }

  getFileContent(projectId: string, fileName: string): string | null {
    const fileKey = `${projectId}/${fileName}`;
    const fileData = this.fileContents.get(fileKey);
    return fileData?.content || null;
  }

  getProjectFiles(projectId: string): string[] {
    const files = this.projectFiles.get(projectId);
    return files ? Array.from(files) : [];
  }

  async getFileHistory(projectId: string, fileName: string): Promise<EditorEvent[]> {
    return this.events.filter(event => 
      event.projectId === projectId && 
      event.fileName === fileName &&
      (event.type === 'save' || event.type === 'edit')
    ).slice(-50); // Last 50 events for this file
  }

  getLiveStats(): LiveStats {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const recentEvents = this.events.filter(event => event.timestamp > oneHourAgo);
    const activeUsers = new Set(recentEvents.map(event => event.userId)).size;

    return {
      totalEvents: this.events.length,
      activeUsers,
      recentEvents: recentEvents.slice(-20), // Last 20 events
      fileCount: this.fileContents.size,
      projectCount: this.projectFiles.size
    };
  }

  searchContent(query: string): Array<{ projectId: string; fileName: string; matches: number }> {
    const results: Array<{ projectId: string; fileName: string; matches: number }> = [];
    
    for (const [fileKey, fileData] of this.fileContents.entries()) {
      const [projectId, fileName] = fileKey.split('/');
      const content = fileData.content.toLowerCase();
      const searchQuery = query.toLowerCase();
      
      const matches = (content.match(new RegExp(searchQuery, 'g')) || []).length;
      
      if (matches > 0) {
        results.push({ projectId, fileName, matches });
      }
    }

    return results.sort((a, b) => b.matches - a.matches);
  }

  // Get all events for debugging
  getAllEvents(): EditorEvent[] {
    return [...this.events];
  }

  // Clear old data
  cleanup() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > oneWeekAgo);
    console.log(`🧹 Cleaned up old events. Current count: ${this.events.length}`);
  }
}

// Export singleton instance
export const editorMonitoringService = new EditorMonitoringService();

// Cleanup old data every hour
setInterval(() => {
  editorMonitoringService.cleanup();
}, 60 * 60 * 1000);