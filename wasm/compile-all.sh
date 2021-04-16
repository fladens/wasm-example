#!/usr/bin/env bash

# echo "compile C files"

# for filename in ./c/*.c; do
#     folder=${filename%.c}
#     mkdir $folder
#     emcc $filename -s WASM=1 -o $folder/index.js &> null
# done


DIR=`dirname $0`


echo "build assembly-script"

npx asc $DIR/as/lib.ts -o $DIR/../public/as.wasm --runtime incremental --exportRuntime -O3s


echo "build assembly-script with as-bind"

npx asc $DIR/../node_modules/as-bind/lib/assembly/as-bind.ts $DIR/as/lib.ts -o $DIR/../public/as-bind.wasm --runtime incremental --exportRuntime -O3s


echo "build c"

# https://github.com/bobbiec/react-wasm-demo#motivation
npx emcc --no-entry $DIR/c/lib.c -o $DIR/c/pkg/c.mjs \
    --pre-js $DIR/c/pre.js \
    --js-library $DIR/c/library.js \
    -s ENVIRONMENT='web' \
    -s SINGLE_FILE=1 \
    -s USE_ES6_IMPORT_META=0 \
    -s EXPORTED_FUNCTIONS='["_nothing", "_logging", "_fib", "_sum", "_bubble", "_malloc", "_free"]'  \
    -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
    -O3


echo "build rust"

cd $DIR/rust && wasm-pack build
