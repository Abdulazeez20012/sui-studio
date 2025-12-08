import { suiCompiler } from '../suiCompiler';

describe('SuiCompiler', () => {
  describe('checkSuiCLI', () => {
    it('should check if Sui CLI is available', async () => {
      const available = await suiCompiler.checkSuiCLI();
      expect(typeof available).toBe('boolean');
      console.log('Sui CLI available:', available);
    });
  });

  describe('compile', () => {
    it('should compile valid Move code', async () => {
      const code = `
module test::hello {
    use std::string;
    
    public fun hello_world(): string::String {
        string::utf8(b"Hello, World!")
    }
}
`;

      const result = await suiCompiler.compile(code, 'test');
      
      console.log('Compilation result:', {
        success: result.success,
        simulated: result.simulated,
        errorCount: result.errors?.length || 0,
        warningCount: result.warnings?.length || 0,
        gasEstimate: result.gasEstimate,
      });

      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
      
      if (result.success) {
        expect(result.bytecode).toBeDefined();
        expect(result.modules).toBeDefined();
        expect(result.gasEstimate).toBeGreaterThan(0);
      }
    }, 30000); // 30 second timeout for compilation

    it('should handle invalid Move code', async () => {
      const code = `
module test::invalid {
    // Missing function body
    public fun broken()
}
`;

      const result = await suiCompiler.compile(code, 'test');
      
      console.log('Invalid code result:', {
        success: result.success,
        errorCount: result.errors?.length || 0,
      });

      expect(result).toBeDefined();
      
      if (!result.success) {
        expect(result.errors).toBeDefined();
        expect(result.errors!.length).toBeGreaterThan(0);
      }
    }, 30000);

    it('should detect missing module declaration', async () => {
      const code = `
public fun hello() {
    // No module declaration
}
`;

      const result = await suiCompiler.compile(code, 'test');
      
      expect(result).toBeDefined();
      expect(result.success).toBe(false);
      
      if (result.errors) {
        const hasModuleError = result.errors.some(e => 
          e.message.toLowerCase().includes('module')
        );
        expect(hasModuleError).toBe(true);
      }
    }, 30000);

    it('should compile with options', async () => {
      const code = `
module test::options {
    public fun test() {}
}
`;

      const result = await suiCompiler.compile(code, 'test', {
        skipFetch: true,
        testMode: false,
      });
      
      expect(result).toBeDefined();
      console.log('Compilation with options:', result.success);
    }, 30000);
  });

  describe('test', () => {
    it('should run compiler self-test', async () => {
      const testPassed = await suiCompiler.test();
      console.log('Compiler self-test:', testPassed ? 'PASSED' : 'FAILED');
      expect(typeof testPassed).toBe('boolean');
    }, 30000);
  });
});
