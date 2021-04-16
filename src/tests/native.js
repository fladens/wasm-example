
export const nothing = function() {
    
};

export const logging = function(message) {
    console.log(message);
};

const fibonacci = function(n) {
    var a = 0, b = 1;

    if (n > 0) {
        while (--n) {
            const t = a + b;
            a = b;
            b = t;
        }

        return b;
    }

    return a;
};

export const sum = function(array) {
    return array.reduce((a, b) => a + b, 0);
};

export const fib = function(num) {
    return fibonacci(num);
};

export const bubble = function(array) {
    let len = array.length;
    let result = array;

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            if (result[j] > result[j + 1]) {
                let tmp = result[j];
                result[j] = result[j + 1];
                result[j + 1] = tmp;
            }
        }
    }

    return result;
};
