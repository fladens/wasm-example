// https://rustwasm.github.io/wasm-bindgen/

extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str); // For other console.log possibilities see: https://rustwasm.github.io/wasm-bindgen/examples/console-log.html
}

#[wasm_bindgen]
pub fn nothing() {

}

#[wasm_bindgen]
pub fn logging(message: &str) {
    log(message);
}

#[wasm_bindgen]
pub fn fib(number: u32) -> u32 { 
    let mut a = 0;
    let mut b = 1;

    for _ in 1..number {
        let tmp = a;
        a = b;
        b = a + tmp;
    }

    return b
}

#[wasm_bindgen]
pub fn sum(array: js_sys::Uint32Array) -> u32 {
    let result = array.to_vec();
    let mut sum = 0;

    for elem in result {
        sum += elem;
    }

    return sum;
}

#[wasm_bindgen]
pub fn bubble(array: js_sys::Uint32Array) -> js_sys::Uint32Array {
    let mut swapped = true;
    let mut result = array.to_vec();

    while swapped {
        // No swap means array is sorted.
        swapped = false;
        for i in 1..result.len() {
            if result[i - 1] > result[i] {
                result.swap(i - 1, i);
                swapped = true
            }
        }
    }

    return js_sys::Uint32Array::from(&result[..]);
} 
