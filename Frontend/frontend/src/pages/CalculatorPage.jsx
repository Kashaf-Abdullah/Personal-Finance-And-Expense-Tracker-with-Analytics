import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';

const evaluateExpression = (expression) => {
  const tokens = expression.match(/(?:\d+\.?\d*|\.\d+)|[+\-*/]/g);
  if (!tokens || tokens.join('') !== expression) throw new Error('Invalid expression');

  const values = [];
  const operators = [];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, 'u+': 3, 'u-': 3 };
  let expectsValue = true;

  const applyOperator = () => {
    const operator = operators.pop();
    if (operator === 'u+' || operator === 'u-') {
      if (!values.length) throw new Error('Invalid expression');
      values.push(operator === 'u-' ? -values.pop() : values.pop());
      return;
    }

    if (values.length < 2) throw new Error('Invalid expression');
    const right = values.pop();
    const left = values.pop();
    const result = operator === '+' ? left + right
      : operator === '-' ? left - right
        : operator === '*' ? left * right
          : left / right;
    if (!Number.isFinite(result)) throw new Error('Invalid result');
    values.push(result);
  };

  tokens.forEach(token => {
    if (/^(?:\d+\.?\d*|\.\d+)$/.test(token)) {
      if (!expectsValue) throw new Error('Invalid expression');
      values.push(Number(token));
      expectsValue = false;
      return;
    }

    let operator = token;
    if (expectsValue) {
      if (token !== '+' && token !== '-') throw new Error('Invalid expression');
      operator = `u${token}`;
    }

    while (
      operators.length &&
      precedence[operators[operators.length - 1]] > precedence[operator]
    ) {
      applyOperator();
    }
    operators.push(operator);
    expectsValue = true;
  });

  if (expectsValue) throw new Error('Invalid expression');
  while (operators.length) applyOperator();
  if (values.length !== 1 || !Number.isFinite(values[0])) throw new Error('Invalid result');
  return values[0];
};

export default function CalculatorPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [minimized, setMinimized] = useState(false);

  const handleClick = (value) => setInput(input + value);
  const handleClear = () => { setInput(''); setResult(''); };
  const handleEquals = () => {
    try {
      setResult(evaluateExpression(input).toString());
    } catch {
      setResult('Error');
    }
  };

  return (
    <div className="d-flex">
     <Sidebar minimized={minimized} setMinimized={setMinimized}  />
           {/* <main className="container-fluid "> */}
              <main
             className="container-fluid"
             style={{
               marginLeft: minimized ? 0 : 18, // Match your sidebar width
               transition: 'margin-left 0.3s'
             }}
           >
           <Navbar minimized={minimized}/>
           
        <div className="" style={{padding:"14px"}}>
        <h2>Calculator</h2>
        <div className="card p-3" style={{ maxWidth: 320,margin:'auto' }}>
          <input
            className="form-control mb-2"
            type="text"
            value={input}
            readOnly
            placeholder="0"
          />
          <div className="mb-2">{result && <strong>= {result}</strong>}</div>
          <div className="btn-group mb-2" style={{ width: '100%' }}>
            {[7, 8, 9, '/'].map(v => (
              <button className="btn btn-secondary" key={v} onClick={() => handleClick(v.toString())}>{v}</button>
            ))}
          </div>
          <div className="btn-group mb-2" style={{ width: '100%' }}>
            {[4, 5, 6, '*'].map(v => (
              <button className="btn btn-secondary" key={v} onClick={() => handleClick(v.toString())}>{v}</button>
            ))}
          </div>
          <div className="btn-group mb-2" style={{ width: '100%' }}>
            {[1, 2, 3, '-'].map(v => (
              <button className="btn btn-secondary" key={v} onClick={() => handleClick(v.toString())}>{v}</button>
            ))}
          </div>
          <div className="btn-group mb-2" style={{ width: '100%' }}>
            {[0, '.', '+'].map(v => (
              <button className="btn btn-secondary" key={v} onClick={() => handleClick(v.toString())}>{v}</button>
            ))}
            <button className="btn btn-danger" onClick={handleClear}>C</button>
            <button className="btn btn-success" onClick={handleEquals}>=</button>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
