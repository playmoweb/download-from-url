## Install

```
$ npm install --save download-from-url
```


## Usage

```js
const downloader = require('download-from-url');

downloader('http://i.kinja-img.com/gawker-media/image/upload/bwr62518kjnqgejq9nkv.jpg', 'dist', function(err, infos, headers) {
	console.log(infos);
	console.log(headers);
});
```