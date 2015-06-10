import I = require("./interfaces");
var _interfaces: InterfaceList = I.interfaces;

export function deepFreeze (o: Object) {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach(function (prop: string) {
    if (o.hasOwnProperty(prop) && o[prop] !== null && (typeof o[prop] === "object" || typeof o[prop] === "function") && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });
  
  return o;
};

export interface InterfaceProperty {
  propertyType: string,
  indexType: string,
  parameters: string[],
  type: string, //TODO switch to enums
  optional: boolean
}

export interface InterfaceDefinition {
  [index: string]: InterfaceProperty
}

export interface InterfaceList {
  [index: string]: InterfaceDefinition
}

var arr;
//Entry point. Initializes our list to resolve circular dependencies
export function reflect (o: Object, interfaceName: string) {
  if (interfaceName === "boolean" || interfaceName === "number" || interfaceName === "string") {
    return (interfaceName === typeof o);
  }
  arr = [];
  reflectHelper(o, interfaceName);
};

//Helps with circular dependencies, storing references in a list.
function reflectHelper(o: Object, interfaceName: string) {
  if (arr.indexOf(o) !== -1) {
    return;
  }
  arr.push(o);

  reflectHelper2(o, interfaceName);
}

//Enumerates thru all properties and throws an error if we don't check out
function reflectHelper2(o: Object, interfaceName: string) {
  var def = _interfaces[interfaceName];
  var propList: string[] = Object.getOwnPropertyNames(def);
  if (propList.indexOf("_extends") !== -1) {
    propList.splice(propList.indexOf("_extends"), 1);
  }

  propList.forEach(function(property_name: string): void {
    if (!checkProperty(o, def, property_name)) {
      throw new Error("Interface error: Object does not implement " + interfaceName + ", does not have correct property type for property " + property_name);
    }
  });

  var extendList: string[] = (<any>def)["_extends"];
  if(!extendList) {
    return;
  }
  extendList.forEach(function(i: string): void {
    reflectHelper2(o, i);
  });
}

//Checks each property for type. Recurses to reflectHelper
function checkProperty(o: Object, def: InterfaceDefinition, property_name: string): boolean {
  var prop = def[property_name];
  if (prop.optional) { //Optional, no need to check for it.
    return true;
  }
  switch (prop.propertyType) {
    case "property":
      var toRet = o.hasOwnProperty(property_name);

      if (prop.type === "boolean" || prop.type === "number" || prop.type === "string") {
        return toRet && (prop.type === typeof o[property_name]);
      }

      reflectHelper(o[property_name], prop.type);
      return toRet;
    case "function": //All we check on functions is arity
      return (typeof o[property_name] === "function") && (o[property_name].length === prop.parameters.length);
    case "index":
      var keys = Object.keys(o);
      keys.forEach(function(key) {
        if (prop.indexType === "number") {
          if (!isNaN(+key)) {
            reflectHelper(o[key], prop.type);
          }
        } else { //index type must be string
          reflectHelper(o[key], prop.type);
        }
      });
      return true;
  }
}