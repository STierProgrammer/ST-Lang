// deno-lint-ignore-file
import 
{ 
    Statement, 
    Program, 
    Expression, 
    NumericLiteral, 
    Identifier, 
    BinaryExpression,
} from "./ast.ts";

import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
    private tokens: Token[] = [];

    private not_eof (): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at() {
        return this.tokens[0] as Token;
    }

    private eat() {
        const previous = this.tokens.shift() as Token;

        return previous;
    }

    private expect(type: TokenType, err: any) {
        const previous = this.tokens.shift() as Token;

        if(!previous || previous.type == type) {
            console.error("Parer Error:\n", err, previous, "Expecting: ", type );

            Deno.exit(1);
        }

        return previous;
    }

    public produceAST (sourceCode: string): Program {
        this.tokens = tokenize(sourceCode);
        
        const program: Program = {
            kind: "Program",
            body: [],
        }

        while (this.not_eof()) {
            program.body.push(this.parseStatement());
        }

        return program;
    }

    private parseStatement(): Statement {
        return this.parseExpression();
    }

    private parseExpression(): Expression {
        return this.parseAdditiveExpression();
    }

    private parseAdditiveExpression(): Expression {
        let left = this.parseMultiplicativeExpression();
        
        while(this.at().value == "+" || this.at().value == "-") {
            const operator = this.eat().value;
            const right = this.parseMultiplicativeExpression();
            
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression;
        }

        return left;
    }

    private parseMultiplicativeExpression(): Expression {
        let left = this.parsePrimaryExpression();
        
        while(this.at().value == "/" || this.at().value == "*" || this.at().value == "%") {
            const operator = this.eat().value;
            const right = this.parsePrimaryExpression();
            
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator
            } as BinaryExpression;
        }

        return left;
    }

    private parsePrimaryExpression(): Expression {
        const token = this.at().type;

        switch (token) {
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.eat().value } as Identifier;
        
            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.eat().value ) } as NumericLiteral;

            case TokenType.OpenParen: {
                this.eat();

                const value = this.parseExpression();

                this.expect(TokenType.CloseParen, "Unexpected token found inside parenthesised expression");

                return value;
            }

            case TokenType.CloseParen:

            default:
                console.error("Unexpected token found during parsing!", this.at());
                Deno.exit(1);
        }

    }

}