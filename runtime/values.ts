export type ValueType = "null" | "number" | "boolean";

export interface RuntimeValue {
    type: ValueType,
}

export interface NullValue extends RuntimeValue {
    type: "null",
    value: null,
}

export interface NumberValue extends RuntimeValue {
    type: "number",
    value: number,
}

export interface BooleanValue extends RuntimeValue {
    type: "boolean",
    value: boolean,
}

export function MAKE_NUMBER(num = 0) {
    return { type: "number", value: num } as NumberValue;
}

export function MAKE_NULL() {
    return { type: "null", value: null } as NullValue;
}

export function MAKE_BOOL(bool = true) {
    return { type: "boolean", value: bool } as BooleanValue;
}