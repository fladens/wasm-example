
import { generateRandomArray, randomInt } from './../data';

import {
    nothing as nativeNothing,
    fib as nativeFib,
    sum as nativeSum,
    bubble as nativeBubble,
} from './../tests/native';

import {
    nothing as wasmAsNothing,
    fib as wasmAsFib,
    sum as wasmAsSum,
    bubble as wasmAsBubble,
} from './../tests/wasm-as';

import {
    nothing as wasmAsBindNothing,
    fib as wasmAsBindFib,
    sum as wasmAsBindSum,
    bubble as wasmAsBindBubble,
} from './../tests/wasm-asbind';

import {
    nothing as wasmCNothing,
    fib as wasmCFib,
    sum as wasmCSum,
    bubble as wasmCBubble,
} from './../tests/wasm-c';

import {
    nothing as wasmRustNothing,
    fib as wasmRustFib,
    sum as wasmRustSum,
    bubble as wasmRustBubble,
} from './../tests/wasm-rust';

const functions = {
    native: {
        nothing: {
            fn: nativeNothing,
            data: () => null
        },
        fib: {
            fn: nativeFib,
            data: () => randomInt(40)
        },
        sum: {
            fn: nativeSum,
            data: () => generateRandomArray()
        },
        bubble: {
            fn: nativeBubble,
            data: () => generateRandomArray()
        }
    },
    as: {
        nothing: {
            fn: wasmAsNothing,
            data: () => null
        },
        fib: {
            fn: wasmAsFib,
            data: () => randomInt(40)
        },
        sum: {
            fn: wasmAsSum,
            data: () => generateRandomArray()
        },
        bubble: {
            fn: wasmAsBubble,
            data: () => generateRandomArray()
        }
    },
    asBind: {
        nothing: {
            fn: wasmAsBindNothing,
            data: () => null
        },
        fib: {
            fn: wasmAsBindFib,
            data: () => randomInt(40)
        },
        sum: {
            fn: wasmAsBindSum,
            data: () => generateRandomArray()
        },
        bubble: {
            fn: wasmAsBindBubble,
            data: () => generateRandomArray()
        }
    },
    rust: {
        nothing: {
            fn: wasmRustNothing,
            data: () => null
        },
        fib: {
            fn: wasmRustFib,
            data: () => randomInt(40)
        },
        sum: {
            fn: wasmRustSum,
            data: () => generateRandomArray()
        },
        bubble: {
            fn: wasmRustBubble,
            data: () => generateRandomArray()
        }
    },
    c: {
        nothing: {
            fn: wasmCNothing,
            data: () => null
        },
        fib: {
            fn: wasmCFib,
            data: () => randomInt(40)
        },
        sum: {
            fn: wasmCSum,
            data: () => generateRandomArray()
        },
        bubble: {
            fn: wasmCBubble,
            data: () => generateRandomArray()
        }
    }
};

export default functions;