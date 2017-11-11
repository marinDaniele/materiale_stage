"use strict";

function TemplateLoader(templatesUrl) {

	// campi dati privati
	var scriptControll = new ScriptControll();
	var ractiveList = {};
	var anchorId = 'tml-anchor';
	var templatesPath = typeof templatesUrl !== undefined ? templatesUrl : [];

	// metodi privati
	
	function clone(objectToBeCloned) {
	  // Basis.
	  if (!(objectToBeCloned instanceof Object)) {
	    return objectToBeCloned;
	  }

	  var objectClone;
	  
	  // Filter out special objects.
	  var Constructor = objectToBeCloned.constructor;
	  switch (Constructor) {
	    // Implement other special objects here.
	    case RegExp:
	      objectClone = new Constructor(objectToBeCloned);
	      break;
	    case Date:
	      objectClone = new Constructor(objectToBeCloned.getTime());
	      break;
	    default:
	      objectClone = new Constructor();
	  }
	  
	  // Clone each property.
	  for (var prop in objectToBeCloned) {
	    objectClone[prop] = clone(objectToBeCloned[prop]);
	  }
	  
	  return objectClone;
	}

	function loadJQueryTemplate(tmlUrl, dataUrl, libs, tmlAnchor) {
		// carico i dati del template
		$.getJSON(dataUrl, function(dati) { // se il caricamento ha successo
			// carico il template tramite Ractive.load
			Ractive.load(tmlUrl).then( function(Template) {
				// creo l'oggetto ractive
				var ractive = new Template({
					el: tmlAnchor,
					data: dati
				});

				// aggiungo l'oggetto creato ad un oggetto globale
				// che fa da lista per tutti i template caricati
				ractiveList[tmlAnchor] = ractive;

				// aggiungo alla pagina gli script di attivazione
				// dei plug-in se presenti
				var activators = libs.activators;

				if (activators && activators !== undefined) { // se ci sono librerie
					for (var i = 0; i < activators.length; i++) {
						// aggiungo la libreria alla pagina HTML
						scriptControll.addLibraryFromUrl(activators[i]);
					}
				}

			});
		})
		.fail( function() { // errore caricamento, file non valido
			console.log('file non trovato o errore di caricamento!');
		});
	}

	/**
	 * Funzione che carica e renderizza un template.
	 * 
	 * La funzione riceve in ingresso le path dei
	 * vari file che compongono il template.
	 * 
	 * Questa funzione deve essere utilizzata nel caso
	 * in cui il template CONTENGA lo script di attivazione
	 * del plug-in jQuery all'interno del file HTML del template
	 * e non in un file esterno.
	 * 
	 *
	 * @param      {string}  tmlUrl     The template url
	 * @param      {string}  dataUrl    The template data url
	 * @param      {string}  libsUrl    The template libs url
	 * @param      {string}  tmlAnchor  The template id anchor
	 */
	this.loadTemplateWithoutJQuery = function(tmlUrl, dataUrl, tmlAnchor) {
		// carico i dati del template
		$.getJSON(dataUrl, function(dati) { // se il caricamento ha successo
			// carico il template tramite Ractive.load
			Ractive.load(tmlUrl).then( function(Template) {
				// creo l'oggetto ractive
				var ractive = new Template({
					el: tmlAnchor,
					data: dati
				});

				// aggiungo l'oggetto creato ad un oggetto globale
				// che fa da lista per tutti i template caricati
				ractiveList[tmlAnchor] = ractive;
				
			});
		})
		.fail( function() { // errore caricamento, file non valido
			console.log('file non trovato o errore di caricamento!');
		});
		
	}


	/**
	 * Funzione che carica e renderizza un template.
	 * 
	 * La funzione riceve in ingresso le path dei
	 * vari file che compongono il template.
	 * 
	 * Questa funzione deve essere utilizzata nel caso
	 * in cui il template CONTENGA script per plug-in 
	 * jQuery all'interno del file HTML del template, o 
	 * all'esterno, in un file js separato.
	 * 
	 *
	 * @param      {string}  tmlUrl     The template url
	 * @param      {string}  dataUrl    The template data url
	 * @param      {string}  libsUrl    The template libs url
	 * @param      {string}  tmlAnchor  The template id anchor
	 */
	this.loadTemplateWithJQueryPlugins = function(tmlUrl, dataUrl, libsUrl, tmlAnchor) {

		// carico le librerie del template
		$.getJSON(libsUrl, function(libs) { // se il caricamento ha successo
			// aggiungo le librerie alla pagina HTML
			scriptControll.loadLibs(libs);
			console.log('lib aggiunta '+libs.libs[0]);
			/*********************************************************/
			// test per vedere quando la libreria è effettivamente caricata
			if (!scriptControll.confrontaScriptByUrl(libs.libs[0])) {
				var myScript = document.querySelector("script[src='"+libs.libs[0]+"']");
				console.log(myScript);
				myScript.onload = function() {
					
					loadJQueryTemplate(tmlUrl,dataUrl,libs,tmlAnchor);
				}
			}
			else {
				loadJQueryTemplate(tmlUrl,dataUrl,libs,tmlAnchor);
			}
			
			
		})
		.fail( function() { // librerie non trovate o errore di caricamento
			console.log('file non trovato o errore di caricamento!');
		});
	}


	// metodi pubblici

	/**
	 * Funzione che carica e renderizza tutti i template presenti
	 * nell'array dei template.
	 * (sarebbe meglio leggere la directory templates)
	 * 
	 * 
	 * @param      {object} templateArray Arrai dei template da caricare
	 */
	this.loadAllTemplate = function(templateArray) {

		// per ogni template presente nell'array dei template
		for (var i = 0; i < templatesArray.length; i++) {
			var tml = templatesArray[i];

			// creo l'id ancora
			var tmlAnchor = '#'+anchorId+(i+1);

			if (tml.match(/jtml(\d+)/i)) {
				// creo le url
				var tmlUrl = templatesPath+'/'+tml+'/'+tml+'.html';
				var dataUrl = templatesPath+'/'+tml+'/'+tml+'.json';
				var libsUrl = templatesPath+'/'+tml+'/'+tml+'_libs.json';

				loadTemplateWithJQueryPlugins(tmlUrl, dataUrl, libsUrl, tmlAnchor);
			}
			else {
				var tmlUrl = templatesPath+'/'+tml+'/'+tml+'.html';
				var dataUrl = templatesPath+'/'+tml+'/'+tml+'.json';

				loadTemplateWithoutJQuery(tmlUrl, dataUrl, tmlAnchor);
			}	
		}
	}

	/**
	 * Gets the anchor identifier.
	 *
	 * @return     {string}  The anchor identifier.
	 */
	this.getAnchorId = function() {
		return anchorId;
	}

	/**
	 * Sets the anchor identifier.
	 *
	 * @param      {string}  id      The identifier
	 */
	this.setAnchorId = function(id) {
		anchorId = id;
	}

	/**
	 * Gets the templates url.
	 *
	 * @return     {string}  The templates url.
	 */
	this.getTemplatesUrl = function() {
		return templatesPath;
	}

	/**
	 * Sets the templates url.
	 *
	 * @param      {string}  url     The url
	 */
	this.setTemplatesUrl = function(url) {
		templatesPath = url;
	}

	
	/**
	 * Funzione che stampa in console l'elenco delle chiavi
	 * degli oggetti che sono stati inseriti nella ractiveList
	 * alla fine della costruzione.
	 */
	this.printRactiveList = function() {
		for(var item in ractiveList) {
			console.log(item);
		}
	}

}