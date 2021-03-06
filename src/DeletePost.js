import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import Button from './Button';
import { deletePost } from './graphql/mutations';
import { useParams } from 'react-router-dom';
import { getPost } from './graphql/queries';
import { API, graphqlOperation, Auth } from 'aws-amplify';



export default async function DeletePost(
    post
) {
    const postInfo = {
        name: post.name,
        description: post.description,
        location: post.location,
        image: post.image.name,
        id: post.id,
        owner: post.owner
    };

    console.log("test before")
    // console.log(post.owner)

    try {
        const { username } = await Auth.currentAuthenticatedUser();
        let testPost = await API.graphql(graphqlOperation(getPost, { id: postInfo.id }))
        console.log(username)
        console.log(postInfo.owner)
        if (username === postInfo.owner) {
            console.log("ok")
            await API.graphql({
                query: deletePost,
                authMode: 'AMAZON_COGNITO_USER_POOLS',
                variables: { input: { id: postInfo.id } }
            });
        } else {
            console.log("bad")
        }


    } catch (err) {
        console.log(err)
    }

    // let testPost = await API.graphql(graphqlOperation(getPost, { id: postInfo.id }))
    //const postsName = testPost.data.getPost.name;
    console.log("test after")
    // API.graphql(graphqlOperation(deletePost, { input: postInfo.id }))
    //console.log(postsName)

}



// steps
// add button to delete
// delete from graphql
// update posts

// await API.graphql(graphqlOperation(createTodo, {input: todo}));

// await API.graphql({
//     query: createPost, variables: { input: postInfo }
// });


// await API.graphql(graphqlOperation(deleteTodo, { input: { id: todoId }})); // This is standard format to delete