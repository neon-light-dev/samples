// **DO THIS**:
//   Replace BUCKET_NAME with the bucket name.
//
const albumBucketName = 'winepartners.neonlight.dev';

// **DO THIS**:
//   Replace this block of code with the sample code located at:
//   Cognito -- Manage Identity Pools -- [identity_pool_name] -- Sample Code -- JavaScript
//
// Initialize the Amazon Cognito credentials provider
// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'ap-southeast-2'; // Region

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'ap-southeast-2:18d55d21-b8e0-4324-afa8-a8c2f57ee54b',
});

// Create a new service object
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
});

// A utility function to create HTML.
function getHtml(template) {
  return template.join('\n');
}

// List the photo albums that exist in the bucket.
function listAlbums() {
  s3.listObjects({Delimiter: '/'}, function(err, data) {
    if (err) {
      return alert('There was an error listing your albums: ' + err.message);
    } else {
      var albums = data.CommonPrefixes.map(function(commonPrefix) {
        var prefix = commonPrefix.Prefix;
        var albumName = decodeURIComponent(prefix.replace('/', ''));
        return getHtml([
          '<li>',
          '<button style="margin:5px;" onclick="viewAlbum(\'' + albumName + '\')">',
          albumName,
          '</button>',
          '</li>'
        ]);
      });
      var message = albums.length ?
        getHtml([
          '<p>Click on an album name to view it.</p>',
        ]) :
        '<p>You do not have any albums. Please Create album.';
      var htmlTemplate = [
        '<h2>Albums</h2>',
        message,
        '<ul>',
        getHtml(albums),
        '</ul>',
      ]
      document.getElementById('viewer').innerHTML = getHtml(htmlTemplate);
    }
  });
}

// Show the photos that exist in an album.
function viewAlbum(albumName) {
  var albumPhotosKey = encodeURIComponent(albumName) + '/';
  s3.listObjects({Prefix: albumPhotosKey}, function(err, data) {
    if (err) {
      return alert('There was an error viewing your album: ' + err.message);
    }
    // 'this' references the AWS.Request instance that represents the response
    var href = this.request.httpRequest.endpoint.href;
    var bucketUrl = href + albumBucketName + '/';

    var photos = data.Contents.map(function(photo) {
      var photoKey = photo.Key;
      var photoUrl = bucketUrl + encodeURIComponent(photoKey);
      return getHtml([
        '<span>',
        '<div>',
        '<br/>',
        '<img style="width:128px;height:128px;" src="' + photoUrl + '"/>',
        '</div>',
        '<div>',
        '<span>',
        photoKey.replace(albumPhotosKey, ''),
        '</span>',
        '</div>',
        '</span>',
      ]);
    });
    var message = photos.length ?
      '<p>The following photos are present.</p>' :
      '<p>There are no photos in this album.</p>';
    var htmlTemplate = [
      '<div>',
      '<button onclick="listAlbums()">',
      'Back To Albums',
      '</button>',
      '</div>',
      '<h2>',
      'Album: ' + albumName,
      '</h2>',
      message,
      '<div>',
      getHtml(photos),
      '</div>',
      '<h2>',
      'End of Album: ' + albumName,
      '</h2>',
      '<div>',
      '<button onclick="listAlbums()">',
      'Back To Albums',
      '</button>',
      '</div>',
    ]
    document.getElementById('viewer').innerHTML = getHtml(htmlTemplate);
    document.getElementsByTagName('img')[0].setAttribute('style', 'display:none;');
  });
}

//
// View the root album..
function viewRootAlbum() {

  let albumPhotosKey = '';

  s3.listObjects({Prefix: albumPhotosKey}, function(err, data) {
    if (err) {
      return alert('There was an error viewing your album: ' + err.message);
    }

    console.log(data);

    // 'this' references the AWS.Request instance that represents the response
    var href = this.request.httpRequest.endpoint.href;
    var bucketUrl = href + albumBucketName + '/';

    var photos = data.Contents.map(function(photo) {
      var photoKey = photo.Key;
      var photoUrl = bucketUrl + encodeURIComponent(photoKey);
      return getHtml([
        '<span>',
        '<div>',
        '<br/>',
        '<img style="width:128px;height:128px;" src="' + photoUrl + '"/>',
        '</div>',
        '<div>',
        '<span>',
        photoKey.replace(albumPhotosKey, ''),
        '</span>',
        '</div>',
        '</span>',
      ]);
    });
    var message = photos.length ?
      '<p>The following photos are present.</p>' :
      '<p>There are no photos in this album.</p>';
    var htmlTemplate = [
      '<div>',
      '<button onclick="listAlbums()">',
      'Back To Albums',
      '</button>',
      '</div>',
      '<h2>',
      'Album: ' + '/',
      '</h2>',
      message,
      '<div>',
      getHtml(photos),
      '</div>',
      '<h2>',
      'End of Album: ' + '/',
      '</h2>',
      '<div>',
      '<button onclick="listAlbums()">',
      'Back To Albums',
      '</button>',
      '</div>',
    ]
    document.getElementById('viewer').innerHTML = getHtml(htmlTemplate);
    document.getElementsByTagName('img')[0].setAttribute('style', 'display:none;');
  });
}