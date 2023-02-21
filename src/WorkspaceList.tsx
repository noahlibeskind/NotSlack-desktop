import React, { useEffect, useState } from "react";

interface WSListProps {
  // setSelectedWorkSpace: React.Dispatch<React.SetStateAction<string>>;
  loggedInUser: any;
  setLoggedInUser: React.Dispatch<React.SetStateAction<any>>;
}

interface Member {
  id: string,
  name: string,
  email: string,
  password: string,
  accessToken: string
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

interface Message {
  id: string;
  member: string;
  posted: Date;
  content: string;
}

const WorkspaceList: React.FC<WSListProps> = ({ loggedInUser, setLoggedInUser }) => {
  const [members, setMembers] = useState<Member[]>([])
  const [memberMap, setMemberMap] = useState<{[key: string]: string}>({})
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);


  const [currWorkspace, setCurrWorkspace] = useState<Workspace>();
  const [currChannel, setCurrChannel] = useState<Channel>();

  useEffect(() => {
      fetch("http://10.0.0.57:8080/workspace", {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + loggedInUser?.accessToken,
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

      fetch("http://10.0.0.57:8080/member", {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + loggedInUser?.accessToken,
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch members");
        }
      })
      .then(data => {
        setMembers(data);
        for (const member of data) {
          console.log(member)
          setMemberMap((prevMemberMap) => ({...prevMemberMap, [member.id]: member.name}))
        }
      })
      .catch(error => console.error(error));

      
  }, [loggedInUser]);

  useEffect(() => {
    fetch("http://10.0.0.57:8080/workspace/channel/" + currWorkspace?.id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + loggedInUser?.accessToken,
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
  }, [loggedInUser, currWorkspace, channels])

  useEffect(() => {
    fetch("http://10.0.0.57:8080/channel/message/" + currChannel?.id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + loggedInUser?.accessToken,
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch messages");
      }
    })
    .then(data => setMessages(data))
    .catch(error => console.error(error));
  }, [loggedInUser, currChannel, messages])

  return (
      <div className="tile is-ancestor">
        {/* Workspaces */}
        <div className="tile is-parent is-vertical is-2">
          <div className="tile is-child">
            <p className="subtitle">Workspaces</p>
          </div>
          <ul>
            {workspaces.map(workspace => (
              <li key={workspace.id}>
                <div className="tile is-parent">
                {workspace.id === currWorkspace?.id ?
                <div className="tile is-child notification is-link">
                  <p className="is-size-6">
                      {workspace.name}
                  </p>
                </div>
                :
                <div className="tile is-child notification" onClick={() => setCurrWorkspace(workspace)}>
                  <p className="is-size-6">
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
        <div className="tile is-parent is-vertical is-2">
          <div className="tile is-child">
              <p className="subtitle">Channels</p>
          </div>
        
          <ul>
            {channels.map(channel => (
              <li key={channel.id}>
                <div className="tile is-parent">
                {channel.id === currChannel?.id ?
                  <div className="tile is-child notification is-link">
                    <p className="is-size-6">
                        {channel.name}
                    </p>
                  </div>
                  :
                  <div className="tile is-child notification" onClick={() => setCurrChannel(channel)}>
                    <p className="is-size-6">
                        {channel.name}
                    </p>
                  </div>
                }
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Messages */}
        <div className="tile is-parent is-vertical is-8">
          <div className="tile is-child">
            <p className="subtitle">Messages</p>
          </div>
          <ul>
            {messages.map(message => (
              <li key={message.id}>
                <div className="tile is-parent">
                  <div className="tile is-child notification">
                    <p className="is-size-6">
                      {message.content}
                    </p>
                    <p className="is-size-7">
                      {memberMap[message.member]}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
          
  );
};

export default WorkspaceList;