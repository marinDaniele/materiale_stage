"use strict";

/**
 * Template loader for Mustache.js library
 *
 * @class      TemplateLoaderForMustache (name)
 * @param      {string}                              tplPath  The templates directory path
 * @return     {(Constructor|Object|number|string)}  { description_of_the_return_value }
 */
function TemplateLoaderForMustache(tplPath) {

	// campi dati privati
	var scriptControll = new ScriptControllForMustache();
	var tplList = {};
	var anchorId = 'tml-anchor';
	var templatesPath = typeof tplPath !== undefined ? tplPath : '';

	
	/**
	 * Creates a new instance of the object with same properties than original.
	 *
	 * @param      {object}  objectToBeCloned  The object to be cloned
	 * @return     {object}  Copy of this object.
	 */
	function clone(objectToBeCloned) {
		// Shallow copy
		//var newObject = jQuery.extend({}, objectToBeCloned);

		// Deep copy
		var newObject = jQuery.extend(true, {}, objectToBeCloned);

		return newObject;
	}

	/**
	 * Funzione che carica e renderizza un template.
	 * 
	 * La funzione riceve in ingresso le path dei
	 * vari file che compongono il template.
	 * 
	 * Questa funzione deve essere utilizzata nel caso
	 * in cui il template NON CONTENGA script jQuery.
	 * (caso di Mustache.js)
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
			// carico il template tramite 
			$.get(tmlUrl, function(template) {
				// render del template
				var rendered = Mustache.render(template, dati);
				// inserimento del template
				document.querySelector(tmlAnchor).innerHTML = rendered;

				// aggiungo all'oggetto template list
				tplList[tmlAnchor] = {};
				tplList[tmlAnchor].html = template;
				tplList[tmlAnchor].dati = dati;
				
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
	 * in cui il template CONTENGA script jQuery.
	 * (caso di Mustache.js)
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
			// decommentare se non si effettua il pre-load ( metodo preLoad() )
			//scriptControll.loadLibs(libs);
			
			// carico i dati del template
			$.getJSON(dataUrl, function(dati) { // se il caricamento ha successo
				// carico il template tramite Ractive.load
				$.get(tmlUrl, function(template) {
					// render del template
					var rendered = Mustache.render(template, dati);
					// inserimento del template
					document.querySelector(tmlAnchor).innerHTML = rendered;

					// aggiungo alla pagina gli script di attivazione
					// dei plug-in se presenti
					var activators = libs.activators;

					if (activators && activators !== undefined) { // se ci sono librerie
						for (var i = 0; i < activators.length; i++) {
							// aggiungo la libreria alla pagina HTML
							scriptControll.addLibraryFromUrl(activators[i]);
						}
					}

					// aggiungo all'oggetto template list
					tplList[tmlAnchor] = {};
					tplList[tmlAnchor].html = template;
					tplList[tmlAnchor].dati = dati;
					tplList[tmlAnchor].libs = libs;
				});
			})
			.fail( function() { // errore caricamento, file non valido
				console.log('file non trovato o errore di caricamento!');
			});
			
		})
		.fail( function() { // librerie non trovate o errore di caricamento
			console.log('file non trovato o errore di caricamento!');
		});
	}


	/**
	 * Funzione che carica e renderizza tutti i template presenti
	 * nell'array dei template.
	 * (sarebbe meglio leggere la directory templates)
	 * 
	 * 
	 * @param      {object} templateArray	Arrai dei template da caricare
	 */
	this.loadAllTemplate = function(templateArray) {

		// per ogni template presente nell'array dei template
		for (var i = 0; i < templateArray.length; i++) {
			var tml = templateArray[i];

			// creo l'id ancora
			var tmlAnchor = '#'+anchorId+(i+1);

			if (tml.match(/jtml(\d+)/i) || tml.match(/jctml(\d+)/i)) {
				// creo le url
				var tmlUrl = templatesPath+'/'+tml+'/'+tml+'.html';
				var dataUrl = templatesPath+'/'+tml+'/'+tml+'.json';
				var libsUrl = templatesPath+'/'+tml+'/'+tml+'_libs.json';
	
				this.loadTemplateWithJQueryPlugins(tmlUrl, dataUrl, libsUrl, tmlAnchor);

			}
			else {
				var tmlUrl = templatesPath+'/'+tml+'/'+tml+'.html';
				var dataUrl = templatesPath+'/'+tml+'/'+tml+'.json';

				this.loadTemplateWithoutJQuery(tmlUrl, dataUrl, tmlAnchor);
			}	
		}
	}


	/************* funzioni test per precaricamento librerie *************/

	/**
	 * Funzione che carica le librerie jQuery di un template.
	 *
	 * @param      {string}  type    Tipo del template (tmlx, jtmlx, ecc..)
	 * @param      {number}  num     Numero di template di tipo type
	 */
	function libraryLoad(type, num) {
		for (var i = 1; i < num+1; i++) {
			var libsUrl = templatesPath+'/'+type+i+'/'+type+i+'_libs.json';
			$.getJSON(libsUrl, function(lib){
				// carico le librerie jQuery
				scriptControll.loadLibs(lib);
			});
		}
	}

	/**
	 * Funzione che effettua un caricamento delle librerie
	 * jQuery utilizzate dai template elencati nell'oggetto
	 * templateToLoad.
	 * L'oggetto è formato dalle coppie key:value, dove
	 * key rappresenta il tipo di template e value rappresenta
	 * il numero di template.
	 * 
	 * es.: {tml: 3, ctml: 2, jtml: 4, jctml: 1}
	 *
	 * @param      {object}  templatesToLoad  The templates to load
	 */
	this.preLoadWithObject = function(templatesToLoad){
		// per ogni template che necessita del
		// caricamento di librerie, carico le librerie
		for(var type in templatesToLoad) {
			if (type === 'jtml' || type === 'jctml') {
				libraryLoad(type, templatesToLoad[type]);
			}
		}
	}

	/**
	 * Funzione che effettua un caricamento delle librerie
	 * jQuery in base al nome dei template presenti nell'array
	 * templateArray.
	 * 
	 * es.: ['tml1', 'jtml2', 'jctml3', 'ctml4']
	 *
	 * @param      {object}  templatesArray  The templates to load
	 */
	this.preLoadWithArray = function(templateArray){
		// per ogni template che necessita del
		// caricamento di librerie, carico le librerie
		for (var i = 0; i < templateArray.length; i++) {
			var tml = templateArray[i];

			if (tml.match(/jtml(\d+)/i) || tml.match(/jctml(\d+)/i)) {
				// creo le url
				var libsUrl = templatesPath+'/'+tml+'/'+tml+'_libs.json';
				
				$.getJSON(libsUrl, function(lib){
					// carico le librerie jQuery
					scriptControll.loadLibs(lib);
				});
			}
		}
	}
	/******************************************************************/


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
	 * Gets the templates path.
	 *
	 * @return     {string}  The templates directory path.
	 */
	this.getTemplatesPath = function() {
		return templatesPath;
	}

	/**
	 * Sets the templates directory Path.
	 *
	 * @param      {string}  path     The templates directory path.
	 */
	this.setTemplatesPath = function(path) {
		templatesPath = path;
	}

	/**
	 * Funzione che stampa in console l'elenco delle chiavi
	 * degli oggetti che sono stati inseriti nella tplList
	 * alla fine della costruzione.
	 */
	this.printTplList = function() {
		for(var item in tplList) {
			console.log(item);
		}
	}

	/**
	 * Gets the template list object clone.
	 *
	 * @return     {object}  The template list object.
	 */
	this.getTplList = function() {
		return clone(tplList);
	}

}