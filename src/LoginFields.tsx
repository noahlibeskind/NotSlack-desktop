import React, { useState } from "react";

interface LoginProps {
    loggedInAttempt: number,
    setLoggedInAttempt: React.Dispatch<React.SetStateAction<number>>;
    setLoggedInUser: React.Dispatch<React.SetStateAction<any>>;
}

const LoginFields: React.FC<LoginProps> = ({ loggedInAttempt, setLoggedInAttempt, setLoggedInUser }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoggedInAttempt(0);
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
                return response.json()
            } else {
                throw new Error("Login failed");
            }
        })
        .then(json => {
            console.log(json);
            setLoggedInUser(json);
        })
        .catch(error => {
            setLoggedInAttempt(loggedInAttempt + 1)
            console.log(loggedInAttempt)
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