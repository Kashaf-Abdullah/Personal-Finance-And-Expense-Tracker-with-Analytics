import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';

export default function CalculatorPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
const [minimized, setMinimized] = useState(false);

  const handleClick = (value) => setInput(input + value);
  const handleClear = () => { setInput(''); setResult(''); };
  const handleEquals = () => {
    try {
      // eslint-disable-next-line no-eval
      setResult(eval(input).toString());
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
