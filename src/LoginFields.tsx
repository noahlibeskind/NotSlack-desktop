import React, { useState } from "react";
import App from './App'

interface InputTextProps {
  onEmailChange: (Email: string) => void;
  onPasswordChange: (password: string) => void;
}

interface LoginProps {
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginFields: React.FC<LoginProps> = ({ loggedIn, setLoggedIn }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    };

    const handleSubmit = () => {
        fetch("http://10.0.0.57:8080/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => {
            if (response.status === 200) {
              setLoggedIn(true);
            } else {
              console.log("Login failed");
            }
          })
          .catch(error => {
            console.error("Login error:", error);
          });
      };

    return (
    <div className="InputStack">
        <label>
        Email:
        <input type="text" value={email} onChange={handleEmailChange} />
        </label>
        <label>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
        </label>
        <button onClick={handleSubmit}>Login</button>
    </div>
    );
};


export default LoginFields;