import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const DiagnosticPage: React.FC = () => {
  const [checks, setChecks] = useState({
    supabaseConnected: false,
    supabaseConfigured: false,
    canQueryPosts: false,
    canQueryProfiles: false,
    error: null as string | null,
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const results = { ...checks };

    try {
      // Check 1: Supabase configured
      results.supabaseConfigured = !!supabase;
      
      // Check 2: Can connect to Supabase
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      results.supabaseConnected = !sessionError;

      // Check 3: Can query posts table
      try {
        const { data: posts, error: postsError } = await supabase
          .from('posts')
          .select('id')
          .limit(1);
        results.canQueryPosts = !postsError;
        if (postsError) {
          results.error = `Posts query error: ${postsError.message}`;
        }
      } catch (err) {
        results.canQueryPosts = false;
        results.error = `Posts query exception: ${err}`;
      }

      // Check 4: Can query profiles table
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
        results.canQueryProfiles = !profilesError;
        if (profilesError && !results.error) {
          results.error = `Profiles query error: ${profilesError.message}`;
        }
      } catch (err) {
        results.canQueryProfiles = false;
        if (!results.error) {
          results.error = `Profiles query exception: ${err}`;
        }
      }

    } catch (err: any) {
      results.error = `General error: ${err.message || err}`;
    }

    setChecks(results);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 System Diagnostics</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <DiagnosticItem 
            label="Supabase Configured" 
            status={checks.supabaseConfigured} 
          />
          <DiagnosticItem 
            label="Supabase Connected" 
            status={checks.supabaseConnected} 
          />
          <DiagnosticItem 
            label="Can Query Posts Table" 
            status={checks.canQueryPosts} 
          />
          <DiagnosticItem 
            label="Can Query Profiles Table" 
            status={checks.canQueryProfiles} 
          />

          {checks.error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
              <pre className="text-sm text-red-700 whitespace-pre-wrap">
                {checks.error}
              </pre>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <button
              onClick={runDiagnostics}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Re-run Diagnostics
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-primary-600 hover:underline">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

const DiagnosticItem: React.FC<{ label: string; status: boolean }> = ({ label, status }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-md">
      <span className="font-medium">{label}</span>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
        status 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {status ? '✓ Pass' : '✗ Fail'}
      </span>
    </div>
  );
};

export default DiagnosticPage;
