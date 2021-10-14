# scorio Editor Control Samples

## Examples of viewing, editing, and playing back music scores in web browsers and apps.

## Usage
Include the scorio Editor Control API into your web page
```js
<script type='text/javascript' src='https://www.scorio.com/lib/scorioEditorControl.js'></script>
```

Create an html element wrapping the control
```html
<div id='scorio-editor-control-wrapper'></div>
```

Create an instance (you could put several of them on a page)
```js
const control = new ScorioEditorControl();
```

Bring the control to life within the wrapping html element
```js
const wrapper = document.getElementById('scorio-editor-control-wrapper');
const options = new Object();
options.height = 500;
	   
await control.open(wrapper, null, options)
   	         .then(ev => { 	... do what you want to ...   	});
```

