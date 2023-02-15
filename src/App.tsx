import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginFields from './LoginFields';





function App() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  // const [localLoggedIn, setLocalLoggedIn] = useState(false)

  // useEffect(() => {
  //   console.log(localLoggedIn)
  //   setLocalLoggedIn(loggedIn)
  // }, [loggedIn])

  if (loggedIn) {
    return (
      <div className="App">
        <header className="App-header">
          <h4>Workspaces</h4>
          <div>
            <p>
              Hello user!
            </p>
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
            <LoginFields loggedIn={loggedIn} setLoggedIn={setLoggedIn}
            />
          </div>
        </header>
      </div>
    );
  }
}

export default App;
