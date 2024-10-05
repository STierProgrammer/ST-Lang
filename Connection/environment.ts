import { MAKE_BOOL, MAKE_NATIVE_FUNCTION, MAKE_NULL, MAKE_NUMBER, RuntimeVal } from "./values.ts";

export function createGlobalEnv () {
  const env = new Environment();

  env.declareVar("true", MAKE_BOOL(true), true);
  env.declareVar("false", MAKE_BOOL(false), true);
  env.declareVar("null", MAKE_NULL(), true);

  env.declareVar("print", MAKE_NATIVE_FUNCTION((args, scope) => {
    console.log(...args);
    
    return MAKE_NULL();
  }), true)

  function timeFunction(args: RuntimeVal[], env: Environment) {
    return MAKE_NUMBER(Date.now());
  }

  env.declareVar("time", MAKE_NATIVE_FUNCTION(timeFunction), true);

  return env;
}
export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor(parentENV?: Environment) {
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();
  }

  public declareVar(varname: string, value: RuntimeVal, constant: boolean): RuntimeVal {
    if (this.variables.has(varname)) 
      throw `Cannot declare variable ${varname}. As it already is defined.`;

    this.variables.set(varname, value);
    
    if (constant) 
      this.constants.add(varname);
    
    return value;
  }

  public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varname);

    if (env.constants.has(varname)) 
      throw `Cannot reasign to variable ${varname} as it was declared constant.`;

    env.variables.set(varname, value);

    return value;
  }

  public lookupVar(varname: string): RuntimeVal {
    const env = this.resolve(varname);
    
    return env.variables.get(varname) as RuntimeVal;
  }

  public resolve(varname: string): Environment {
    if (this.variables.has(varname)) 
      return this;

    if (this.parent == undefined) 
      throw `Cannot resolve '${varname}' as it does not exist.`;
    
    return this.parent.resolve(varname);
  }
}
