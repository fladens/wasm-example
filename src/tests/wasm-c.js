import createModule from 'wasm-c';

export const wasm = {};

createModule()
  .then((Module) => {
    wasm.Module = Module;
  });


// Some functions to test out WASM
export const nothing = function() {
  wasm.Module.ccall(
    'nothing',
    null,
    null,
    null
  );
};

export const logging = function(message) {
  wasm.Module.ccall(
    'logging',
    null,
    ['string'],
    [message]
  );
};

export const sum = function(array) {
  const inputArray = new Int32Array(array);
  const arrayBuffer = wasm.Module._malloc(inputArray.length * inputArray.BYTES_PER_ELEMENT);
  wasm.Module.HEAP32.set(inputArray, arrayBuffer >> 2);

  const result = wasm.Module.ccall(
    'sum',
    'number',
    ['number', 'number'],
    [arrayBuffer, inputArray.length]
  );

  wasm.Module._free(arrayBuffer);

  return result;
};

export const fib = function(num) {
  return wasm.Module.ccall(
    'fib',
    'number',
    ['number'],
    [num]
  );
};

export const bubble = function(array) {
    const length = array.length;
    const arrayBuffer = wasm.Module._malloc(length * array.BYTES_PER_ELEMENT);
    wasm.Module.HEAP32.set(array, arrayBuffer >> 2);

    wasm.Module.ccall(
      'bubble',
      'number',
      ['number', 'number'],
      [arrayBuffer, length]
    );

    const resultArray = [];

    for (let i = 0; i < length; i++) {
      resultArray.push(wasm.Module.HEAP32[arrayBuffer / Int32Array.BYTES_PER_ELEMENT + i]);
    }

    return resultArray;
};
