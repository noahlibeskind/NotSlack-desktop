import React, { useState } from "react";

interface LoginProps {
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    setLoggedInUser: React.Dispatch<React.SetStateAction<any>>;
}

const LoginFields: React.FC<LoginProps> = ({ setLoggedIn, setLoggedInUser }) => {
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
                return response.json()
            } else {
                throw new Error("Login failed");
            }
        })
        .then(json => {
            console.log(json);
            setLoggedInUser(json);
            setLoggedIn(true)
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