export type NodeType =
  | "Program"
  | "VarDeclaration"
  | "AssignmentExpression"
  | "Property"
  | "ObjectLiteral"
  | "NumericLiteral"
  | "Identifier"
  | "BinaryExpression"
  | "MemberExpression"
  | "CallExpression"

export interface Statement {
  kind: NodeType;
};

export interface Program extends Statement {
  kind: "Program";
  body: Statement[];
};

export interface VarDeclaration extends Statement {
  kind: "VarDeclaration";
  constant: boolean;
  identifier: string;
  value?: Expr;
};

export interface Expr extends Statement {}

export interface AssignmentExpression extends Expr {
    kind: "AssignmentExpression";
    assigne: Expr;
    value: Expr;
};

export interface BinaryExpression extends Expr {
  kind: "BinaryExpression";
  left: Expr;
  right: Expr;
  operator: string; 
};

export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
};

export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
};

export interface Property extends Expr {
  kind: "Property";
  key: string;
  value?: Expr;
};

export interface ObjectLiteral extends Expr {
  kind: "ObjectLiteral";
  properties: Property[];
};

export interface CallExpression extends Expr {
  kind: "CallExpression";
  args: Expr[];
  caller: Expr;
};

export interface MemberExpression extends Expr {
  kind: "MemberExpression";
  object: Expr;
  property: Expr;
  computed: boolean;
};