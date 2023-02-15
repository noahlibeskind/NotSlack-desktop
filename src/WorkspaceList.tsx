import React, { useEffect, useState } from "react";

interface WSListProps {
    // setSelectedWorkSpace: React.Dispatch<React.SetStateAction<string>>;
    loggedInUser: any;
    setLoggedInUser: React.Dispatch<React.SetStateAction<any>>;
}

interface Workspace {
    id: string;
    name: string;
    channels: number;
    owner: string;
}

const WorkspaceList: React.FC<WSListProps> = ({ loggedInUser, setLoggedInUser }) => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

    useEffect(() => {
        fetch("http://10.0.0.57:8080/workspace", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + loggedInUser.accessToken,
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to fetch workspaces");
                }
            })
            .then(data => setWorkspaces(data))
            .catch(error => console.error(error));
    }, [loggedInUser]);

    return (
        <div>
            <ul>
                {workspaces.map(workspace => (
                    <li key={workspace.id}>{workspace.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default WorkspaceList;