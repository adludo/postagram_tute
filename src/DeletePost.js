import React, { useState } from 'react';
import { css } from '@emotion/css';
import Button from './Button';
import { deletePost } from './graphql/mutations';


// steps
// add button to delete
// delete from graphql
// update posts

// await API.graphql(graphqlOperation(createTodo, {input: todo}));

// await API.graphql({
//     query: createPost, variables: { input: postInfo }
// });


// await API.graphql(graphqlOperation(deleteTodo, { input: { id: todoId }})); // This is standard format to delete