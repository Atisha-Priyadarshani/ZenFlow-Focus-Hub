'use client';
import { useChat } from '@ai-sdk/react';
import React from 'react';

export default function TestPage() {
  const { sendMessage, messages, error } = useChat({});
  const [log, setLog] = React.useState<string[]>([]);

  return (
    <div className="p-10">
      <button
        onClick={() => {
          try {
            setLog(l => [...l, 'Calling append...']);
            const res = sendMessage({ role: 'user', parts: [{ type: 'text', text: 'test' }] });
            setLog(l => [...l, 'Append returned: ' + typeof res]);
            if (res instanceof Promise) {
              res.catch(e => setLog(l => [...l, 'Append promise rejected: ' + String(e)]));
            }
          } catch (e) {
            setLog(l => [...l, 'Append threw sync error: ' + String(e)]);
          }
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Append
      </button>

      <div className="mt-5 bg-gray-100 p-5 rounded">
        <h3>Logs:</h3>
        {log.map((l, i) => <div key={i}>{l}</div>)}
        <h3>Error:</h3>
        <div>{error ? String(error) : 'null'}</div>
        <h3>Messages:</h3>
        <div>{messages.length}</div>
      </div>
    </div>
  );
}
