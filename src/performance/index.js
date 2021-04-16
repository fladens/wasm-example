
import functions from './data';

const sum = function(array) {
    return array.reduce((sum, val) => (sum += val));
}

const median = function(array) {
    const length = array.length;
    const arrSort = array.sort();
    const mid = Math.ceil(length / 2);

    return length % 2 === 0 ? (arrSort[mid] + arrSort[mid - 1]) / 2 : arrSort[mid - 1];
}

const average = function(array) {
    const length = array.length;
    
    return sum(array) / length;
}

const timeFn = function(fn, ...data) {
    const t1 = window.performance.now();
    fn(...data);
    const t2 = window.performance.now();
    return t2 - t1;
}

const measureFn = function(amount, fn, ...data) {
    const times = [];

    for (let i = 0 ; i < amount ; i++) {
        const time = timeFn(fn, ...data);
        times.push(time);
    }

    return {
        data: times,
        total: sum(times),
        avg: average(times),
        median: median(times),
    }; 
}

const performance = function(amount = 100) {
    const results = {};

    for (const prefix in functions) {
        results[prefix] = {};

        for (const key in functions[prefix]) {
            const result = measureFn(amount, functions[prefix][key].fn, functions[prefix][key].data());
            results[prefix][key] = result;
        }
    }

    console.log(results);
}

export default performance;