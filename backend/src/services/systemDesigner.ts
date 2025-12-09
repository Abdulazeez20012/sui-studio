export interface Component {
  id: string;
  type: 'module' | 'object' | 'resource' | 'capability' | 'function';
  name: string;
  x: number;
  y: number;
  connections: string[];
  properties?: Record<string, any>;
}

export interface Design {
  id: string;
  name: string;
  description?: string;
  components: Component[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateCodeOptions {
  moduleName?: string;
  includeComments?: boolean;
  includeTests?: boolean;
}

class SystemDesignerService {
  private designs: Map<string, Design> = new Map();

  /**
   * Create a new design
   */
  createDesign(name: string, description?: string): Design {
    const design: Design = {
      id: `design-${Date.now()}`,
      name,
      description,
      components: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.designs.set(design.id, design);
    return design;
  }

  /**
   * Get design by ID
   */
  getDesign(id: string): Design | null {
    return this.designs.get(id) || null;
  }

  /**
   * Update design
   */
  updateDesign(id: string, updates: Partial<Design>): Design | null {
    const design = this.designs.get(id);
    if (!design) return null;

    Object.assign(design, updates, { updatedAt: new Date() });
    return design;
  }

  /**
   * Add component to design
   */
  addComponent(designId: string, component: Omit<Component, 'id'>): Design | null {
    const design = this.designs.get(designId);
    if (!design) return null;

    const newComponent: Component = {
      ...component,
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    design.components.push(newComponent);
    design.updatedAt = new Date();

    return design;
  }

  /**
   * Update component
   */
  updateComponent(designId: string, componentId: string, updates: Partial<Component>): Design | null {
    const design = this.designs.get(designId);
    if (!design) return null;

    const component = design.components.find(c => c.id === componentId);
    if (!component) return null;

    Object.assign(component, updates);
    design.updatedAt = new Date();

    return design;
  }

  /**
   * Remove component
   */
  removeComponent(designId: string, componentId: string): Design | null {
    const design = this.designs.get(designId);
    if (!design) return null;

    design.components = design.components.filter(c => c.id !== componentId);
    
    // Remove connections to this component
    design.components.forEach(c => {
      c.connections = c.connections.filter(conn => conn !== componentId);
    });

    design.updatedAt = new Date();
    return design;
  }

  /**
   * Add connection between components
   */
  addConnection(designId: string, fromId: string, toId: string): Design | null {
    const design = this.designs.get(designId);
    if (!design) return null;

    const fromComponent = design.components.find(c => c.id === fromId);
    if (!fromComponent) return null;

    if (!fromComponent.connections.includes(toId)) {
      fromComponent.connections.push(toId);
    }

    design.updatedAt = new Date();
    return design;
  }

  /**
   * Remove connection
   */
  removeConnection(designId: string, fromId: string, toId: string): Design | null {
    const design = this.designs.get(designId);
    if (!design) return null;

    const fromComponent = design.components.find(c => c.id === fromId);
    if (!fromComponent) return null;

    fromComponent.connections = fromComponent.connections.filter(conn => conn !== toId);
    design.updatedAt = new Date();

    return design;
  }

  /**
   * Generate Move code from design
   */
  generateMoveCode(designId: string, options: GenerateCodeOptions = {}): string {
    const design = this.designs.get(designId);
    if (!design) throw new Error('Design not found');

    const moduleName = options.moduleName || design.name.toLowerCase().replace(/\s+/g, '_');
    const includeComments = options.includeComments !== false;
    const includeTests = options.includeTests || false;

    let code = '';

    // Module declaration
    if (includeComments) {
      code += `/// ${design.description || design.name}\n`;
      code += `/// Auto-generated from System Designer\n`;
    }
    code += `module ${moduleName}::${moduleName} {\n`;
    code += `    use sui::object::{Self, UID};\n`;
    code += `    use sui::tx_context::TxContext;\n`;
    code += `    use sui::transfer;\n\n`;

    // Generate structs for objects and resources
    const objects = design.components.filter(c => c.type === 'object');
    const resources = design.components.filter(c => c.type === 'resource');

    objects.forEach(obj => {
      if (includeComments) {
        code += `    /// ${obj.name} object\n`;
      }
      code += `    public struct ${obj.name} has key {\n`;
      code += `        id: UID,\n`;
      
      // Add connected resources as fields
      obj.connections.forEach(connId => {
        const connected = design.components.find(c => c.id === connId);
        if (connected && connected.type === 'resource') {
          code += `        ${connected.name.toLowerCase()}: ${connected.name},\n`;
        }
      });
      
      code += `    }\n\n`;
    });

    resources.forEach(res => {
      if (includeComments) {
        code += `    /// ${res.name} resource\n`;
      }
      code += `    public struct ${res.name} has store {\n`;
      code += `        value: u64,\n`;
      code += `    }\n\n`;
    });

    // Generate functions
    const functions = design.components.filter(c => c.type === 'function');
    
    if (functions.length === 0) {
      // Generate default constructor for objects
      objects.forEach(obj => {
        if (includeComments) {
          code += `    /// Create a new ${obj.name}\n`;
        }
        code += `    public fun create_${obj.name.toLowerCase()}(ctx: &mut TxContext): ${obj.name} {\n`;
        code += `        ${obj.name} {\n`;
        code += `            id: object::new(ctx),\n`;
        
        obj.connections.forEach(connId => {
          const connected = design.components.find(c => c.id === connId);
          if (connected && connected.type === 'resource') {
            code += `            ${connected.name.toLowerCase()}: ${connected.name} { value: 0 },\n`;
          }
        });
        
        code += `        }\n`;
        code += `    }\n\n`;
      });
    } else {
      functions.forEach(func => {
        if (includeComments) {
          code += `    /// ${func.name} function\n`;
        }
        code += `    public entry fun ${func.name.toLowerCase()}(ctx: &mut TxContext) {\n`;
        code += `        // TODO: Implement function logic\n`;
        code += `    }\n\n`;
      });
    }

    code += `}\n`;

    // Generate tests if requested
    if (includeTests) {
      code += `\n#[test_only]\n`;
      code += `module ${moduleName}::${moduleName}_tests {\n`;
      code += `    use ${moduleName}::${moduleName};\n`;
      code += `    use sui::test_scenario;\n\n`;
      code += `    #[test]\n`;
      code += `    fun test_basic() {\n`;
      code += `        let user = @0xA;\n`;
      code += `        let scenario = test_scenario::begin(user);\n`;
      code += `        // TODO: Add test logic\n`;
      code += `        test_scenario::end(scenario);\n`;
      code += `    }\n`;
      code += `}\n`;
    }

    return code;
  }

  /**
   * Generate Mermaid diagram
   */
  generateMermaidDiagram(designId: string): string {
    const design = this.designs.get(designId);
    if (!design) throw new Error('Design not found');

    let diagram = '```mermaid\ngraph TD\n';

    // Add nodes
    design.components.forEach(comp => {
      const shape = this.getMermaidShape(comp.type);
      diagram += `    ${comp.id}${shape[0]}${comp.name}${shape[1]}\n`;
    });

    // Add connections
    design.components.forEach(comp => {
      comp.connections.forEach(targetId => {
        diagram += `    ${comp.id} --> ${targetId}\n`;
      });
    });

    // Add styling
    diagram += `\n    classDef module fill:#4299e1,stroke:#2b6cb0,color:#fff\n`;
    diagram += `    classDef object fill:#48bb78,stroke:#2f855a,color:#fff\n`;
    diagram += `    classDef resource fill:#9f7aea,stroke:#6b46c1,color:#fff\n`;
    diagram += `    classDef function fill:#ed8936,stroke:#c05621,color:#fff\n\n`;

    design.components.forEach(comp => {
      diagram += `    class ${comp.id} ${comp.type}\n`;
    });

    diagram += '```';

    return diagram;
  }

  /**
   * Generate PlantUML diagram
   */
  generatePlantUMLDiagram(designId: string): string {
    const design = this.designs.get(designId);
    if (!design) throw new Error('Design not found');

    let diagram = '@startuml\n';
    diagram += `title ${design.name}\n\n`;

    // Add components
    const objects = design.components.filter(c => c.type === 'object');
    const resources = design.components.filter(c => c.type === 'resource');

    objects.forEach(obj => {
      diagram += `class ${obj.name} {\n`;
      diagram += `  +id: UID\n`;
      obj.connections.forEach(connId => {
        const connected = design.components.find(c => c.id === connId);
        if (connected && connected.type === 'resource') {
          diagram += `  +${connected.name.toLowerCase()}: ${connected.name}\n`;
        }
      });
      diagram += `}\n\n`;
    });

    resources.forEach(res => {
      diagram += `class ${res.name} <<resource>> {\n`;
      diagram += `  +value: u64\n`;
      diagram += `}\n\n`;
    });

    // Add relationships
    design.components.forEach(comp => {
      comp.connections.forEach(targetId => {
        const target = design.components.find(c => c.id === targetId);
        if (target) {
          diagram += `${comp.name} --> ${target.name}\n`;
        }
      });
    });

    diagram += '@enduml';

    return diagram;
  }

  /**
   * Validate design
   */
  validateDesign(designId: string): { valid: boolean; errors: string[] } {
    const design = this.designs.get(designId);
    if (!design) {
      return { valid: false, errors: ['Design not found'] };
    }

    const errors: string[] = [];

    // Check for duplicate names
    const names = design.components.map(c => c.name);
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate component names: ${duplicates.join(', ')}`);
    }

    // Check for invalid connections
    design.components.forEach(comp => {
      comp.connections.forEach(connId => {
        if (!design.components.find(c => c.id === connId)) {
          errors.push(`Invalid connection from ${comp.name} to unknown component`);
        }
      });
    });

    // Check for circular dependencies
    const hasCircular = this.detectCircularDependencies(design);
    if (hasCircular) {
      errors.push('Circular dependencies detected');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get Mermaid shape for component type
   */
  private getMermaidShape(type: string): [string, string] {
    switch (type) {
      case 'module':
        return ['[', ']'];
      case 'object':
        return ['(', ')'];
      case 'resource':
        return ['[[', ']]'];
      case 'capability':
        return ['{', '}'];
      case 'function':
        return ['>', ']'];
      default:
        return ['[', ']'];
    }
  }

  /**
   * Detect circular dependencies
   */
  private detectCircularDependencies(design: Design): boolean {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (compId: string): boolean => {
      visited.add(compId);
      recursionStack.add(compId);

      const component = design.components.find(c => c.id === compId);
      if (!component) return false;

      for (const connId of component.connections) {
        if (!visited.has(connId)) {
          if (hasCycle(connId)) return true;
        } else if (recursionStack.has(connId)) {
          return true;
        }
      }

      recursionStack.delete(compId);
      return false;
    };

    for (const comp of design.components) {
      if (!visited.has(comp.id)) {
        if (hasCycle(comp.id)) return true;
      }
    }

    return false;
  }

  /**
   * Export design as JSON
   */
  exportDesign(designId: string): string {
    const design = this.designs.get(designId);
    if (!design) throw new Error('Design not found');

    return JSON.stringify(design, null, 2);
  }

  /**
   * Import design from JSON
   */
  importDesign(json: string): Design {
    const data = JSON.parse(json);
    const design: Design = {
      ...data,
      id: `design-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.designs.set(design.id, design);
    return design;
  }

  /**
   * Clean up old designs
   */
  cleanupDesigns(maxAge: number = 86400000): void {
    const now = Date.now();
    for (const [id, design] of this.designs.entries()) {
      if (now - design.updatedAt.getTime() > maxAge) {
        this.designs.delete(id);
      }
    }
  }
}

export const systemDesigner = new SystemDesignerService();

// Cleanup old designs every 24 hours
setInterval(() => {
  systemDesigner.cleanupDesigns();
}, 86400000);
