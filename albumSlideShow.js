 
INTERVALS = [];

const photoAlbums = async () => {
    const response = await fetch('https://kdx91acp17.execute-api.us-east-2.amazonaws.com/Dev/albums');
    const albums = await response.json();
    console.log(albums)
    return albums;
}


const loadAlbumSelector = async (selector) => {
    console.log("caLLED loadAlbumSelector") ;
    albums = await photoAlbums() ; 
    if (albums.length) {
        headerMessage.innerText = ""; 
        albums.unshift('Pick or Stop') ; 
        // label = document.getElementById('selectLabel');
        // label.text = 'Slideshows'  ;
        selectAlbum = document.getElementById(selector);
        for (a of albums) {
          let option = document.createElement('option');
          option.value = a;
          option.text = a;
          selectAlbum.appendChild(option);
        }
        selectAlbum.addEventListener('change', selectAlbumEventHandler, true);
      } 
      else {
        headerMessage.innerText = 'No albums returned';
      }   
} 

const selectAlbumEventHandler = async (event) => {
    // let bucketURI =  "s3://mydliv-test/" ; 
   //  let bucketURL = "https://mydliv-test.s3.amazonaws.com/olivia6bday/_olivia_cake1.jpg" ;
    if (INTERVALS.length > 0) {
      for (i of INTERVALS) {
        window.clearInterval(i);
      }
    }
    headerMessage = document.getElementById('headerMessage');
    albumName = event.srcElement.value  ;
    console.log(albumName)

    const response = await fetch('https://kdx91acp17.execute-api.us-east-2.amazonaws.com/Dev/photos-from-album/' + albumName);  
    const photos = await response.json();
    console.log(photos) 

    

    // const slideshow = document.getElementById('slide');
    /*
    s3.listObjects({ Prefix: albumPhotosKey }, function (err, data) {
      if (err) {
        return alert('There was an error viewing your album: ' + err.message);
      }
      // 'this' references the AWS.Request instance that represents the response
  
      let href = this.request.httpRequest.endpoint.href;
      console.log(this.request)
      let bucketUrl = albumBucketName + '/';
      // console.log(data);
      console.log(bucketUrl)
      let photos = data.Contents.map(function (photo) {
        console.log(photo)
        var photoKey = photo.Key;
        // var photoUrl = bucketUrl + encodeURIComponent(photoKey);
        var photoUrl = encodeURIComponent(photoKey);
        return photoUrl;
        return photoUrl;
      });
      photos.shift();
      doSlideShow(photos);
    });
    */
  };
  
  const makeSlideHtml = () => {
    let showSelctorDiv = document.getElementById('slideshow-container');
    if (document.getElementById('slideshow')) {
      document.getElementById('slideshow').remove();
    } 
    const slideshowDiv = document.createElement('div');
    slideshowDiv.id = 'slideshow';
    showSelctorDiv.appendChild(slideshowDiv);
    const slideshowImg = document.createElement('img');
    slideshowImg.id = 'slide';
    slideshowDiv.appendChild(slideshowImg);
    const slideshow = document.getElementById('slide');
    return slideshow ; 
  }
  
  
  const doSlideShow = (photos) => {
    // const slideshow = makeSlideHtml() ;
    const slideshow = document.getElementById('slide'); 
    const interval = setInterval(function () {
      singleSlide = photos.shift();
      if(singleSlide) {
        slideshow.src = singleSlide;
      }
      else {
        window.clearInterval(interval);
      }
      
      console.log(singleSlide);
    }, 3000);
    INTERVALS.push(interval);
  }
