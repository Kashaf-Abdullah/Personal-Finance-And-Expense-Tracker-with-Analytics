import { useState, useRef } from 'react';
import { getSummary, getCategoryAnalytics, getTrends, getBudgets } from '../api/analytics';
import { useAuth } from '../utils/useAuth';
import Sidebar from '../components/Sidebar';

export default function AskGemini() {
  const { token } = useAuth();
  const [question, setQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatRef = useRef(null);

  const handleAsk = async () => {
    setLoading(true);
    
    // 1. Fetch all analytics data
    const [summary, categories, trends, budgets] = await Promise.all([
      getSummary(token), 
      getCategoryAnalytics(token), 
      getTrends(token), 
      getBudgets(token)
    ]);
    
    // 2. Prepare prompt with user's financial data
    const prompt = `
      User question: ${question}
      Financial summary: ${JSON.stringify(summary.data)}
      Budgets: ${JSON.stringify(budgets.data)}
      Top categories: ${JSON.stringify(categories.data)}
      Trends: ${JSON.stringify(trends.data)}
      Give a helpful, personalized answer.
    `;
    
    // 3. Call Gemini API
 const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBA6jra0HVAybXWkhZM-j-iSo6QfKNcyWs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
  })
});

    const data = await res.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No answer';
    
    setAiAnswer(answer);
    
    // Add to chat history
    const newEntry = { question, answer, timestamp: new Date().toISOString() };
    setChatHistory([...chatHistory, newEntry]);
    
    setLoading(false);
    setQuestion('');
  };

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Download chat history as text file
  const downloadChatHistory = () => {
    const content = chatHistory.map(entry => 
      `Question: ${entry.question}\nAnswer: ${entry.answer}\nTime: ${new Date(entry.timestamp).toLocaleString()}\n\n`
    ).join('---\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finance-ai-chat-history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="d-flex">
          <Sidebar />
           <main className="container p-4">
     
      <h2>Ask Gemini (AI Financial Assistant)</h2>
    <div className="card p-3 mb-3">
      
      {/* Chat history */}
      <div className="chat-history mb-3" ref={chatRef} style={{maxHeight: '300px', overflowY: 'auto'}}>
        {chatHistory.map((entry, index) => (
          <div key={index} className="mb-3 p-2 border-bottom">
            <div className="d-flex justify-content-between">
              <strong>You:</strong>
              <button 
                className="btn btn-sm btn-outline-secondary" 
                onClick={() => copyToClipboard(entry.question)}
              >
                Copy
              </button>
            </div>
            <p>{entry.question}</p>
            
            <div className="d-flex justify-content-between">
              <strong>Gemini:</strong>
              <button 
                className="btn btn-sm btn-outline-secondary" 
                onClick={() => copyToClipboard(entry.answer)}
              >
                Copy
              </button>
            </div>
            <p>{entry.answer}</p>
            <small className="text-muted">{new Date(entry.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      
      {/* Question input */}
      <textarea
        className="form-control mb-2"
        rows={2}
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Ask about your spending, budgets, or get financial advice..."
      />
      
      <div className="d-flex justify-content-between">
        <button 
          className="btn btn-info" 
          onClick={handleAsk} 
          disabled={loading || !question}
        >
          {loading ? 'Thinking...' : 'Ask Gemini'}
        </button>
        
        {chatHistory.length > 0 && (
          <div>
            <button 
              className="btn btn-outline-primary me-2" 
              onClick={() => copyToClipboard(chatHistory.map(e => `Q: ${e.question}\nA: ${e.answer}`).join('\n\n'))}
            >
              Copy All
            </button>
            <button 
              className="btn btn-outline-success" 
              onClick={downloadChatHistory}
            >
              Download Chat
            </button>
          </div>
        )}
      </div>
      
      {/* Current answer */}
      {aiAnswer && !chatHistory.length && (
        <div className="alert alert-secondary mt-2">
          <div className="d-flex justify-content-between">
            <strong>Gemini:</strong>
            <button 
              className="btn btn-sm btn-outline-secondary" 
              onClick={() => copyToClipboard(aiAnswer)}
            >
              Copy
            </button>
          </div>
          <div>{aiAnswer}</div>
        </div>
      )}
    </div>
    </main>
    </div>
  );
}
