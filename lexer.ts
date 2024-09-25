export enum TokenType {
    Number,
    Identifier,
    Equals,
    OpenParen, 
    CloseParen,
    BinaryOperator,
    Let,
}

export interface Token {
    value: string,
    type: TokenType,
}

function token (value = "", type: TokenType): Token { 
    return { value, type };
}

function isalpha (src: string) {
    return src.toUpperCase() != src.toLowerCase();
}

function isint (str: string) {
    const c = str.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)];

    return ( c >= bounds[0] && c <= bounds[1]);
}

export function tokenize (sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");

    while (src.length > 0) 
    {
        if (src[0] == '(')
        {
            tokens.push(token(src.shift(), TokenType.OpenParen));
        }
        else if (src[0] == ')')
        {
            tokens.push(token(src.shift(), TokenType.CloseParen));
        }
        else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/") 
        {
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        }
        else if(src[0] == "=")  {
            tokens.push(token(src.shift(), TokenType.Equals));
        }
        else {

        }
    }

    return tokens;
}