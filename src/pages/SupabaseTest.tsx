import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface TestResult {
  id: number;
  name: string;
  status: 'pending' | 'success' | 'error';
  details: string;
}

export default function SupabaseTest() {
  const [tests, setTests] = useState<TestResult[]>([
    { id: 1, name: 'Environment Variables', status: 'pending', details: '' },
    { id: 2, name: 'Supabase Client Initialization', status: 'pending', details: '' },
    { id: 3, name: 'Database Connection', status: 'pending', details: '' },
    { id: 4, name: 'Posts Table', status: 'pending', details: '' },
    { id: 5, name: 'Profiles Table', status: 'pending', details: '' },
    { id: 6, name: 'Real-Time Capabilities', status: 'pending', details: '' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [summary, setSummary] = useState<{ passed: number; failed: number } | null>(null);

  const updateTest = (id: number, status: 'success' | 'error', details: string) => {
    setTests(prev => prev.map(test => 
      test.id === id ? { ...test, status, details } : test
    ));
  };

  const runTests = async () => {
    setIsRunning(true);
    setSummary(null);
    let passed = 0;
    let failed = 0;

    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' as const, details: '' })));

    // Test 1: Environment Variables
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!url || !key) {
        throw new Error('Missing environment variables');
      }

      updateTest(1, 'success', `URL: ${url}\nKey: ${key.substring(0, 30)}...`);
      passed++;
    } catch (error) {
      updateTest(1, 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}\nCheck your .env.local file`);
      failed++;
      setIsRunning(false);
      setSummary({ passed, failed });
      return;
    }

    // Test 2: Supabase Client
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      updateTest(2, 'success', 'Supabase client initialized successfully');
      passed++;
    } catch (error) {
      updateTest(2, 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      failed++;
    }

    // Test 3: Database Connection
    try {
      const { error } = await supabase.from('posts').select('count').limit(1);
      if (error) throw error;
      updateTest(3, 'success', 'Successfully connected to database');
      passed++;
    } catch (error) {
      updateTest(3, 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}\nCheck your Supabase project is active`);
      failed++;
    }

    // Test 4: Posts Table
    try {
      const { data, error } = await supabase.from('posts').select('*').limit(5);
      if (error) throw error;
      const columns = data && data.length > 0 ? Object.keys(data[0]).join(', ') : 'N/A';
      updateTest(4, 'success', `Posts table accessible\nFound ${data?.length || 0} posts\nColumns: ${columns}`);
      passed++;
    } catch (error) {
      updateTest(4, 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}\nPosts table may not exist`);
      failed++;
    }

    // Test 5: Profiles Table
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(5);
      if (error) throw error;
      updateTest(5, 'success', `Profiles table accessible\nFound ${data?.length || 0} profiles`);
      passed++;
    } catch (error) {
      updateTest(5, 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}\nProfiles table may not exist`);
      failed++;
    }

    // Test 6: Real-Time
    try {
      const channel = supabase.channel('test-channel');
      await new Promise<void>((resolve) => {
        channel.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            resolve();
          }
        });
        setTimeout(resolve, 2000);
      });
      await channel.unsubscribe();
      updateTest(6, 'success', 'Real-time subscriptions working');
      passed++;
    } catch (error) {
      updateTest(6, 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      failed++;
    }

    setIsRunning(false);
    setSummary({ passed, failed });
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">
            🔍 Supabase Connection Test
          </h1>
          <p className="text-gray-600">HX Workplace - Database Health Check</p>
        </div>

        <div className="space-y-4 mb-6">
          {tests.map((test) => (
            <div key={test.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{test.id}️⃣</span>
                  <span className="font-semibold text-gray-800">{test.name}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(test.status)}`}>
                  {getStatusIcon(test.status)} {test.status === 'success' ? 'Passed' : test.status === 'error' ? 'Failed' : 'Pending'}
                </span>
              </div>
              {test.details && (
                <pre className="mt-2 p-3 bg-white rounded border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {test.details}
                </pre>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={runTests}
          disabled={isRunning}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Running Tests...' : 'Run Connection Tests'}
        </button>

        {summary && (
          <div className={`mt-6 p-6 rounded-lg ${summary.failed === 0 ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
            <h3 className={`text-lg font-bold mb-2 ${summary.failed === 0 ? 'text-green-800' : 'text-red-800'}`}>
              {summary.failed === 0 ? '✨ All Tests Passed!' : '⚠️ Some Tests Failed'}
            </h3>
            <p className="text-gray-700 mb-2">
              Passed: {summary.passed} / {tests.length} | Failed: {summary.failed} / {tests.length}
            </p>
            {summary.failed === 0 ? (
              <p className="text-gray-700">
                Your Supabase connection is working perfectly. You're ready to develop! 🚀
              </p>
            ) : (
              <p className="text-gray-700">
                Check the error details above and verify your Supabase configuration.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
