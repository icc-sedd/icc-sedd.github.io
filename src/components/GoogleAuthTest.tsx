import React, { useState, useEffect } from 'react';

interface AuthTestResult {
  step: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

const GoogleAuthTest: React.FC = () => {
  const [tests, setTests] = useState<AuthTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTest = (step: string, status: 'pending' | 'success' | 'error', message: string) => {
    setTests(prev => {
      const newTests = [...prev];
      const existingIndex = newTests.findIndex(t => t.step === step);
      if (existingIndex >= 0) {
        newTests[existingIndex] = { step, status, message };
      } else {
        newTests.push({ step, status, message });
      }
      return newTests;
    });
  };

  const runTests = async () => {
    setIsRunning(true);
    setTests([]);

    // Test 1: Check environment variables
    addTest('Environment Check', 'pending', 'Checking environment variables...');
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const sheetId = process.env.REACT_APP_GOOGLE_SHEET_ID;

    console.log('Environment variables:');
    console.log('REACT_APP_GOOGLE_CLIENT_ID:', clientId);
    console.log('REACT_APP_GOOGLE_API_KEY:', apiKey);
    console.log('REACT_APP_GOOGLE_SHEET_ID:', sheetId);

    if (!clientId || clientId === 'your_client_id_here') {
      addTest('Environment Check', 'error', 
        `Google Client ID is missing or invalid\n` +
        `Current value: "${clientId || 'undefined'}"\n` +
        `Expected format: xxxxxxx-xxxxxxx.apps.googleusercontent.com`
      );
      setIsRunning(false);
      return;
    }

    if (!sheetId || sheetId === 'your_google_sheet_id_here') {
      addTest('Environment Check', 'error', 
        `Google Sheet ID is missing or invalid\n` +
        `Current value: "${sheetId || 'undefined'}"\n` +
        `Expected format: long alphanumeric string`
      );
      setIsRunning(false);
      return;
    }

    const hasValidApiKey = apiKey && apiKey !== 'your_google_api_key_here';
    addTest('Environment Check', 'success', 
      `✓ Client ID: ${clientId.substring(0, 20)}...\n` +
      `✓ API Key: ${hasValidApiKey ? 'Present and valid' : 'Not configured (will require auth)'}\n` +
      `✓ Sheet ID: ${sheetId}\n` +
      `✓ All environment variables are properly configured!`
    );

    // Test 2: Load Google API script
    addTest('Google API Script', 'pending', 'Loading Google API script...');
    try {
      await loadGoogleAPI();
      addTest('Google API Script', 'success', 'Google API script loaded successfully');
    } catch (error: any) {
      addTest('Google API Script', 'error', `Failed to load Google API: ${error.message}`);
      setIsRunning(false);
      return;
    }

    // Test 3: Initialize GAPI client
    addTest('GAPI Initialization', 'pending', 'Initializing Google API client...');
    try {
      await initializeGAPI(clientId, apiKey);
      addTest('GAPI Initialization', 'success', 'Google API client initialized successfully');
    } catch (error: any) {
      addTest('GAPI Initialization', 'error', `GAPI initialization failed: ${error.message}`);
      setIsRunning(false);
      return;
    }

    // Test 4: Check authentication status
    addTest('Auth Status', 'pending', 'Checking authentication status...');
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      const isSignedIn = authInstance.isSignedIn.get();
      addTest('Auth Status', 'success', 
        `Authentication status: ${isSignedIn ? 'Signed in' : 'Not signed in'}\n` +
        `Current user: ${isSignedIn ? authInstance.currentUser.get().getBasicProfile().getEmail() : 'None'}`
      );
    } catch (error: any) {
      addTest('Auth Status', 'error', `Auth status check failed: ${error.message}`);
    }

    // Test 5: Test sheet access
    addTest('Sheet Access', 'pending', 'Testing Google Sheet access...');
    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Guests!A1:D1',
      });
      
      if (response.result.values && response.result.values.length > 0) {
        addTest('Sheet Access', 'success', 
          `Sheet accessed successfully!\n` +
          `Headers: ${response.result.values[0].join(', ')}`
        );
      } else {
        addTest('Sheet Access', 'success', 'Sheet accessed but appears to be empty');
      }
    } catch (error: any) {
      if (error.status === 403 || error.status === 401) {
        addTest('Sheet Access', 'error', 
          `Authentication required (${error.status})\n` +
          `Try signing in with Google to access this sheet`
        );
      } else {
        addTest('Sheet Access', 'error', `Sheet access failed: ${error.message || error.status}`);
      }
    }

    setIsRunning(false);
  };

  const loadGoogleAPI = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        const checkGapi = () => {
          if (window.gapi) {
            resolve();
          } else if (Date.now() - startTime > 10000) {
            reject(new Error('Google API failed to load within 10 seconds'));
          } else {
            setTimeout(checkGapi, 100);
          }
        };
        const startTime = Date.now();
        checkGapi();
      };
      
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  };

  const initializeGAPI = (clientId: string, apiKey?: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      window.gapi.load('client:auth2', async () => {
        try {
          const initConfig: any = {
            clientId: clientId,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            scope: 'https://www.googleapis.com/auth/spreadsheets.readonly'
          };

          if (apiKey && apiKey !== 'your_google_api_key_here') {
            initConfig.apiKey = apiKey;
          }

          await window.gapi.client.init(initConfig);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  };

  const signIn = async () => {
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      // Re-run the sheet access test after signing in
      const sheetId = process.env.REACT_APP_GOOGLE_SHEET_ID!;
      
      addTest('Sheet Access After Auth', 'pending', 'Testing sheet access after authentication...');
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'Guests!A1:D10',
      });
      
      if (response.result.values && response.result.values.length > 0) {
        addTest('Sheet Access After Auth', 'success', 
          `Sheet accessed successfully after authentication!\n` +
          `Found ${response.result.values.length} rows of data\n` +
          `Headers: ${response.result.values[0].join(', ')}`
        );
      } else {
        addTest('Sheet Access After Auth', 'success', 'Sheet accessed but appears to be empty');
      }
    } catch (error: any) {
      addTest('Sheet Access After Auth', 'error', `Auth failed: ${error.message}`);
    }
  };

  return (
    <div className="auth-test-container">
      <h3>🔧 Google Sheets Authentication Test</h3>
      
      <div className="test-controls">
        <button 
          onClick={runTests} 
          disabled={isRunning}
          className="test-button"
        >
          {isRunning ? 'Running Tests...' : 'Run Authentication Test'}
        </button>
        
        {tests.some(t => t.status === 'error' && t.message.includes('Authentication required')) && (
          <button 
            onClick={signIn}
            className="auth-button"
            style={{ marginLeft: '1rem' }}
          >
            Sign in with Google
          </button>
        )}
      </div>

      <div className="test-results">
        {tests.map((test, index) => (
          <div key={index} className={`test-result test-${test.status}`}>
            <div className="test-header">
              <span className="test-icon">
                {test.status === 'pending' && '⏳'}
                {test.status === 'success' && '✅'}
                {test.status === 'error' && '❌'}
              </span>
              <strong>{test.step}</strong>
            </div>
            <div className="test-message">
              {test.message.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleAuthTest;
