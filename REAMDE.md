# scorio Editor Control Samples

### Examples of viewing, editing, and playing back music scores in web browsers and apps.

## Basic steps to embed a scorio Editor Control into a web page

Include the scorio Editor Control JavaScriprt API into the page
```js
<script type='text/javascript' src='https://www.scorio.com/api/ScorioEditorControl.js'></script>
```

Create an empty html element wrapping the control
```html
<div id='scorio-editor-control-wrapper'></div>
```

Create an instance of the control (you could put several controls on a page)
```js
const control = new ScorioEditorControl();
```

Bring the control to life within the wrapping html element
```js
const wrapper = document.getElementById('scorio-editor-control-wrapper');
const musicxml = null;
const options = new Object();
options.height = 500;
	   
await control.open(wrapper, musicxml, options)
   	     .then(ev => {   ... do what you want to ...   });
```

