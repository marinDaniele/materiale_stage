"use strict";

function ScriptControl(){
	
	// funzione di utilizzo privata
	var confrontaScript = function confrontaScript(library) {
		var scriptArray = document.scripts;
		var trovato = false;
		for (var i = 0; i < scriptArray.length && !trovato; i++) {
			var scriptUrl = scriptArray[i].attributes.src.value;
			var scriptName = scriptUrl.slice( scriptUrl.lastIndexOf('/')+1, scriptUrl.length);
			if (scriptName === library) {
				trovato = true;
				//console.log('lo script '+library+' è già presente!');
			}
		}
		return trovato;
	}

	// metodi
	this.addLibraryFromUrl = function(url) {
		var libraryUrl = url;
		var libraryName = libraryUrl.slice( libraryUrl.lastIndexOf('/')+1, libraryUrl.length );

		if (!confrontaScript(libraryName)) {
			var node = document.createElement('script');
			node.setAttribute('src', libraryUrl);
			document.head.appendChild(node);
			console.log('libreria '+libraryName+' aggiunta al file HTML');
		}
		else {
			console.log('libreria '+libraryName+' gia presente nel file HTML');
		}

	}

	this.addLibraryFromElementId = function(elementId) {
		// ottengo l'url dello script dal textbox
		var el = document.getElementById(elementId);
		var libraryUrl = el.value;
		
		// controllo che non sia vuoto
		if (libraryUrl !== '' && libraryUrl !== undefined) {
			// richiamo la funzione per l'inserimento dello script
			console.log('provo ad aggiungere libreria '+libraryUrl);
			addLibraryFromUrl( libraryUrl );
		}
		else {
			// valore non valido
			alert('Il valore inserito non è valido');
		}

	}

	this.scriptList = function() {
		var scriptArray = document.scripts;
		console.log('**** SCRIPT PRESENTI NELLA PAGINA ****');
		for (var i = 0; i < scriptArray.length; i++) {
			var scriptUrl = scriptArray[i].attributes.src.value;
			var scriptName = scriptUrl.slice( scriptUrl.lastIndexOf('/')+1, scriptUrl.length);
			console.log('script '+i+' --> '+scriptName);
		}
	}

	this.getScriptList = function() {
		var scriptArray = document.scripts;
		return scriptArray;
	}
}