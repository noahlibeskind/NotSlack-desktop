import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginFields from './LoginFields';
import WorkspaceList from './WorkspaceList';

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [loggedInUser, setLoggedInUser] = useState<any>(null)

  if (loggedIn) {
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
            <LoginFields setLoggedIn={setLoggedIn} setLoggedInUser={setLoggedInUser}
            />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
