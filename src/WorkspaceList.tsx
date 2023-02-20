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

interface Channel {
    id: string;
    name: string;
    messages: number;
}

const WorkspaceList: React.FC<WSListProps> = ({ loggedInUser, setLoggedInUser }) => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);

    const [currWorkspace, setCurrWorkspace] = useState<Workspace>();
    const [currChannel, setCurrChannel] = useState<Channel>();

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

    useEffect(() => {
        fetch("http://10.0.0.57:8080/workspace/channel/" + currWorkspace?.id, {
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
                throw new Error("Failed to fetch channels");
            }
        })
        .then(data => setChannels(data))
        .catch(error => console.error(error));
    }, [currWorkspace, channels])

    return (
        <div className="tile is-ancestor">
            {/* Workspaces */}
            <div className="tile is-parent">
                {/* <div className="tile"> */}
                    <div className="tile is-child">
                        <p className="subtitle">Workspaces</p>
                    </div>
                {/* </div> */}
                <ul>
                    {workspaces.map(workspace => (
                        <li key={workspace.id}>
                            <div className="tile is-parent">
                            {workspace.id === currWorkspace?.id ?
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
            {/* Channels */}
            <div className="tile is-parent">
                <div className="tile">
                    <div className="tile is-child">
                        <p className="subtitle">Channels</p>
                    </div>
                </div>
                <ul>
                    {channels.map(channel => (
                        <li key={channel.id}>
                            <div className="tile is-parent">
                            {channel.id === currChannel?.id ?
                            <div className="tile is-child notification is-link">
                                <p className="subtitle">
                                    {channel.name}
                                </p>
                            </div>
                            :
                            <div className="tile is-child box" onClick={() => setCurrChannel(channel)}>
                                <p className="subtitle">
                                    {channel.name}
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