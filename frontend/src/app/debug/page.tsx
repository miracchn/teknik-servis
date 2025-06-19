'use client';

import { useState } from 'react';
import { debugSupabase } from '@/lib/debug';

export default function DebugPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [result, setResult] = useState<any>(null);

  const checkAuth = async () => {
    const result = await debugSupabase.checkAuthStatus();
    console.log('Auth check result:', result);
    setResult(result);
  };

  const checkTables = async () => {
    const result = await debugSupabase.checkTables();
    console.log('Tables check result:', result);
    setResult(result);
  };

  const testRegistration = async () => {
    if (!email || !password || !name) {
      setResult({
        success: false,
        error: 'Please fill in all fields'
      });
      return;
    }

    const result = await debugSupabase.testRegistration(email, password, name);
    console.log('Registration test result:', result);
    setResult(result);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Debug Page</h1>
      
      <div className="space-y-4">
        <div className="flex space-x-2">
          <button
            onClick={checkAuth}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Check Auth Status
          </button>
          
          <button
            onClick={checkTables}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Check Tables
          </button>
        </div>

        <div className="space-y-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={testRegistration}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Test Registration
          </button>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 