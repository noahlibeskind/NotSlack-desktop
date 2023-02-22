import React, { useEffect, useState } from "react";
import './App.css';

interface WSListProps {
  // setSelectedWorkSpace: React.Dispatch<React.SetStateAction<string>>;
  loggedInUser: any;
  setLoggedInUser: React.Dispatch<React.SetStateAction<any>>;
}

interface Member {
  id: string,
  name: string,
  email: string,
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

interface SendMessage {
  content: string
}

const DisplayDate = (string_date: string) => {
  let date_secs = Date.parse(string_date);
  let date_obj = new Date(date_secs);
  var hours = date_obj.getHours();
  var minutes = date_obj.getMinutes();
  var newformat = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;

  return (
    date_obj.toLocaleString('en-US', {month: 'short'}) +
    ' ' +
    date_obj.getDate() +
    ', ' +
    String(date_obj.getFullYear()) +
    ' at ' +
    hours +
    ':' +
    (String(minutes).length < 2 ? '0' + String(minutes) : minutes) +
    ' ' +
    newformat
  );
};

const FetchMessages: any = (loggedInUser: Member, currChannel: Channel, setMessages: React.SetStateAction<any>) => {
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
  .then(data => {
    setMessages(data);
    var messageList = document.getElementById('message-list');
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  })
  .catch(error => console.error(error));

}

// const DeleteMessage: any = (setMessages: React.SetStateAction<any>) => {

// }

const WorkspaceList: React.FC<WSListProps> = ({ loggedInUser, setLoggedInUser }) => {
  const [members, setMembers] = useState<Member[]>([])
  const [memberMap, setMemberMap] = useState<{[key: string]: string}>({})
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [currWorkspace, setCurrWorkspace] = useState<Workspace>();
  const [currChannel, setCurrChannel] = useState<Channel>();

  const [messageContent, setMessageContent] = useState<string>('')
  const [messageSent, setMessageSent] = useState<boolean>(false)

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
          var messageList = document.getElementById('message-list');
          if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
          }
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
    setCurrChannel(undefined)
    setChannels([])
    setMessages([])
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
  }, [loggedInUser, currWorkspace])

  useEffect(() => {
    if (currChannel) {
      FetchMessages(loggedInUser, currChannel, setMessages);
    }
  }, [loggedInUser, currChannel, messageSent])

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageContent(event.target.value)
  };

  const handleSend = () => {
    let content = messageContent;
    fetch("http://10.0.0.57:8080/channel/message/" + currChannel?.id, {
      method: "POST",
      body: JSON.stringify({ content }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + loggedInUser?.accessToken,
      }
    })
    .then(response => {
      if (response.status === 200) {
        FetchMessages(loggedInUser, currChannel, setMessages);
        return response.json()
      } else {
        throw new Error("Message send failure.");
      }
    })
    .catch(error => {
      console.error("Message send error:", error);
    });
    
    setMessageContent('');
  };

  return (
      <div className="tile is-ancestor">
        {/* Workspaces */}
        <div className="tile is-parent is-vertical is-3">
          <div className="tile is-child">
            <p className="subtitle">Workspaces</p>
            
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
        </div>
        {/* Channels */}
        <div className="tile is-parent is-vertical is-3">
          <div className="tile is-child">
            <p className="subtitle">Channels</p>
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
        </div>
        {/* Messages */}
        <div className="tile is-parent is-vertical is-6">
          <div className="tile is-child">
            <p className="subtitle">Messages</p>
            <ul id="message-list">
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
                    <p className="is-size-7">
                      {DisplayDate(message.posted.toString())}
                    </p>
                  </div>
                </div>
              </li>
            ))}
            </ul> 
          </div>
          <div className="tile is-parent is-12">
            
            <div className="tile is-child is-10">
              <input className="input is-link" type="text" value={messageContent} onChange={handleContentChange} />
            </div>
            <div className="tile is-child is-2">
              <button className="button is-link" onClick={handleSend}>Send</button>
            </div>
            
          </div>
            
        </div>
      </div>
          
  );
};

export default WorkspaceList;