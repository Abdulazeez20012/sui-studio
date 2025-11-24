// Sui Move Language Definition for Monaco Editor

export const registerMoveLanguage = (monaco: any) => {
  // Register the Move language
  monaco.languages.register({ id: 'move' });

  // Define Move language tokens
  monaco.languages.setMonarchTokensProvider('move', {
    defaultToken: '',
    tokenPostfix: '.move',

    keywords: [
      'module', 'script', 'use', 'as', 'public', 'fun', 'struct', 'has',
      'let', 'mut', 'const', 'if', 'else', 'while', 'loop', 'return',
      'break', 'continue', 'abort', 'assert', 'move', 'copy', 'native',
      'friend', 'entry', 'acquires', 'phantom', 'spec', 'invariant',
      'ensures', 'requires', 'aborts_if', 'pragma', 'include', 'apply'
    ],

    typeKeywords: [
      'bool', 'u8', 'u16', 'u32', 'u64', 'u128', 'u256', 'address',
      'signer', 'vector', 'Self', 'UID', 'ID', 'TxContext', 'String'
    ],

    operators: [
      '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
      '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
      '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
      '%=', '<<=', '>>=', '>>>='
    ],

    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    tokenizer: {
      root: [
        // Identifiers and keywords
        [/[a-z_$][\w$]*/, {
          cases: {
            '@typeKeywords': 'type.move',
            '@keywords': 'keyword.move',
            '@default': 'identifier.move'
          }
        }],
        [/[A-Z][\w\$]*/, 'type.identifier.move'],

        // Whitespace
        { include: '@whitespace' },

        // Delimiters and operators
        [/[{}()\[\]]/, '@brackets'],
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'operator.move',
            '@default': ''
          }
        }],

        // Numbers
        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float.move'],
        [/0[xX][0-9a-fA-F]+/, 'number.hex.move'],
        [/\d+/, 'number.move'],

        // Delimiter: after number because of .\d floats
        [/[;,.]/, 'delimiter.move'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid.move'],
        [/"/, { token: 'string.quote.move', bracket: '@open', next: '@string' }],

        // Characters
        [/'[^\\']'/, 'string.move'],
        [/(')(@escapes)(')/, ['string.move', 'string.escape.move', 'string.move']],
        [/'/, 'string.invalid.move']
      ],

      comment: [
        [/[^\/*]+/, 'comment.move'],
        [/\/\*/, 'comment.move', '@push'],
        ["\\*/", 'comment.move', '@pop'],
        [/[\/*]/, 'comment.move']
      ],

      string: [
        [/[^\\"]+/, 'string.move'],
        [/@escapes/, 'string.escape.move'],
        [/\\./, 'string.escape.invalid.move'],
        [/"/, { token: 'string.quote.move', bracket: '@close', next: '@pop' }]
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\*/, 'comment.move', '@comment'],
        [/\/\/.*$/, 'comment.move'],
      ],
    },
  });

  // Define Move language configuration
  monaco.languages.setLanguageConfiguration('move', {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/']
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"', notIn: ['string'] },
      { open: "'", close: "'", notIn: ['string', 'comment'] }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    folding: {
      markers: {
        start: new RegExp('^\\s*//\\s*#?region\\b'),
        end: new RegExp('^\\s*//\\s*#?endregion\\b')
      }
    }
  });

  // Register completion item provider (IntelliSense)
  monaco.languages.registerCompletionItemProvider('move', {
    provideCompletionItems: (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      const suggestions = [
        // Keywords
        ...['module', 'script', 'use', 'public', 'fun', 'struct', 'has', 'entry', 'native'].map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range: range,
          documentation: `Move keyword: ${keyword}`
        })),

        // Control flow
        ...['if', 'else', 'while', 'loop', 'return', 'break', 'continue', 'abort'].map(keyword => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range: range,
          documentation: `Control flow: ${keyword}`
        })),

        // Types
        ...['bool', 'u8', 'u64', 'u128', 'u256', 'address', 'signer', 'vector'].map(type => ({
          label: type,
          kind: monaco.languages.CompletionItemKind.TypeParameter,
          insertText: type,
          range: range,
          documentation: `Primitive type: ${type}`
        })),

        // Sui-specific types
        {
          label: 'UID',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'UID',
          range: range,
          documentation: 'Unique identifier for Sui objects'
        },
        {
          label: 'TxContext',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'TxContext',
          range: range,
          documentation: 'Transaction context containing sender and other tx info'
        },

        // Common Sui imports
        {
          label: 'use sui::object',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: 'use sui::object::{Self, UID};',
          range: range,
          documentation: 'Import Sui object module'
        },
        {
          label: 'use sui::transfer',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: 'use sui::transfer;',
          range: range,
          documentation: 'Import Sui transfer module'
        },
        {
          label: 'use sui::tx_context',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: 'use sui::tx_context::{Self, TxContext};',
          range: range,
          documentation: 'Import Sui transaction context'
        },

        // Snippets
        {
          label: 'module',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'module ${1:package_name}::${2:module_name} {',
            '\t$0',
            '}'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          documentation: 'Create a new module'
        },
        {
          label: 'struct',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'struct ${1:Name} has key {',
            '\tid: UID,',
            '\t$0',
            '}'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          documentation: 'Create a new struct with key ability'
        },
        {
          label: 'public fun',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'public fun ${1:function_name}($2) {',
            '\t$0',
            '}'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          documentation: 'Create a public function'
        },
        {
          label: 'public entry fun',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'public entry fun ${1:function_name}($2, ctx: &mut TxContext) {',
            '\t$0',
            '}'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          documentation: 'Create a public entry function'
        },
        {
          label: 'transfer::transfer',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'transfer::transfer(${1:object}, ${2:recipient});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          documentation: 'Transfer an object to a recipient'
        },
        {
          label: 'object::new',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'object::new(${1:ctx})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range,
          documentation: 'Create a new UID'
        },
      ];

      return { suggestions };
    }
  });

  // Register hover provider
  monaco.languages.registerHoverProvider('move', {
    provideHover: (model: any, position: any) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const hoverDocs: Record<string, string> = {
        'module': '**module** - Defines a Move module\n\nSyntax: `module address::name { ... }`',
        'struct': '**struct** - Defines a data structure\n\nAbilities: key, store, copy, drop',
        'fun': '**fun** - Defines a function\n\nCan be: public, entry, native',
        'public': '**public** - Makes a function or struct visible outside the module',
        'entry': '**entry** - Marks a function as a transaction entry point',
        'has': '**has** - Declares abilities for a struct\n\nAbilities: key, store, copy, drop',
        'UID': '**UID** - Unique identifier for Sui objects\n\nRequired for objects with `key` ability',
        'TxContext': '**TxContext** - Transaction context\n\nContains: sender, epoch, tx digest',
        'transfer': '**transfer** - Transfer ownership of an object',
        'abort': '**abort** - Abort execution with an error code',
        'assert': '**assert** - Assert a condition is true',
        'vector': '**vector<T>** - Dynamic array type',
        'address': '**address** - 32-byte address type',
        'signer': '**signer** - Represents transaction sender',
        'u8': '**u8** - 8-bit unsigned integer (0 to 255)',
        'u64': '**u64** - 64-bit unsigned integer',
        'u128': '**u128** - 128-bit unsigned integer',
        'u256': '**u256** - 256-bit unsigned integer',
        'bool': '**bool** - Boolean type (true or false)',
      };

      const doc = hoverDocs[word.word];
      if (doc) {
        return {
          range: new monaco.Range(
            position.lineNumber,
            word.startColumn,
            position.lineNumber,
            word.endColumn
          ),
          contents: [{ value: doc }]
        };
      }

      return null;
    }
  });

  // Register document symbol provider (for outline)
  monaco.languages.registerDocumentSymbolProvider('move', {
    provideDocumentSymbols: (model: any) => {
      const symbols: any[] = [];
      const text = model.getValue();
      const lines = text.split('\n');

      lines.forEach((line: string, index: number) => {
        // Match module declarations
        const moduleMatch = line.match(/module\s+(\w+::[\w]+)/);
        if (moduleMatch) {
          symbols.push({
            name: moduleMatch[1],
            kind: monaco.languages.SymbolKind.Module,
            range: new monaco.Range(index + 1, 1, index + 1, line.length),
            selectionRange: new monaco.Range(index + 1, 1, index + 1, line.length)
          });
        }

        // Match struct declarations
        const structMatch = line.match(/struct\s+(\w+)/);
        if (structMatch) {
          symbols.push({
            name: structMatch[1],
            kind: monaco.languages.SymbolKind.Struct,
            range: new monaco.Range(index + 1, 1, index + 1, line.length),
            selectionRange: new monaco.Range(index + 1, 1, index + 1, line.length)
          });
        }

        // Match function declarations
        const funMatch = line.match(/fun\s+(\w+)/);
        if (funMatch) {
          symbols.push({
            name: funMatch[1],
            kind: monaco.languages.SymbolKind.Function,
            range: new monaco.Range(index + 1, 1, index + 1, line.length),
            selectionRange: new monaco.Range(index + 1, 1, index + 1, line.length)
          });
        }
      });

      return symbols;
    }
  });
};
