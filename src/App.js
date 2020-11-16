import './App.css';
import React, { useState, useEffect } from 'react';
import { API, Auth, Storage } from 'aws-amplify';
import { listPosts } from './graphql/queries';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { v4 as uuid } from 'uuid';

function App() {

  const [images, setImages] = useState([]);
  // const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchImages();
    // checkUser();
    // fetchPosts();
  }, []);

  async function fetchImages() {
    let s3images = await Storage.list('');
    s3images = await Promise.all(s3images.map(async image => {
      const signedImage = await Storage.get(image.key);
      return signedImage;
    }))
    setImages(s3images);
  }

  function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    Storage.put(uuid(), file).then (() => fetchImages())
  }

  // async function checkUser() {
  //   const user = await Auth.currentAuthenticatedUser();
  //   console.log('user: ', user);
  //   console.log('user attributes: ', user.attributes);
  // }

  // async function fetchPosts() {
  //   try {
  //     const postData = await API.graphql({ query: listPosts });
  //     setPosts(postData.data.listPosts.items);
  //     console.log('fetching posts')
  //   } catch (err) {
  //     console.log({ err })
  //   }
  // }

  return (
    <div>
      {/* <h1> Hello world! </h1>
      {
        posts.map(post => (
          <div key={post.id}>
            <h3>{post.name}</h3>
            <p>{post.location}</p>
          </div>
        ))
      } */}
      <h1>Photo Album</h1>
      <span>Add new image</span>
      <input
        type="file"
        accept='image/png'
        onChange={onChange}
      />
      <div style={{display: 'flex', flexDirection: 'column'}}>
        { images.map(image => <img src={image} style={{width: 400, marginBottom :10}}/>)}
      </div>
      <AmplifySignOut />
    </div>

  )
};

export default withAuthenticator(App);
