import './App.css';
import React, { useState, useEffect } from 'react';
import { API, Auth } from 'aws-amplify';
import { listPosts } from './graphql/queries';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

function App() {

  const [posts, setPosts] = useState([])


  useEffect(() => {
    checkUser();
    fetchPosts();
  }, []);

  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser();
    console.log('user: ', user);
    console.log('user attributes: ', user.attributes);
  }

  async function fetchPosts() {
    try {
      const postData = await API.graphql({ query: listPosts });
      setPosts(postData.data.listPosts.items);
      console.log('fetching posts')
    } catch (err) {
      console.log({ err })
    }
  }

  return (
    <div>
      <h1> Hello world! </h1>
      {
        posts.map(post => (
          <div key={post.id}>
            <h3>{post.name}</h3>
            <p>{post.location}</p>
          </div>
        ))
      }
      <AmplifySignOut />
    </div>
  )

};

export default withAuthenticator(App);
