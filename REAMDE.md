# scorio Editor Control Samples

### Examples of viewing, editing, and playing back music scores in web browsers and apps.
Try out the samples of this Project here: https://www.scorio.com/scorio-api-samples/scorio-editor-control-samples

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

Bring the control to life within the wrapping HTML element
```js
const wrapper = document.getElementById('scorio-editor-control-wrapper');
const musicxml = null;
const options = new Object();
options.height = 500;
	   
await control.open(wrapper, musicxml, options)
   	     .then(ev => {   ... control is ready, do what ever you want to ...   })
	     .catch(err => window.alert(err));
```

## ScorioEditorControl API Functions
Including <script type='text/javascript' src='https://www.scorio.com/api/ScorioEditorControl.js'></script>
into a web page will define the JavaScript object ScorioEditorControl. 

	new ScorioEditorControl()
  		Create a new instance. Multiple instances can created for a single web page.
		Nothing appears on screen until open() has been called.
		
  	open(element, musicxml, options)
		Open the editor control contained in an iFrame within element in DOM.
    		element 	The DOM element, e.g. a DIV the editor control's iFrame will live in
		musicxml 	The initial score the editor will display
		options		Selected options to configure the editor's appearance and functionality
		return          promise for Editor Control Event

  	close()
		Close editor control and remove it from DOM
  
  	setScore(musicXml)
		Set the editor controls's score to musciXml
		musicXml	A MusicXML score
      		return      	promise for Editor Control Event

	getScore()
		Get the editor controls's current score (as modified by a user) as MusicXML
		return		promise for Editor Control Event

	getPdfUrl()
		Get an URL to a PDF document rendering the editor control's current score
		return      promise for Editor Control Event
   
  	playMidi(midiDataUrl)
		Play base 64 encoded standard MIDI file from string midiDataUrl

	onScoreChanged
                This variable can be set to a callback function(ev) where ev will be an
                Editor Control Event. The callback will be called any time the score has
                been changed, e.g. by user actions. 
                ev.musicxml will contain the current score

	Editor Control Event
		A resolved promise will return an editor control event. Type and errormessage are 
		mandatory, other fields are optional, depending on the type
		{ 
			type:         	<String with event type>
			errormessage: 	<String with error message>
			musicxml: 	<String with MusicXML score>,
 			pdfurl:   	<String with URL to PDF with rendering of score>
		}
