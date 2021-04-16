
import loader from "@assemblyscript/loader";


export const wasmModule = {};


// Fetch and initiate the WASM Modules with the loader
const wasmBrowserInstantiate = async (wasmModuleUrl, importObject) => {  
    if (!importObject) {
      importObject = {
        env: {
          abort: () => console.log("Abort!")
        },
        lib: {
          log(msgPtr) {
              const { __getString } = wasmModule.exports;

              console.log(__getString(msgPtr));
          },
        },
      };
    }
    
    return new Promise(function(resolve) {
      loader
        .instantiateStreaming(
          fetch(wasmModuleUrl),
          importObject
        )
        .then(({ exports }) => {
          resolve(exports);
        });
    });
  };

wasmBrowserInstantiate("/as.wasm")
    .then(exports => {
        wasmModule.exports = exports;
    });


// Some functions to test out WASM
export const nothing = function() {
    wasmModule.exports.nothing();
};

export const logging = function(message) {
    const { logging, __newString } = wasmModule.exports;

    const msgPtr = __newString(message);
    logging(msgPtr);
};

export const sum = function(array) {
    const { sum, Int32Array_ID, __newArray } = wasmModule.exports;

    const arrPtr = __newArray(Int32Array_ID, array);
    return sum(arrPtr);
};

export const fib = function(num) {
    return wasmModule.exports.fib(num);
};

export const bubble = function(array) {
    const { bubble, Int32Array_ID, __newArray, __getArray } = wasmModule.exports;

    const arrPtr = __newArray(Int32Array_ID, array);
    const resultArrPtr = bubble(arrPtr);
    const result = __getArray(resultArrPtr);
    return result;
};
