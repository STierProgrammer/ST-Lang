import Environment from "./environment.ts";

export type ValueType = "null" | "number" | "boolean" | "object" | "nativeFunction";

export interface RuntimeVal {
  type: ValueType;
}

export interface NullVal extends RuntimeVal {
  type: "null";
  value: null;
}

export function MAKE_NULL() {
  return { type: "null", value: null } as NullVal;
}

export interface BooleanVal extends RuntimeVal {
  type: "boolean";
  value: boolean;
}

export function MAKE_BOOL(b = true) {
  return { type: "boolean", value: b } as BooleanVal;
}

export interface NumberVal extends RuntimeVal {
  type: "number";
  value: number;
}

export function MAKE_NUMBER(n = 0) {
  return { type: "number", value: n } as NumberVal;
}

export interface ObjectVal extends RuntimeVal {
  type: "object";
  properties: Map<string, RuntimeVal>;
}

export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal; 

export interface NativeFunctionValue extends RuntimeVal {
  type: "nativeFunction";
  call: FunctionCall;
}

export function MAKE_NATIVE_FUNCTION(call: FunctionCall) {
  return { type: "nativeFunction", call } as NativeFunctionValue;
}