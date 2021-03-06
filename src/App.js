import './App.css';
import React, { useState, useEffect } from 'react';
import {
  HashRouter,
  Switch,
  Route
} from "react-router-dom";
import { css } from '@emotion/css';
import { API, Auth, graphqlOperation, Storage } from 'aws-amplify';
import { listPosts } from './graphql/queries';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
// import { v4 as uuid } from 'uuid';

import Button from './Button';
import Posts from './Posts';
import Post from './Post';
import Header from './Header';
import CreatePost from './CreatePost';
import { deletePost } from './graphql/mutations';
// import { updatePost } from './graphql/mutations';

// Changing 'App' to 'Router'
function Router() {
  // create pieces of initial state
  const [showOverlay, updateOverlayVisibility] = useState(false);
  const [posts, updatePosts] = useState([]);
  // const [images, setImages] = useState([]);
  // const [posts, setPosts] = useState([]);
  const [myPosts, updateMyPosts] = useState([]);

  // fetch stuff when component loads
  useEffect(() => {
    //fetchImages();
    // checkUser();
    fetchPost();
  }, []);

  //testing removing data
  /* const removePost = async id => {
    try {
      const input = { id };
      const result = await API.graphql(graphqlOperation(deletePost, { input }));
      const deletePostId = result.data.deletePost.id;

    } catch (err) {
      console.log(err);
    };
  }  */

  // async function fetchImages() {
  //   let s3images = await Storage.list('');
  //   s3images = await Promise.all(s3images.map(async image => {
  //     const signedImage = await Storage.get(image.key);
  //     return signedImage;
  //   }))
  //   setImages(s3images);
  // }

  // function onChange(e) {
  //   if (!e.target.files[0]) return
  //   const file = e.target.files[0];
  //   Storage.put(uuid(), file).then (() => fetchImages())
  // }

  // async function checkUser() {
  //   const user = await Auth.currentAuthenticatedUser();
  //   console.log('user: ', user);
  //   console.log('user attributes: ', user.attributes);
  // }

  async function fetchPost() {
    // try {
    // query API, ask for 100 items?
    let postData = await API.graphql({ 
        query: listPosts, 
        // authMode: 'AMAZON_COGNITO_USER_POOLS',
        variables: { limit: 100 } });
        // console.log(postData)
    let postsArray = postData.data.listPosts.items;
    // const postData = await API.graphql({ query: listPosts });

    // mapover the image keys in posts array, get signed image urls for each image
    postsArray = await Promise.all(postsArray.map(async post => {
      const imageKey = await Storage.get(post.image);
      post.image = imageKey;
      return post;
    }));
    // update the posts array in the local state
    setPostState(postsArray);
    // setPosts(postData.data.listPosts.items);
    //   console.log('fetching posts')
    // } catch (err) {
    //   console.log({ err })
  }

  async function setPostState(postsArray) {
    const user = await Auth.currentAuthenticatedUser();
    const myPostData = postsArray.filter(p => p.owner === user.username);
    updateMyPosts(myPostData);

    updatePosts(postsArray);
  }


  return (
    <>
      <HashRouter>
        <div className={contentStyle}>
          <Header />
          <hr className={dividerStyle} />
          {/* <Button title="New Post" onClick={() => updatePost(true)} /> */}
          <Button title="New Post" onClick={() => updateOverlayVisibility(true)} />
          <Switch>
            <Route exact path="/" >
              <Posts posts={posts} />
            </Route>
            <Route path="/post/:id">
              <Post />
            </Route>
            <Route exact path="/myposts" >
              <Posts posts={myPosts} />
            </Route>
          </Switch>
        </div>
        <AmplifySignOut />
      </HashRouter>
      { showOverlay && (
        <CreatePost
          updateOverlayVisibility={updateOverlayVisibility}
          updatePosts={setPostState}
          posts={posts}
        />
      )}
    </>
    // <div>
    //   {/* <h1> Hello world! </h1>
    //   {
    //     posts.map(post => (
    //       <div key={post.id}>
    //         <h3>{post.name}</h3>
    //         <p>{post.location}</p>
    //       </div>
    //     ))
    //   } */}
    //   <h1>Photo Album</h1>
    //   <span>Add new image</span>
    //   <Button title="New Post" onClick={()=> updateOverlayVisibility(true)}/>
    //   <input
    //     type="file"
    //     accept='image/png'
    //     onChange={onChange}
    //   />
    //   <div style={{display: 'flex', flexDirection: 'column'}}>
    //     { images.map(image => <img src={image} style={{width: 400, marginBottom :10}}/>)}
    //   </div>
    //   <AmplifySignOut />
    // </div>

  );
};

const dividerStyle = css`
  margin-top: 15px;
`

const contentStyle = css`
  min-height: calc(100vh - 45px);
  padding: 0px 40px;
`

export default withAuthenticator(Router);

