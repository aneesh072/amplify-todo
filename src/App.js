import React, { useState, useEffect } from 'react';
import {
  withAuthenticator,
  Text,
  Flex,
  View,
  Badge,
  Button,
} from '@aws-amplify/ui-react';

import { API, graphqlOperation } from 'aws-amplify';
import { createTodo } from './graphql/mutations';

import { listTodos } from './graphql/queries';

const App = ({ user, signOut }) => {
  const [todos, setTodos] = useState([]);

  const fetchTodo = async () => {
    const data = await API.graphql(graphqlOperation(listTodos));
    setTodos(data);
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  return (
    <div>
      <Flex direction={'column'} padding={8}>
        <Text>
          Logged in as <b>{user.username}</b>
          <Button variation="link" onClick={signOut}>
            Sign out
          </Button>
        </Text>
      </Flex>
      <Button
        onClick={async () => {
          await API.graphql(
            graphqlOperation(createTodo, { input: window.prompt('content') })
          );
        }}
      >
        Add todo
      </Button>
      {todos.map((todo) => (
        <Flex
          direction="column"
          border="1px solid black"
          padding={8}
          key={todo.id}
        >
          <Text fontWeight={'bold'}>{todo.content}</Text>
          <View>
            👨‍👩‍👧‍👦{' '}
            {todo.owners.map((owner) => (
              <Badge margin={4}>{owner}</Badge>
            ))}
          </View>
        </Flex>
      ))}
    </div>
  );
};

export default withAuthenticator(App);
