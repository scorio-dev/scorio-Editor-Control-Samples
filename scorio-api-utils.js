// 	scorio API Utils
//
//	Utility functions that can be usefull when working with scorio APIs
//
//	Copyrights scorio GmbH, Pfinztal, Germany 2017, 2021. All rights reserved.
//	Copyrights scorio WebMusic Johannes Feulner, Pfinztal, Germany 2021. All rights reserved.
//
//  http://www.scorio.com
//  info@scorio.com
//
//

scorioUtils = new Object();

// Copys contents of text area textArea into the browsers's clipboard. 
// If the value of style is 'quoted' the contents will be
// formatted as Java(-script) string, ready to be pasted into some code. 
scorioUtils.copyToClipboard = function(textArea, style) {
  let text = textArea.value;
  let textTop = textArea.scrollTop;
  if ('quoted' == style) {
	textArea.value = "\"" + text.replace(/\\/g, '\\\\').replace(/"/g, '\\\"').replace(/\n/g, "\" + \n\"") + "\"";
  }
  textArea.focus();
  
  let end = textArea.value.length;
  textArea.setSelectionRange(0, end);
  document.execCommand('copy');
  textArea.value = text;
  textArea.blur();
  textArea.scrollTop = textTop;
}

// Lets the browser download the string text as UTF-8 encoded file under the name fileName.
scorioUtils.downloadFile = function(fileName, text) {
  if ('string' != typeof fileName) {
    throw "ERROR fileName isn't a string";
  }
  if ('string' != typeof text) {
    throw "ERROR text isn't a string";
  }
  
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', fileName);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
  
 // Asynchronously calls fileContentsHandler(fileContents) after fileContents has
 // been extracted from File object file.
 scorioUtils.handleUpload = function(file, fileContentsHandler) {
  if (! file instanceof File) {
    throw "ERROR file isn't a FILE";
  }
  if (! 'function' == typeof fileContentsHandler) {
    throw "ERROR fileContentsHandler isn't a function";
  }
  
  const reader = new FileReader();
  reader.onload = ev => { 
     fileContentsHandler(ev.target.result)
       .catch(ev => { 
         window.alert("ERROR uploading file\n" + err);
       });
  };
  reader.readAsText(file);
}
  
// Returns timestamp string for local time of format YYYYMMDD-hhmmss for Date object date.
scorioUtils.localizedTimestamp = function(date) {
  if (! date instanceof Date) {
    throw "ERROR date isn't a Date";
  }
  
  const d = new Date();
  d.setTime(date.getTime() - date.getTimezoneOffset());
  const timestamp = d.getFullYear() + ("0"+(d.getMonth()+1)).slice(-2) + ("0" + d.getDate()).slice(-2) + "-" 
    + ("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2);
  return timestamp;
}

//*****************************************************************************************************************
class ScorioMusicXML { 

	constructor(musicxml) {
	  if ('string' != typeof musicxml) {
	    throw "ERROR musicxml isn't a string";
	  }
	  
	  let parser = new DOMParser();
	  this.xmlDoc = parser.parseFromString(musicxml, "text/xml"); 
	};
	
	xmlDoc = null;
	
	getXMLDoc() {
	  return this.xmlDoc;
	}
		
	getxmlParts() {
		   return this.xmlDoc.getElementsByTagName('part');
	   }
	   
	getxmlPart() {
		   return this.getxmlParts(this.xmlDoc)[0];
	   }
	   
	getxmlMeasures(xmlPart) {
		   return xmlPart.getElementsByTagName('measure');
	   }
	   
	getxmlVoice(xmlNote) {
		   return xmlNote.getElementsByTagName('voice')[0];
	   }
	   
	getxmlRest(xmlNote) {
		   return xmlNote.getElementsByTagName('rest')[0];
	   }
	   
	getxmlType(xmlNote) {
		   return xmlNote.getElementsByTagName('type')[0];
	   }
	   
	getxmlChord(xmlNote) {
		   return xmlNote.getElementsByTagName('chord')[0];
	   }
	   
	getxmlPitch(xmlNote) {
		   return xmlNote.getElementsByTagName('pitch')[0];
	   }
	   
	getxmlStep(xmlNote) {
		   let xmlPitch = this.getxmlPitch(xmlNote);
		   if (xmlPitch) {
		   		return xmlPitch.getElementsByTagName('step')[0];
		   }
		   return null;
	   }
	   
	getxmlOctave(xmlNote) {
		   let xmlPitch = this.getxmlPitch(xmlNote);
		   if (xmlPitch) {
		   	return xmlPitch.getElementsByTagName('octave')[0];
		   }
		   return null;
	   }
	   
	getxmlAlter(xmlNote) {
		   let xmlPitch = this.getxmlPitch(xmlNote);
		   if (xmlPitch) {
		   	return xmlPitch.getElementsByTagName('alter')[0];
		   }
		   return null;
	   }
	   
	getxmlNotes(xmlMeasure) {
		   return xmlMeasure.getElementsByTagName('note');   
	   }
	   
	getMidiKey(xmlNote) {
		   let midiKey = null;
		   let chromstep = -1;
		   let step = this.getxmlStep(xmlNote);
		   if (step) {
		   		switch (step.innerHTML) {
			   		case 'C': chromstep = 0; break;
			   		case 'D': chromstep = 2; break;
			   		case 'E': chromstep = 4; break;
			   		case 'F': chromstep = 5; break;
			   		case 'G': chromstep = 7; break;
			   		case 'A': chromstep = 9; break;
			   		case 'B': chromstep = 11; break;
		   		}
		   		
		   		let xmlAlter = this.getxmlAlter(xmlNote);
		   		if (xmlAlter) {
		   			chromstep = chromstep + parseInt(xmlAlter.innerHTML);
		   		}
		   		
		   		midiKey = chromstep + 12 * parseInt(this.getxmlOctave(xmlNote).innerHTML);
		   }
		   return midiKey;
	   }
	   
	getVoice() {
		   let xmlPart = this.getxmlPart();
		   let xmlMeasures = this.getxmlMeasures(xmlPart);
		   let xmlFirstMeasure = xmlMeasures[0];
		   let xmlFirstNote = this.getxmlNotes(xmlFirstMeasure)[0];
		   if (!xmlFirstNote) {
			   return [];
		   }
		   let xmlFirstVoice = this.getxmlVoice(xmlFirstNote);
		   let firstVoice = [];
		   for (let xmlMeasure of xmlMeasures) {
			   for (let xmlNote of this.getxmlNotes(xmlMeasure)) {
				   if (xmlFirstVoice.innerHTML == this.getxmlVoice(xmlNote).innerHTML) {
					   if (this.getxmlChord(xmlNote)) {
						   firstVoice[firstVoice.length - 1].push(xmlNote);
					   } else {
						   	let chords = [];
						   	chords.push(xmlNote);
			  				firstVoice.push(chords);
					   }
				   }
			   }
		   }
		   return firstVoice;
	   }
	   
	getMelody() {
		   let firstMelody = this.getVoice(this.xmlScore).map(chord => this.getHighestNote(chord))
		   console.info("XXX firstMeldoy: ", firstMelody);
		   return firstMelody;
	   }
	   
	getHighestNote(chord) {
		   return chord.reduce((accu, current) => { 
			   if (accu.midiKey < current.midiKey) {
				   return current;
			   } else {
				   return accu;
			   }
		   });
	   }
	   
	//check if value is primiprototypetive
	isPrimitive(obj) {
	       return (obj !== Object(obj));
	   }
	   
	deepEqual(obj1, obj2) {
	
		    if(obj1 === obj2) // it's just the same object. No need to compare.
		        return true;
	
		    if(this.isPrimitive(obj1) && this.isPrimitive(obj2)) // compare primitives
		        return obj1 === obj2;
	
		    if(Object.keys(obj1).length !== Object.keys(obj2).length)
		        return false;
	
		    // compare objects with same number of keys
		    for(let key in obj1)
		    {
		        if(!(key in obj2)) return false; //other object doesn't have this prop
		        if(!this.deepEqual(obj1[key], obj2[key])) return false;
		    }
	
		    return true;
	   }
	   
	scoreEquals(solution) {
	    	let parser = new DOMParser();
		    let solutionDoc = parser.parseFromString(solution, "text/xml"); //important to use "text/xml"
	   		
	   		let scoreVoice = this.getVoice();
	   	 	let solutionVoice = this.getVoice(solutionDoc);
	   		
	   		if (scoreVoice.length != solutionVoice.length) { // not a posiible prefix?
	   			return false;
	   		}
	   		return this.scoreEqualsPrefix(solution);
	   }
	   
	scoreEqualsPrefix(solution) {
			 let parser = new DOMParser();
		     let solutionDoc = parser.parseFromString(solution, "text/xml"); //important to use "text/xml"
		     
		     let scoreVoice = this.getVoice();
		     let solutionVoice = this.getVoice(solutionDoc);
		     this.log("xmlScore voice: ", this.getVoice());
		     this.log("solution voice: ", this.getVoice(solutionDoc));
		     
		     if (solutionVoice.length < scoreVoice.length) { 
		     	// solution is too long for being a prefix
	   			return false;
	   		 }
	   		
		     if (0 < scoreVoice.length) { // there is at least one chord	        
				  for(let i = 0; i < scoreVoice.length; i++) {
					 let scoreChord = scoreVoice[i];
					 let solutionChord = solutionVoice[i];
					 if (scoreVoice[0].length == solutionVoice[0].length) { // same number of notes in chord
						 for(let scoreNote of scoreChord) {
							 let noteFound = false;
							 for (let solutionNote of solutionChord) {
								 if (this.deepEqual(scoreNote, solutionNote)) {
									 noteFound = true;
									 break;
								 }
							 }
							 if (!noteFound) {
								 return false;
							 }
						 }
		     		 } else {
		     			 return false;
		     		 }
				  }
				  return true;
			 }
		     return false;
	    }
	
	midiKey(xmlNote) {
		return this.getMidiKey(xmlNote);
	}
	isRest(xmlNote) { 
		return this.getxmlRest(xmlNote) ? true : false; 
	};
	type(xmlNote) {
	  return this.getxmlType(xmlNote).innerHTML;
	}
	voice(xmlNote) {
	  return this.getxmlVoice(xmlNote).innerHTML;
	}
	voice(xmlNote) {
	  return this.getxmlVoice(xmlNote).innerHTML;
	}
	step(xmlNote) { 
		return this.getxmlStep(xmlNote) ? this.getxmlStep(xmlNote).innerHTML : ""; 
	};
	octave(xmlNote) { 
	  return this.getxmlOctave(xmlNote) ? this.getxmlOctave(xmlNote).innerHTML : "0"; 
	};
	alter(xmlNote) { 
	  return this.getxmlAlter(xmlNote) ? this.getxmlAlter(xmlNote).innerHTML : "0"; 
	};
	noteName(xmlNote) {
	  const name = "";
	  if (this.isRest(xmlNote)) {
	    name = "Rest";
	  } else {
	    let alterSymbol = "";
	    const alter = parseInt(this.alter(xmlNote));
	  	switch(alter) {
	  	  case -2: alterSymbol = '𝄫'; break;
	  	  case -1: alterSymbol = '♭'; break;
	  	  case 1: alterSymbol = '♯'; break;
	  	  case 2: alterSymbol = '𝄪'; break;
	  	  default:
	  	    if (2 < alter) {
	  	      alterSymbol = '+' + alter;
	  	    } else if (alter < -2) {
	  	      alterSymbol = alter;
	  	     }
	  	}
	  	return this.step(xmlNote) + this.octave(xmlNote) + alterSymbol; 
	  }
	};

} // class ScorioMusicXML
 	   
  
  