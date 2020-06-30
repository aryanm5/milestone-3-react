import React from 'react';
import './App.css';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:5000/graphql'
});
const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
  },
  query: {
    fetchPolicy: 'no-cache',
  },
}

const client = new ApolloClient({
  cache,
  link,
  defaultOptions
});


function NewMessage(props) {
  const sendMessage = () => {
    var n =  document.getElementById("newName").value;
    var m = document.getElementById("newMessage").value;
    if(n.length < 1) {
      alert("Name cannot be empty!"); return;
    } else if(m.length < 1) {
      alert("Message cannot be empty!"); return;
    }
    document.getElementById("newMessage").value = "";
    client.mutate({
      variables: { name: n, message: m },
      mutation: gql`
        mutation AddMessage($name: String!, $message: String!) {
          addMessage(name:$name, message:$message) {
            id,
            name,
            message
          }
        }
      `
    })
    .then(result => {  });
  };

  const keyPressed = (e) => {
    if(e.keyCode == 13) {
      e.preventDefault();
      sendMessage();
    }
  }

  return <div className="newMessage">
    <strong>Milestone 4</strong><br/>
    By Aryan Mittal<br/><br/>
    <input id='newName' placeholder='Name'/><br/><br/>
    <textarea onKeyDown={keyPressed} rows={5} id='newMessage' placeholder='Message'></textarea><br/>
    <button onClick={sendMessage}>Send Message</button>
  </div>
}
function Messages(props) {
  return (
    <div className="messages">
      {props.messages.map(mess => <div key={mess.id}><strong>{mess.name}</strong>: {mess.message} </div>)} 
    </div>
  )
}

function App() {
  var [messages, setMessages] = React.useState([{id: "0", name: "Chat App", message: "Loading..."}]);
  const getMessages = () => {
    client.query({
      query: gql`
        query {
          messages {
            id,
            name,
            message
          }
        }
      `
    })
    .then(result => {
      if(!result.data.loading) {
        setMessages(result.data.messages);
        console.log("done");
      }
    });
  }

  React.useEffect(() => {
    setInterval(getMessages, 2000);
  }, []);

  return (
    <div className="App">
      <NewMessage />
      <Messages messages={messages} />
    </div>
  );
}

export default App;
