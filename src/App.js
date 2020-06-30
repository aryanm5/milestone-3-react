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

  return <div>
    <input id='newName' placeholder='Name'/><br/>
    <textarea id='newMessage' placeholder='Message'></textarea><br/>
    <button onClick={sendMessage}>Send</button>
  </div>
}
function Messages(props) {
  return (
    <div className="messages">
      {props.messages.map(mess => <div key={mess.id}> {mess.name}: {mess.message} </div>)} 
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
