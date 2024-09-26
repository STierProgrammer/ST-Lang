import {
  AssignmentExpression,
  BinaryExpression,
  Expr,
  Identifier,
  NumericLiteral,
  Program,
  Statement,
  VarDeclaration,
} from "./ast.ts"

import { Token, tokenize, TokenType } from "./lexer.ts";

export default class Parser {
  private tokens: Token[] = [];

  private not_EOF(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  private at() {
    return this.tokens[0] as Token;
  }

  private eat() {
    const previous = this.tokens.shift() as Token;

    return previous;
  }

  // deno-lint-ignore no-explicit-any
  private expect(type: TokenType, err: any) {
    const previous = this.tokens.shift() as Token;

    if (!previous || previous.type != type) {
      console.error("Parser Error:\n", err, previous, " - Expecting: ", type);
      Deno.exit(1);
    }

    return previous;
  }

  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    
    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (this.not_EOF()) {
      program.body.push(this.parseStatement());
    }

    return program; 
  }

  private parseStatement(): Statement {
    switch (this.at().type) {
      case TokenType.Let:
     
      case TokenType.Const:
        return this.parseVariabelDeclaration();

      default:
        return this.parseExpression();
    }
  }

  parseVariabelDeclaration(): Statement {
    const isConstant = this.eat().type == TokenType.Const;
    const identifier = this.expect(TokenType.Identifier, "Expected identifier name following let | const keywords.").value;

    if (this.at().type == TokenType.Semicolon) {
      this.eat();
      
      if (isConstant) {
        throw "Must assigne value to constant expression. No value provided.";
      }

      return { kind: "VarDeclaration", identifier, constant: false } as VarDeclaration;
    }

    this.expect(TokenType.Equals, "Expected equals token following identifier in var declaration.");

    const declaration = { kind: "VarDeclaration", value: this.parseExpression(), identifier, constant: isConstant } as VarDeclaration;

    this.expect(TokenType.Semicolon, "Variable declaration statment must end with semicolon.");

    return declaration;
  }


  private parseExpression(): Expr {
      return this.parseAssignmentExpressionession();
  }

  parseAssignmentExpressionession(): Expr {
      const left = this.parseAddtiveExpression();

      if (this.at().type == TokenType.Equals) {
        this.eat();

        const value = this.parseAssignmentExpressionession();

        return { value, assigne: left, kind: "AssignmentExpression" } as AssignmentExpression;
      }

      return left;
  }

  private parseAddtiveExpression(): Expr {
    let left = this.parseMultiplicativeExpression();

    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.eat().value;
      const right = this.parseMultiplicativeExpression();
      
      left = { kind: "BinaryExpression", left, right, operator } as BinaryExpression;
    }

    return left;
  }

  private parseMultiplicativeExpression(): Expr {
    let left = this.parsePrimaryExpression();

    while (this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
      const operator = this.eat().value;
      const right = this.parsePrimaryExpression();
      
      left = { kind: "BinaryExpression", left, right, operator } as BinaryExpression;
    }

    return left;
  }

  private parsePrimaryExpression(): Expr {
    const token = this.at().type;

    switch (token) {

      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;

      case TokenType.Number:
        return { kind: "NumericLiteral", value: parseFloat(this.eat().value) } as NumericLiteral;

      case TokenType.OpenParen: {
        this.eat(); 
        
        const value = this.parseExpression();

        this.expect(TokenType.CloseParen, "Unexpected token found inside parenthesised expression. Expected closing parenthesis."); 

        return value;
      }

      default:
        console.error("Unexpected token found during parsing!", this.at());
        Deno.exit(1);
    }
  }
}
