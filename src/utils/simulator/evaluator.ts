// src/utils/simulator/evaluator.ts
// Safe expression evaluator without eval()

export interface EvaluationContext {
  variables: Record<string, unknown>;
}

type TokenType =
  | "NUMBER"
  | "STRING"
  | "VARIABLE"
  | "OPERATOR"
  | "LPAREN"
  | "RPAREN"
  | "LOGICAL_AND"
  | "LOGICAL_OR"
  | "COMPARISON"
  | "EOF";

interface Token {
  type: TokenType;
  value: string;
}

class Tokenizer {
  private input: string;
  private pos: number;

  constructor(input: string) {
    this.input = input;
    this.pos = 0;
  }

  private peek(): string | null {
    return this.pos < this.input.length ? this.input[this.pos] : null;
  }

  private advance(): string | null {
    return this.pos < this.input.length ? this.input[this.pos++] : null;
  }

  private skipWhitespace() {
    while (this.peek() && /\s/.test(this.peek()!)) {
      this.advance();
    }
  }

  nextToken(): Token | null {
    this.skipWhitespace();
    const ch = this.peek();
    if (!ch) return null;

    // Numbers
    if (/\d/.test(ch)) {
      let num = "";
      while (this.peek() && /[\d.]/.test(this.peek()!)) {
        num += this.advance();
      }
      return { type: "NUMBER", value: num };
    }

    // Strings (single/double quotes)
    if (/["']/.test(ch)) {
      const quote = this.advance()!;
      let str = "";
      while (this.peek() && this.peek() !== quote) {
        str += this.advance();
      }
      this.advance(); // consume closing quote
      return { type: "STRING", value: str };
    }

    // Variables (alphanumeric + underscore)
    if (/[a-zA-Z_$]/.test(ch)) {
      let ident = "";
      while (this.peek() && /[a-zA-Z0-9_$]/.test(this.peek()!)) {
        ident += this.advance();
      }

      // Check for logical keywords
      if (ident === "and") return { type: "LOGICAL_AND", value: "and" };
      if (ident === "or") return { type: "LOGICAL_OR", value: "or" };

      return { type: "VARIABLE", value: ident };
    }

    // Three-char operators
    const threeChar = this.input.slice(this.pos, this.pos + 3);
    if (["===", "!=="].includes(threeChar)) {
      this.advance();
      this.advance();
      this.advance();
      return { type: "COMPARISON", value: threeChar };
    }

    // Two-char operators
    const twoChar = this.input.slice(this.pos, this.pos + 2);
    if (["==", "!=", "<=", ">=", "&&", "||"].includes(twoChar)) {
      this.advance();
      this.advance();
      if (["==", "!=", "<=", ">="].includes(twoChar)) {
        return { type: "COMPARISON", value: twoChar };
      }
      return {
        type: twoChar === "&&" ? "LOGICAL_AND" : "LOGICAL_OR",
        value: twoChar,
      };
    }

    // Single-char operators
    if (["<", ">", "=", "!"].includes(ch)) {
      this.advance();
      const next = this.peek();
      if (next === "=") {
        this.advance();
        return { type: "COMPARISON", value: ch + "=" };
      }
      return { type: "COMPARISON", value: ch };
    }

    // Parentheses
    if (ch === "(") {
      this.advance();
      return { type: "LPAREN", value: "(" };
    }
    if (ch === ")") {
      this.advance();
      return { type: "RPAREN", value: ")" };
    }

    // Unknown
    this.advance();
    return null;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    let token;
    while ((token = this.nextToken())) {
      tokens.push(token);
    }
    tokens.push({ type: "EOF", value: "" });
    return tokens;
  }
}

class Parser {
  private tokens: Token[];
  private pos: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  private peek(): Token {
    return this.tokens[this.pos] || { type: "EOF", value: "" };
  }

  private advance(): Token {
    return this.tokens[this.pos++] || { type: "EOF", value: "" };
  }

  parse(): ASTNode {
    return this.parseLogicalOr();
  }

  private parseLogicalOr(): ASTNode {
    let left = this.parseLogicalAnd();
    while (
      ["LOGICAL_OR", "||"].includes(this.peek().type) ||
      this.peek().value === "or"
    ) {
      this.advance();
      const right = this.parseLogicalAnd();
      left = { type: "BINARY_OP", op: "||", left, right };
    }
    return left;
  }

  private parseLogicalAnd(): ASTNode {
    let left = this.parseComparison();
    while (
      ["LOGICAL_AND", "&&"].includes(this.peek().type) ||
      this.peek().value === "and"
    ) {
      this.advance();
      const right = this.parseComparison();
      left = { type: "BINARY_OP", op: "&&", left, right };
    }
    return left;
  }

  private parseComparison(): ASTNode {
    let left = this.parsePrimary();
    while (this.peek().type === "COMPARISON") {
      const op = this.advance().value;
      const right = this.parsePrimary();
      left = { type: "BINARY_OP", op, left, right };
    }
    return left;
  }

  private parsePrimary(): ASTNode {
    const token = this.peek();

    if (token.type === "NUMBER") {
      this.advance();
      return { type: "LITERAL", value: parseFloat(token.value) };
    }

    if (token.type === "STRING") {
      this.advance();
      return { type: "LITERAL", value: token.value };
    }

    if (token.type === "VARIABLE") {
      this.advance();
      return { type: "VARIABLE", name: token.value };
    }

    if (token.type === "LPAREN") {
      this.advance();
      const expr = this.parseLogicalOr();
      if (this.peek().type === "RPAREN") {
        this.advance();
      }
      return expr;
    }

    return { type: "LITERAL", value: null };
  }
}

export type ASTNode =
  | {
      type: "LITERAL";
      value: unknown;
    }
  | {
      type: "VARIABLE";
      name: string;
    }
  | {
      type: "BINARY_OP";
      op: string;
      left: ASTNode;
      right: ASTNode;
    };

class Evaluator {
  evaluate(node: ASTNode, ctx: EvaluationContext): unknown {
    if (node.type === "LITERAL") {
      return node.value;
    }

    if (node.type === "VARIABLE") {
      return ctx.variables[node.name] ?? null;
    }

    if (node.type === "BINARY_OP") {
      const left = this.evaluate(node.left, ctx);
      const right = this.evaluate(node.right, ctx);

      switch (node.op) {
        case ">":
          return Number(left) > Number(right);
        case "<":
          return Number(left) < Number(right);
        case ">=":
          return Number(left) >= Number(right);
        case "<=":
          return Number(left) <= Number(right);
        case "===":
          return left === right;
        case "!==":
        case "!=":
          return left !== right;
        case "==":
          return left == right;
        case "&&":
          return Boolean(left) && Boolean(right);
        case "||":
          return Boolean(left) || Boolean(right);
        default:
          return null;
      }
    }

    return null;
  }
}

export function evaluateExpression(
  expression: string,
  ctx: EvaluationContext
): unknown {
  try {
    const tokenizer = new Tokenizer(expression);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const evaluator = new Evaluator();
    return evaluator.evaluate(ast, ctx);
  } catch {
    return null;
  }
}
