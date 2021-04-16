// https://www.assemblyscript.org

export declare function log(input: string): void;
export const Int32Array_ID = idof<Int32Array>();

export function fib(n: i32): i32 {
    var a = 0, b = 1

    if (n > 0) {
        while (--n) {
            let t = a + b
            a = b
            b = t
        }

        return b
    }

    return a
}

export function nothing() : void {
    
}

export function logging(message: string) : void {
    log(message);
};

export function bigLoop() : void {
    for (let i = 0 ; i < 10000 ; i++) {
        const t = i + i;
    }
}

export function sum(array: Int32Array) : i32 {
    let sum = 0
    const len = array.length;
    
    for (let i = 0 ; i < len ; i++) {
        sum += array[i];
    }

    return sum;
}

export function bubble(array: Int32Array) : Int32Array {
    const len = array.length;
    let result = array;
    let swapped = true;

    while (swapped) {
        swapped = false;

        for (let i = 1 ; i < len ; i++) {
            if (result[i - 1] > result[i]) {
                let tmp = result[i];
                result[i] = result[i - 1];
                result[i - 1] = tmp;
                swapped = true;
            }
        }
    }

    return result;
}
