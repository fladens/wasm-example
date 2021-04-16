- [WebAssembly example](#webassembly-example)
  * [What is this?](#what-is-this-)
  * [How I did it](#how-i-did-it)
    + [AssemblyScript](#assemblyscript)
      - [Writing AssemblyScript](#writing-assemblyscript)
      - [Exporting](#exporting)
      - [Importing](#importing)
      - ['as-bind' (Currently not working for me in Safari)](#-as-bind---currently-not-working-for-me-in-safari-)
    + [Rust](#rust)
      - [Writing Rust](#writing-rust)
      - [Exporting](#exporting-1)
      - [Importing](#importing-1)
      - [Addition](#addition)
    + [C](#c)
      - [Writing C](#writing-c)
      - [Exporting](#exporting-2)
      - [Importing](#importing-2)
  * [How to run](#how-to-run)
  * [Performance](#performance)
    + [Bubble browser comparison](#bubble-browser-comparison)
    + [Total](#total)
    + [Median](#median)
  * [Conclusion](#conclusion)
  * [Plug-n-Play Packages](#plug-n-play-packages)
  * [Resources](#resources)


# WebAssembly example

## What is this?

Like everybody I saw a lot of articles about WebAssembly, the future and what it will bring. I became pretty interested in the idea of running other programming languages than javascript in a browser and what this could mean for development and performance of websites in the future.
But as with every hyped new technology I first wanted to try where we at and what is already possible.

After reading some more there seems to be 3 languages that get the most traction:
* AssemblyScript ([with `as-bind` and without](https://www.assemblyscript.org/))
* C ([emscripten](https://emscripten.org/index.html))
* Rust ([wasm-pack](https://rustwasm.github.io/wasm-pack/installer/))

So I wanted to try all of them out with React and see what I can do, how easy __(spoiler alert: I thought it would be easier :joy:)__ it is to setup and make little benchmarks with simple functions.

## How I did it

I began creating a react app with [create-react-app](https://github.com/facebook/create-react-app) and just putting together a little UI with buttons and `console.log`s to make testing and benchmarking a little bit more easy for me. And I created a `src/tests` folder where I can put all the different function calls.

Then I added another subfolder `wasm` where I would put all my code that will be compiled into `.wasm` files and whatever else is needed. So I added `as`, `rust` and `c` there.
I also added a `wasm/compile-all.sh` which is also used for the `build:wasm` script in the `package.json`.


### AssemblyScript

On my long path to WebAssembly I started with AssemblyScript, as it seemed to be the most straight forward one and the documentation is pretty nice. Also as the rest of the codebase is javascript it makes sense to keep the language similar.

To compile AssemblyScript to WASM we first need to [install](https://www.assemblyscript.org/quick-start.html) assemblyscript and the loader:

```bash
yarn add -D assemblyscript
yarn add @assemblyscript/loader
```

Create a `wasm/as/lib.ts` file where you will put your WebAssembly code.

The build script builds the WASM file and adds it to the `public` folder. This is because WASM files we want to initiate need to be fetched from a server or package.
The compilation looks like this:

```bash
asc /wasm/as/lib.ts -b /public/as.wasm --runtime incremental --exportRuntime
```

see how it is used in javascript in `src/tests/wasm-as.js`

#### Writing AssemblyScript

AssemblyScript is very similar to typescript with some special [supported types](https://www.assemblyscript.org/types.html#type-rules).

#### Exporting

You just need to add `export function …` to the function like you would do in javascript/typescript.


#### Importing

To import from javascript we just need to declare the function in our script: `export declare …` this function then can be given to assembly script when initiating the WASM code. Called `importObject` in `/src/tests/wasm-as.js` and `/src/tests/as.js`.

You can do even more with import and export like namespaces and classes more on that in the [documentation](https://www.assemblyscript.org/exports-and-imports.html#imports)

Right now WebAssembly only supports directly passing `int32` and `float32` between javascript and WebAssembly. So all `string`, `array` and other complex data types need to be given via linear memory.

> Another feature of WebAssembly, is its linear memory. Linear memory is a continuous buffer of unsigned bytes that can be read from and stored into by both Wasm and JavaScript. In other words, Wasm memory is an expandable array of bytes that JavaScript and Wasm can synchronously read and modify. Linear memory can be used for many things, one of them being passing values back and forth between Wasm and JavaScript.
-> https://wasmbyexample.dev/examples/webassembly-linear-memory/webassembly-linear-memory.assemblyscript.en-us.html

To get this to work in AssemblyScript we can use the [loader](https://www.assemblyscript.org/loader.html) which adds some convenience functions when initiating the WASM file. Like `__newString(value)`, `__newArray(Int32Array_ID, values)` etc. 
In the background they all do pretty much the same. They allocate some space in the memory that is shared with WebAssembly, push the values there and then return a pointer that can be passed to the WebAssembly function.
When returning complex data types you will get a pointer back that can be used with `__getString(ptr)`, `__getArray(ptr)` etc. which will take the pointer and use it to get the array from shared memory.

This can become very tedious with big functions or many inputs. There is a convenience solution [as-bind](https://github.com/torch2424/as-bind)

#### 'as-bind' (Currently not working for me in Safari)

With it we don't need to worry about memory when passing data to AssemblyScript, because it does it for us. We only need to install `yarn add as-bind` and then compile the provided AssemblyScript with our own:

`asc /node_modules/as-bind/lib/assembly/as-bind.ts /wasm/as/lib.ts -b /public/as-bind.wasm --runtime incremental --exportRuntime`

we then need to use the initiate from the `as-bind` package in javascript:

`AsBind.instantiate(response, importObject)`

and we are good to go. We now can call AssemblyScript functions like normal javascript functions.

There is of course a trade-off for this convenience in terms of performance as it does all its data passing at runtime and needs to cycle through every supported type before it can pass it. Which will be mostly eliminated after the first call as it caches the used types. More about it [here](https://github.com/torch2424/as-bind#performance).

You can also see in `src/tests/wasm-asbind.js` that I am setting `returnType` for functions that should return data from the call. More on why I am doing this can be found [here](https://github.com/torch2424/as-bind#production).


### Rust

Next on my list of languages I wanted to try was Rust. As it seems to be the preferred way to start with WebAssembly. Or at least featured in the most blogs/tutorials I have read. 

What's nice with implementing this is that a lot is already done for you and it is straight forward to use. You just need to first install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

```bash
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

I then used `wasm-pack new wasm-rust` inside `wasm` which created all files needed by `wasm-pack`. The most important one is `wasm/rust/src/lib.rs` where we put all our Rust code we want to import to Javascript.

If you want to pass complex data types like arrays you'll have to add `js-sys = "0.3.50"` to the `Cargo.toml` dependencies.

To use it you then go inside the newly created folder `wasm-rust` (I renamed it to `rust`) and call `wasm-pack build` which will build your wasm file some glue code and a `package.json` inside `pkg`. 
Then you can go into that folder and either publish it or for this example just use `yarn link` to create a package link to it and then add it to your app `package.json` with `yarn link wasm-rust`.

From that moment you can always just run `wasm-pack build` when anything changed in your rust code.

Using it in javascript is easy with:

```js
import('wasm-rust').then(exports => {
    wasmModule.exports = exports;
});

const fib = function(num) {
    return wasmModule.exports.fib(num);
};
```

Where `exports` are the exported functions.

#### Writing Rust

To use Rust with WebAssembly there is [wasm-bindgen](https://rustwasm.github.io/wasm-bindgen/) which takes care of the memory and passing for us.
Mark functions as follows:

```rust
#[wasm_bindgen]
pub fn example(number: u32) -> u32 { 
    …
}
```

or with array use `js_sys` (needs to be added to dependencies)

```rust
#[wasm_bindgen]
pub fn sum(array: js_sys::Uint32Array) -> u32 {
    …
}
```

#### Exporting

All public functions in `lib.rs` are exported.

#### Importing

Importing javascript functions to rust is a bit more complex than in AssemblyScript, here is an example of what I am using to log to the console in my code:

```rust
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
```

but there is also a way to write your own functions that you can import like this:

```rust
#[wasm_bindgen(module = "/js/foo.js")]
extern "C" {
    fn doStuff(a: u32, b: u32) -> u32;
}
```

this will import all mentioned functions in `extern` exported in `wasm/rust/js/foo.js`. Some caveats and more info can be found [here](https://rustwasm.github.io/wasm-bindgen/reference/js-snippets.html)

#### Addition

Another interesting crate is [web-sys](https://rustwasm.github.io/wasm-bindgen/web-sys/index.html) if you want to use some WebAPIs directly.

### C

Last but not least emscripten with `C`. This one was the most difficult one to work with as the documentation isn't always to helpful what flags need to be set when compiling.

To compile `C` to WASM we need the above mentioned [emscripten](https://emscripten.org/index.html). Go into a folder where you want to install it and use:

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

I also added the `source /path/to/emsdk/emsdk_env.sh &> /dev/null` to my `~/.bash_profile` so I can use it in all my terminal windows.

When this is installed you can compile your c code to WASM with:

```bash
emcc --no-entry /wasm/c/lib.c -o /wasm/c/pkg/c.mjs \
    --pre-js /wasm/c/pre.js \
    --js-library /wasm/c/library.js \
    -s ENVIRONMENT='web' \
    -s SINGLE_FILE=1 \
    -s EXPORT_NAME='createModule' \
    -s USE_ES6_IMPORT_META=0 \
    -s EXPORTED_FUNCTIONS='["_nothing", "_logging", "_fib", "_sum", "_bubble", "_malloc", "_free"]'  \
    -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
    -O3
```

Let's go through the arguments here. You can also look at the [documentation](https://emscripten.org/docs/compiling/Building-Projects.html?highlight=emcc) if you want to know what else is available. But the specific arguments are pretty scattered through the documentation.

* `--no-entry` just defines that we don't have a `int main()` what the `C` compiler normally expects.
* `-o` the output file. `.mjs` creates a javascript module file
* `--pre-js` add options to the Module object like how prints are handled in my case I send them to `console.log`
* `--js-library` add a file with functions that are imported into the `C` code
* `ENVIRONMENT=web` just sets the environment we compiling for
* `SINGLE_FILE=1` activates that the wasm code is inlined inside the `.mjs` file
* `USE_ES6_IMPORT_META=0` don't use `import.meta.url` because it throws an error in my case
* `EXPORTED_FUNCTIONS='["_nothing", "_logging", "_fib", "_sum", "_bubble", "_malloc", "_free"]'` all the functions that we want to export from our `C` code, always marked with an underscore before the name. `_malloc` and `_free` are used for data passing, but more to that later.
* `EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'` we need `ccall` and `cwrap` so we can call our exported functions from javascript
* `-O3` code optimization read more [here](https://emscripten.org/docs/compiling/Building-Projects.html?highlight=emcc#building-projects-with-optimizations)

As you can see I compile my code into a `pkg` similar to Rust and added a `package.json` with the name `wasm-c`. So I need to go into that folder use `yarn link` and then use `yarn link wasm-c` in the root folder to use it in javascript. In this case it should also be possible to just compile the `c.mjs` into the `src/` folder to use in the app.

Now we can use our exported functions like this in javascript:

```js
import createModule from 'wasm-c';

let Module;

createModule()
  .then(ExportedModule => {
    Module = ExportedModule;
  });

const fib = function(num) {
  return Module.ccall(
    'fib',
    'number',
    ['number'],
    [num]
  );
};
```

#### Writing C

Just write your C code as you would normally

#### Exporting

All functions in the `lib.c` file can be exported and used in javascript you just need to add them to the `EXPORTED_FUNCTIONS` when compiling them.

#### Importing

There are some different ways to import javascript functions into C described in the [documentation](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#calling-javascript-from-c-c)

The easiest and most extensive one is the [`--js-library`](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#implement-a-c-api-in-javascript) option from above. 
We can add some functions there that then can be declared in C with `extern void test(void);` and used like normal functions. They can also have arguments.


## How to run

To run this example app you need to install:

* [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)
* [emscripten](https://emscripten.org/docs/getting_started/downloads.html)

When setting it up the first time we need to create links to our wasm packages to do this run these commands from the root folder:

```bash
yarn install
./wasm/compile-all.sh
cd wasm/c/pkg && yarn link
cd wasm/rust/pkg && yarn link
yarn link wasm-c wasm-rust
```

Then from that moment onwards you can just run: `yarn start` to build wasm and react and start the app.

## Performance

I have the `performance` folder which runs all functions a specified amount (default is 100) and puts out the `average`, `media`, `total` and all data-points.

### Bubble browser comparison
We can see how different the execution time for the different browsers is

![bubble](https://user-images.githubusercontent.com/36959878/115025461-af307f80-9ec1-11eb-8576-3e60733de285.png)


### Total


![total](https://user-images.githubusercontent.com/36959878/115025482-b48dca00-9ec1-11eb-8e25-15215f486815.png)


### Median

All 0's are just where the execution was so quick that `performance.now()` return was too small and was rounded to 0.


![median](https://user-images.githubusercontent.com/36959878/115025513-bce60500-9ec1-11eb-8d8a-4534842b75d7.png)


## Conclusion

Unfortunately the overhead, especially for passing data between WebAssembly and javascript is still pretty high, but it seems the browser vendors are doing a lot to improve that.
`C` seems to do the best job, but is also the most difficult to work with.
I still want to write some tests with bigger calculations where only a small amount of data is passed to WebAssembly, but a lot of calculation has to happen in WebAssembly. For example a lowest common ancestor algorithm could be interesting and could be used for the new LCA.

## Plug-n-Play Packages

I looked through npm if there are any interesting wasm packages that can be used directly without any hassle.
Here are some of them I found interesting:

* https://www.npmjs.com/package/@ffmpeg/ffmpeg
* https://www.npmjs.com/package/canvaskit-wasm
* https://www.npmjs.com/package/require-wat
* https://www.npmjs.com/package/node-sql-wasm
* https://www.npmjs.com/package/hash-wasm
* https://www.npmjs.com/package/re2-wasm
* https://www.npmjs.com/package/use-as-bind
* https://www.npmjs.com/package/markdown-wasm
* https://www.npmjs.com/package/spellchecker-wasm


There are also a lot of crypto packages that are ready to go.

## Resources

There is a lot out there about WebAssembly

* https://developer.mozilla.org/en-US/docs/WebAssembly/Concepts
* https://github.com/mbasso/awesome-wasm
* https://github.com/appcypher/awesome-wasm-langs
* https://codeburst.io/getting-started-with-react-and-webassembly-using-hooks-441818c91608
* https://medium.com/@torch2424/as-bind-announcement-9ea3daa4b4b9
* https://rustwasm.github.io/wasm-bindgen/
* https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm
* https://webassembly.github.io/spec/core/intro/overview.html
* https://www.assemblyscript.org/types.html#type-rules
* https://github.com/piotr-oles/as-loader
* https://github.com/WebAssembly/proposals
* https://www.reddit.com/r/WebAssembly/comments/hji7c6/assemblyscript_or_rust/

Another interesting thing I found was that `parcel.js` comes with an WASM loader out of the box, but I didn't try it yet: https://parceljs.org/rust.html
