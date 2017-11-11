"use strict";

function ScriptControllForMustache(){
	
	// funzione di utilizzo privata
	
	/**
	 * Funzione che controlla se uno script è già stato inserito nella pagina
	 * HTML.
	 *
	 * @param      {string}   library  Nome del file della libreria.
	 * @return     {boolean}  true se lo script è gia presente, false altrimenti.
	 */
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

	// metodi pubblici

	/**
	 * Funzione che controlla se uno script è presente nella pagina HTML,
	 * prendendo in ingresso il path del file nel filesystem.
	 *
	 * @param      {string}   url     Path del file .js nel filesystem.
	 * @return     {boolean}  true se il file è gia presente, false altrimenti.
	 */
	this.confrontaScriptByUrl = function(url) {
		var libraryUrl = url;
		var libraryName = libraryUrl.slice( libraryUrl.lastIndexOf('/')+1, libraryUrl.length );
		return confrontaScript(libraryName);
	}

	
	/**
	 * Adds a library from url.
	 *
	 * @param      {string}  url     The script js path.
	 */
	this.addLibraryFromUrl = function(url) {
		var libraryUrl = url;
		var libraryName = libraryUrl.slice( libraryUrl.lastIndexOf('/')+1, libraryUrl.length );

		if (!confrontaScript(libraryName)) {
			var node = document.createElement('script');
			node.setAttribute('src', libraryUrl);
			//node.setAttribute('async', false);
			document.head.appendChild(node);
			console.log('libreria '+libraryName+' aggiunta al file HTML');
		}
		else {
			console.log('libreria '+libraryName+' gia presente nel file HTML');
		}

	}

	/**
	 * Funzione che riceve la path dello script .js dal valore
	 * di un elemento input HTML.
	 *
	 * @param      {string}  elementId  The element identifier
	 */
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

	/**
	 * Funzione che stampa in console la lista degli
	 * script presenti nella pagina.
	 */
	this.scriptList = function() {
		var scriptArray = document.scripts;
		console.log('**** SCRIPT PRESENTI NELLA PAGINA ****');
		for (var i = 0; i < scriptArray.length; i++) {
			var scriptUrl = scriptArray[i].attributes.src.value;
			var scriptName = scriptUrl.slice( scriptUrl.lastIndexOf('/')+1, scriptUrl.length);
			console.log('script '+i+' --> '+scriptName);
		}
	}

	/**
	 * Funzione che restituisce l'array contenente
	 * la lista degli scripr presenti nella pagina.
	 *
	 * @return     {object}  The script list.
	 */
	this.getScriptList = function() {
		var scriptArray = document.scripts;
		return scriptArray;
	}

	/**
	 * Funzione che riceve un array di url relative
	 * a delle librerie JavaScript, e tramite la
	 * chiamata alla funzione addLibraryFromUrl()
	 * le va ad aggiungere alla pagina HTML corrente.
	 *
	 * @param      {object}  json    The library urls json
	 */
	this.loadLibs = function(json) {
		// controllo librerie da aggiungere
		var libs = json.libs;

		if (libs && libs !== undefined) { // se ci sono librerie
			for (var i = 0; i < libs.length; i++) {
				// aggiungo la libreria alla pagina HTML
				this.addLibraryFromUrl(libs[i]);
			}
		}
	}
}