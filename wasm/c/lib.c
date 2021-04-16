// https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm
// https://github.com/bobbiec/react-wasm-demo

#include <stdio.h>
#include <stdbool.h>
#include <emscripten.h>


extern void test(void);


void nothing() {

}

void logging(char *msg) {
    printf("%s\n", msg);
}

int fib(int n) {
    int a = 0;
    int b = 1;

    for (int i = 1 ; i < n ; i++) {
        int tmp = a;
        a = b;
        b = a + tmp;
    }

    return b;
}

int sum(int array[], int length) {
    int sum = 0;

    for (int i = 0 ; i < length ; i++) {
        sum += array[i];
    }

    return sum;
}

void bubble(int array[], int length) {
    bool swapped = true;

    while (swapped) {
        swapped = false;

        for (int i = 1 ; i < length ; i++) {
            if (array[i - 1] > array[i]) {
                int tmp = array[i];
                array[i] = array[i - 1];
                array[i - 1] = tmp;
                swapped = true;
            }
        }
    }
}