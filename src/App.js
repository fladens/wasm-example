import logo from './web-assembly.png';
import './App.css';

import {
  nothing as nativeNothing,
  logging as nativeLogging,
  fib as nativeFib,
  sum as nativeSum,
  bubble as nativeBubble,
} from './tests/native';

import {
  nothing as wasmAsNothing,
  logging as wasmAsLogging,
  fib as wasmAsFib,
  sum as wasmAsSum,
  bubble as wasmAsBubble,
} from './tests/wasm-as';

import {
  nothing as wasmAsBindNothing,
  logging as wasmAsBindLogging,
  fib as wasmAsBindFib,
  sum as wasmAsBindSum,
  bubble as wasmAsBindBubble,
} from './tests/wasm-asbind';

import {
  nothing as wasmCNothing,
  logging as wasmCLogging,
  fib as wasmCFib,
  sum as wasmCSum,
  bubble as wasmCBubble,
} from './tests/wasm-c';

import {
  nothing as wasmRustNothing,
  logging as wasmRustLogging,
  fib as wasmRustFib,
  sum as wasmRustSum,
  bubble as wasmRustBubble,
} from './tests/wasm-rust';

import { generateRandomArray } from './data';
import performanceTest from './performance';


const timeFn = function(name, fn, ...data) {
  console.time(name);
  const result = fn(...data);
  console.timeEnd(name);
  console.log(`Result for ${name}: ${result}`);
  return result;
};


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <button onClick={() => performanceTest()}>Measure that performance</button>
        
        <div className="row">
          <div>
            <h2>Javascript Native</h2>
            <button onClick={() => timeFn('native nothing', nativeNothing)}>No Operation</button>
            <button onClick={() => timeFn('native logging', nativeLogging, 'Javascript')}>Log to console</button>
            <button onClick={() => timeFn('native fib', nativeFib, 45)}>Fibonacci</button>
            <button onClick={() => timeFn('native sum', nativeSum, generateRandomArray())}>Sum</button>
            <button onClick={() => timeFn('native bubble', nativeBubble, generateRandomArray())}>Bubble</button>
          </div>

          <div className="spacer"></div>

          <div>
            <h2>WebAssembly AssemblyScript</h2>
            <button onClick={() => timeFn('AssemblyScript nothing', wasmAsNothing)}>No Operation</button>
            <button onClick={() => timeFn('AssemblyScript logging', wasmAsLogging, 'AssemblyScript')}>Log to console</button>
            <button onClick={() => timeFn('AssemblyScript fib', wasmAsFib, 45)}>Fibonacci</button>
            <button onClick={() => timeFn('AssemblyScript sum', wasmAsSum, generateRandomArray())}>Sum</button>
            <button onClick={() => timeFn('AssemblyScript bubble', wasmAsBubble, generateRandomArray())}>Bubble</button>
          </div>

          <div className="spacer"></div>

          <div>
            <h2>WebAssembly AssemblyScript Bind</h2>
            <button onClick={() => timeFn('AssemblyScript Bind nothing', wasmAsBindNothing)}>No Operation</button>
            <button onClick={() => timeFn('AssemblyScript Bind logging', wasmAsBindLogging, 'AssemblyScript Bind')}>Log to console</button>
            <button onClick={() => timeFn('AssemblyScript Bind fib', wasmAsBindFib, 45)}>Fibonacci</button>
            <button onClick={() => timeFn('AssemblyScript Bind sum', wasmAsBindSum, generateRandomArray())}>Sum</button>
            <button onClick={() => timeFn('AssemblyScript Bind bubble', wasmAsBindBubble, generateRandomArray())}>Bubble</button>
          </div>

          <div className="spacer"></div>

          <div>
            <h2>WebAssembly Rust</h2>
            <button onClick={() => timeFn('Rust nothing', wasmRustNothing)}>No Operation</button>
            <button onClick={() => timeFn('Rust logging', wasmRustLogging, 'Rust')}>Log to console</button>
            <button onClick={() => timeFn('Rust fib', wasmRustFib, 45)}>Fibonacci</button>
            <button onClick={() => timeFn('Rust sum', wasmRustSum, generateRandomArray())}>Sum</button>
            <button onClick={() => timeFn('Rust bubble', wasmRustBubble, generateRandomArray())}>Bubble</button>
          </div>

          <div className="spacer"></div>

          <div>
            <h2>WebAssembly C</h2>
            <button onClick={() => timeFn('C nothing', wasmCNothing)}>No Operation</button>
            <button onClick={() => timeFn('C logging', wasmCLogging, 'C')}>Log to console</button>
            <button onClick={() => timeFn('C fib', wasmCFib, 45)}>Fibonacci</button>
            <button onClick={() => timeFn('C sum', wasmCSum, generateRandomArray())}>Sum</button>
            <button onClick={() => timeFn('C bubble', wasmCBubble, generateRandomArray())}>Bubble</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
