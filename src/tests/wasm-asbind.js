
import { AsBind } from "as-bind";


export const wasmModule = {};


// Fetch and initiate the WASM Modules with the as-bind package
const wasmBrowserAsBind = async (wasmModuleUrl, importObject) => {  
    if (!importObject) {
      importObject = {
        env: {
          abort: () => console.log("Abort!")
        },
        lib: {
          log: input => console.log(input),
        },
      };
    }

    return new Promise(function(resolve) {
      fetch(wasmModuleUrl)
        .then(response => AsBind.instantiate(response, importObject))
        .then(function({ exports }) {
          exports.sum.returnType = AsBind.RETURN_TYPES.NUMBER;
          exports.fib.returnType = AsBind.RETURN_TYPES.NUMBER;

          resolve(exports);
        });
    });
};

wasmBrowserAsBind("/as-bind.wasm")
  .then(exports => {
      wasmModule.exports = exports;
  });



// Some functions to test out WASM
export const nothing = function() {
    wasmModule.exports.nothing();
};

export const logging = function(message) {
    wasmModule.exports.logging(message);
};

export const sum = function(array) {
    return wasmModule.exports.sum(array);
};

export const fib = function(num) {
    return wasmModule.exports.fib(num);
};

export const bubble = function(array) {
    return wasmModule.exports.bubble(array);
};
