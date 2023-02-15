import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginFields from './LoginFields';
import WorkspaceList from './WorkspaceList';

function App() {
  const [loggedInAttempt, setLoggedInAttempt] = useState<number>(0)
  const [loggedInUser, setLoggedInUser] = useState<any>(null)

  if (loggedInUser) {
    console.log(loggedInUser);
    return (
      <div className="App">
        <header className="App-header">
          <h4>Workspaces</h4>
          <div>
            <WorkspaceList loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}/>
          </div>
        </header>
      </div>
    );
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <h1>NotSlack for Desktop</h1>
          <div>
            <LoginFields loggedInAttempt={loggedInAttempt} setLoggedInAttempt={setLoggedInAttempt} setLoggedInUser={setLoggedInUser}
            />
          </div>
          {loggedInAttempt > 0 ?
            <p>
              Invalid credentials. {loggedInAttempt} attempts for this email address.
            </p>
            :
            <p></p>
          }
          
        </header>
      </div>
    );
  }
}

export default App;
