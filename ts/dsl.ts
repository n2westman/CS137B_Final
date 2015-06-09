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

export function reflect (o: Object, interfaceName: string) {
  var def = _interfaces[interfaceName];
  Object.getOwnPropertyNames(def).forEach(function(property_name: string): void {
    var prop = def[property_name];
    if (prop.optional) { //Optional, no need to check for it.
      return;
    }
    if(!checkProperty(o, def, property_name)) {
      throw new Error("Object does not have correct property type for property " + property_name);
    }
  });
};

export function checkProperty(o: Object, def: InterfaceDefinition, property_name: string): boolean {
  var prop = def[property_name];
  switch (prop.propertyType) {
    case "property":
      return o.hasOwnProperty(property_name);
    case "function":
      return (typeof o[property_name] === "function") && (o[property_name].length === prop.parameters.length);
    case "index":
      var keys = Object.keys(o);
      keys.forEach(function(key) {
        if (prop.indexType === "number") {
          if (!isNaN(key)) {
            reflect(o[key], prop.type);
          }
        } else { //index type must be string
          reflect(o[key], prop.type);
        }
      });
      return true;
  }
}