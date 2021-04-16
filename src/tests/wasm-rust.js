
export const wasmModule = {};


// Initiate the WASM Modules
import('wasm-rust').then(exports => {
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
