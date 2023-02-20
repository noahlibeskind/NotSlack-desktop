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
    const [currWorkspace, setCurrWorkspace] = useState<Workspace>();

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
        <div className="tile is-ancestor">
            
            <div className="tile is-vertical">
                <div className="tile is-parent">
                    <div className="tile is-child">
                        <p className="subtitle">Workspaces</p>
                    </div>
                </div>
                <ul>
                    {workspaces.map(workspace => (
                        <li key={workspace.id}>
                            <div className="tile is-parent">
                            {workspace.id == currWorkspace?.id ?
                            <div className="tile is-child notification is-link">
                                <p className="subtitle">
                                    {workspace.name}
                                </p>
                            </div>
                            :
                            <div className="tile is-child box" onClick={() => setCurrWorkspace(workspace)}>
                                <p className="subtitle">
                                    {workspace.name}
                                </p>
                            </div>
                            }
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            
        </div>
    );
};

export default WorkspaceList;