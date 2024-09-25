import { RuntimeValue } from "./values.ts";

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeValue>;

    constructor (parentEnvironment?: Environment) {
        this.parent = parentEnvironment;
        this.variables = new Map(); 
    }

    public declareVarbiale (varName: string, value: RuntimeValue): RuntimeValue {
        if(this.variables.has(varName)) {
            throw `Cannot declare variable ${varName}.`
        }

        this.variables.set(varName, value);

        return value;
    }

    public assignVariable (varName: string, value: RuntimeValue): RuntimeValue {
        const environment = this.resolve(varName);

        environment.variables.set(varName, value);

        return value;
    }

    public lookupVariable (varName: string): RuntimeValue {
        const environment = this.resolve(varName);

        return environment.variables.get(varName) as RuntimeValue;
    }

    public resolve (varName: string): Environment {
        if (this,this.variables.has(varName))
            return this;

        if (this.parent == undefined)
            throw `Cannot resolve ${varName} as it doesn't exist.`;

        return this.parent.resolve(varName);
    }
}