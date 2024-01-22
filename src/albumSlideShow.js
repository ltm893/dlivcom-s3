import {  ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3" ;
import  { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";


let INTERVALS = [];
const ALBUMS_URL = 'https://9m0eizfep4.execute-api.us-east-1.amazonaws.com/Dev/albums' ; 
const PHOTOS_URL =  'https://9m0eizfep4.execute-api.us-east-1.amazonaws.com/Dev/photos-from-album/' ; 


const photoAlbums  = async () => {
    const response = await fetch(ALBUMS_URL);
    const albums = await response.json();
    return albums;
}


const loadAlbumSelector = async (selector) => {
  const albums = await photoAlbums() ; 
  if (albums.length) {
    setHeading( '' ) ;
    albums.unshift('Pick or Stop') ; 
    const selectAlbum = document.getElementById(selector);
    for (let a of albums) {
      let option = document.createElement('option');
      option.value = a;
      option.text = a;
      selectAlbum.appendChild(option);
    }
    selectAlbum.addEventListener('change', selectAlbumEventHandler, true);
  } 
  else {
   setHeading( 'No albums returned' ) ;
  }   
} 

const selectAlbumEventHandler = async (event) => {
  if (INTERVALS.length > 0) {
    for (let i of INTERVALS) {
      window.clearInterval(i);
    }
  }

  const albumName = event.srcElement.value  ;
  if (albumName == 'Pick or Stop') {
    setHeading('') ; 
    return  ; 
  }

  setHeading('Getting Pics in ' + albumName) ;   ;  
  const photos =  await getPhotosSdk (albumName) ; 
  setHeading('got pics') ; 
  // console.log(photos)
  doSlideShow(photos);
  return ; 
}


const getPhotosUrl = async  (albumName ) => {
  console.log(albumName)
  const response = await fetch(PHOTOS_URL + albumName);  
  console.log(response)
  const photos = await response.json();
 
  return photos ; 
}

async function  getPhotosSdk(album) {
  const client = new S3Client({
    region: "us-east-1",
    
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: "us-east-1" },
      identityPoolId: "us-east-1:ee4db425-cb51-4c10-a6d9-2e0e45f6fb87"
    }),
  }) ; 
        
  const bucket = "dliv.com" ; 
  const s3RegionUrl = "https://s3.us-east-1.amazonaws.com/" ; 

  //console.log("looking in S3 bucket : " + s3RegionUrl +  bucket + "\n");
  const input = {
    Bucket: bucket  ,
    Delimiter: '/' ,
    Prefix: album + "/" 
  }; 
  console.log(input) ; 
  const command = new ListObjectsV2Command(input) ; 

  try {
    let isTruncated = true;
    let contents = "" ;
    let photos = [] ; 
   
    while (isTruncated) {
      const { IsTruncated, NextContinuationToken, Contents } =  await client.send(command);
      const result =  await client.send(command);
    
      const response = await client.send(command); 
      
   
      isTruncated = IsTruncated;
     

      command.input.ContinuationToken = NextContinuationToken;
      photos = Contents.map(function (photo) {
        var photoKey = photo.Key;
        var photoUrl = s3RegionUrl + bucket + '/' +  photoKey;
        return photoUrl;
      });
      photos.shift();
      console.log(photos)
     
    }
    return(photos) ;
    } catch (err) {
      console.error(err);
    }
  
  }



   
  
const doSlideShow = (photos) => { 
  console.log(photos) ;
  
    const slideshow = document.getElementById('slide'); 
    
    slideshow.src = photos.shift() ;
    const interval = setInterval(function () {
      let singleSlide ; 
      singleSlide = photos.shift();
      if(singleSlide) {
        slideshow.src = singleSlide;
      }
      else {
        window.clearInterval(interval);
      }
    }, 3000);
    INTERVALS.push(interval);
    return ; 
}

const setHeading = (headingMessage ) => {
   document.getElementById('headerMessage').innerHTML = headingMessage ;
}


function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
  setHeading('Getting Albums')
  loadAlbumSelector('selectAlbum')
})
 