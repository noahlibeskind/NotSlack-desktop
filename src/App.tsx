import React, { useState } from 'react';
import './bulma/css/bulma.min.css';
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
          <img src="notslacklogo.png"></img>
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
