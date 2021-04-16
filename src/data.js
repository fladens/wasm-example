const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

export const generateRandomArray = function() {
    const array = [];

    for (let i = 0 ; i < 5000 ; i++) {
        array.push(Math.floor(Math.random() * 100));
    }

    return array;
};
  
export const randomInt = max => Math.floor(Math.random() * max);

export const bubbleArray = generateRandomArray();

export const numberArray = range(0, 3000, 1);