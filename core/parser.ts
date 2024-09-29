import {
  AssignmentExpression,
  BinaryExpression,
  Expr,
  Identifier,
  NumericLiteral,
  ObjectLiteral,
  Program,
  Property,
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

  private parseStatement(): Statement {
    switch (this.at().type) {
      case TokenType.Const:
      case TokenType.Let:
        return this.parseVariabelDeclaration();
    
      default: {
        const expression = this.parseExpression();
        
        if (this.at().type === TokenType.Semicolon) 
          this.eat(); 
  
        return expression;
      }
    }
  }
  
  private parseVariabelDeclaration(): Statement {
    const isConstant = this.eat().type == TokenType.Const;
    const identifier = this.expect(TokenType.Identifier, "Expected identifier name following let | const keywords.").value;

    if (this.at().type == TokenType.Semicolon) {
      this.eat();
      
      if (isConstant) 
        throw "Must assigne value to constant expression. No value provided.";
      
      return { kind: "VarDeclaration", identifier, constant: false } as VarDeclaration;
    }

    this.expect(TokenType.Equals, "Expected equals token following identifier in var declaration.");

    const declaration = { kind: "VarDeclaration", value: this.parseExpression(), identifier, constant: isConstant } as VarDeclaration;

    this.expect(TokenType.Semicolon, "Variable declaration statment must end with semicolon.");

    return declaration;
  }

  private parseExpression(): Expr {
      return this.parseAssignmentExpression();
  }

  private parseObjectExpression(): Expr {
    if (this.at().type !== TokenType.OpenBrace) {
      return this.parseAddtiveExpression();
    }

    this.eat();

    const properties = new Array<Property>();

    while (this.not_EOF() && this.at().type !== TokenType.CloseBrace) {
      const key = this.expect(TokenType.Identifier, "Object literal key expected").value;

      if (this.at().type == TokenType.Comma) {
        this.eat();

        properties.push({ key, kind: "Property" } as Property);

        continue;
      } 
      
      else if (this.at().type == TokenType.CloseBrace) {
        properties.push({ key, kind: "Property" } as Property);

        continue;
      }

      this.expect(TokenType.Colon, "Missing colon following identifier in ObjectExpression");

      const value = this.parseExpression();

      properties.push({ kind: "Property", value, key })

      if (this.at().type != TokenType.CloseBrace) 
        this.expect(TokenType.Comma, "Expected comma or Closing Bracket following Property");
    } 

    this.expect(TokenType.CloseBrace, "Object literal missing closing brace.");

    return { kind: "ObjectLiteral", properties } as ObjectLiteral;
  }

  private parseAssignmentExpression(): Expr {
      const left = this.parseObjectExpression();

      if (this.at().type == TokenType.Equals) {
        this.eat();

        const value = this.parseAssignmentExpression();

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
}
