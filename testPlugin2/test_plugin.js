"use strict";

// oggetto globale contenente
// gli oggetti ractive creati onload.
// Per utilizzare i metodi ractive sui
// singoli oggetti da console: ractiveArray["#id dell'ancora"].method()
var ractiveList = {};

// variabile globale che contiene
// la lista dei template da caricare
var templatesArray = [2,12,10];


// attivo plug-in jQueryUI draggable sui vari div ancora
$(document).ready( function() {
	$('.anchor').draggable();
	
});

/**
 * Funzione che stampa nella console l'elenco
 * degli script presenti nella pagina HTML
 */
function scriptControll() {
	/* controllo dei file css caricati nella pagina
	   controllo opzionale */
	var linksArray = document.getElementsByTagName('link');
	console.log('**** CSS PRESENTI NELLA PAGINA ****');
	for (var i = 0; i < linksArray.length; i++) {
		if ( linksArray[i].rel === 'stylesheet' ) {
			var cssUrl = linksArray[i].href;
			var cssName = cssUrl.slice( cssUrl.lastIndexOf('/')+1, cssUrl.length);
			console.log('css '+i+' --> '+cssName);
		}
	}


	var scriptArray = document.scripts;
	console.log('**** SCRIPT PRESENTI NELLA PAGINA ****');
	for (var i = 0; i < scriptArray.length; i++) {
		var scriptUrl = scriptArray[i].attributes.src.value;
		var scriptName = scriptUrl.slice( scriptUrl.lastIndexOf('/')+1, scriptUrl.length);
		console.log('script '+i+' --> '+scriptName);
	}
}

/**
 * Funzione che controlla se un file .js sia già presente
 * fra gli script della pagina HTML.
 *
 * @param      {string}   library  Nome del file con estensione.
 * @return     {boolean}  true se il file è già presente fra gli script, false altrimenti.
 */
function confrontaScript(library) {
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

/**
 * Funzione che aggiunge uno script js al file HTML.
 * Se lo script è già presente non viene aggiunto.
 *
 * @param      {string}  url     L'url del file .js
 */
function addLibraryFromUrl(url) {
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

/**
 * Funzione che preleva l'url da un textbox e
 * inserisce lo script nella pagina HTML.
 */
function addLibrary() {
	// ottengo l'url dello script dal textbox
	var el = document.getElementById('plugin-lib');
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
 * Funzione che riceve un array di url relative
 * a delle librerie JavaScript, e tramite la
 * chiamata alla funzione addLibraryFromUrl()
 * le va ad aggiungere alla pagina HTML corrente.
 *
 * @param      {object}  json    The library urls json
 */
function loadLibs(json) {
	// controllo librerie da aggiungere
	var libs = json.libs;

	if (libs && libs !== undefined) { // se ci sono librerie
		for (var i = 0; i < libs.length; i++) {
			// aggiungo la libreria alla pagina HTML
			addLibraryFromUrl(libs[i]);
		}
	}
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
function loadTemplateWithInternalActivators(tmlUrl, dataUrl, libsUrl, tmlAnchor) {
	// carico le librerie del template
	$.getJSON(libsUrl, function(libs) { // se il caricamento ha successo
		// aggiungo le librerie alla pagina HTML
		loadLibs(libs);
	})
	.fail( function() { // librerie non trovate o errore di caricamento
		console.log('file non trovato o errore di caricamento!');
	})
	.always( function() { // in ogni caso
		// carico i dati del template
		$.getJSON(dataUrl, function(dati) { // se il caricamento ha successo
			// carico il template tramite Ractive.load
			Ractive.load(tmlUrl).then( function(Template) {
				// creo l'oggetto ractive
				var ractive = new Template({
					el: tmlAnchor,
					data: dati
				});

				console.log('oggetto ractive '+tmlAnchor+' creato');
				// aggiungo l'oggetto creato ad un oggetto globale
				// che fa da lista per tutti i template caricati
				ractiveList[tmlAnchor] = ractive;
			});
		})
	});
}


/**
 * Funzione che carica e renderizza un template.
 * 
 * La funzione riceve in ingresso le path dei
 * vari file che compongono il template.
 * 
 * Questa funzione deve essere utilizzata nel caso
 * in cui il template NON CONTENGA lo script di attivazione
 * del plug-in jQuery all'interno del file HTML del template
 * ma in un file esterno.
 * 
 *
 * @param      {string}  tmlUrl     The template url
 * @param      {string}  dataUrl    The template data url
 * @param      {string}  libsUrl    The template libs url
 * @param      {string}  tmlAnchor  The template id anchor
 */
function loadTemplateWithExternalActivators(tmlUrl, dataUrl, libsUrl, tmlAnchor) {

	// carico le librerie del template
	$.getJSON(libsUrl, function(libs) { // se il caricamento ha successo
		// aggiungo le librerie alla pagina HTML
		loadLibs(libs);

		// carico i dati del template
		$.getJSON(dataUrl, function(dati) { // se il caricamento ha successo
			// carico il template tramite Ractive.load
			Ractive.load(tmlUrl).then( function(Template) {
				// creo l'oggetto ractive
				var ractive = new Template({
					el: tmlAnchor,
					data: dati
				});

				console.log('oggetto ractive '+tmlAnchor+' creato');
				// aggiungo l'oggetto creato ad un oggetto globale
				// che fa da lista per tutti i template caricati
				ractiveList[tmlAnchor] = ractive;

				// aggiungo alla pagina gli script di attivazione
				// dei plug-in se presenti
				var activators = libs.activators;

				if (activators && activators !== undefined) { // se ci sono librerie
					for (var i = 0; i < activators.length; i++) {
						// aggiungo la libreria alla pagina HTML
						addLibraryFromUrl(activators[i]);
					}
				}

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
 */
function loadAllTemplate() {
	// per ogni template presente nell'array dei template
	for (var i = 0; i < templatesArray.length; i++) {
		var index = templatesArray[i];
		// creo le url
		var tmlUrl = 'templates/tml'+index+'/tml'+index+'.html';
		var dataUrl = 'templates/tml'+index+'/tml'+index+'.json';
		var libsUrl = 'templates/tml'+index+'/tml'+index+'_libs.json';
		// creo l'id ancora
		var tmlAnchor = '#tml-anchor'+(i+1);
		// carico il template index
		loadAllTypeOfTemplate(tmlUrl, dataUrl, libsUrl, tmlAnchor);
		
	}
}


// funzione che stampa in console i dati degli oggetti ractive creati
function ractiveObjects() {
	for(var item in ractiveList) {
		console.log(item);
	}
}

/***********************************************************************/

function loadAllTypeOfTemplate(tmlUrl, dataUrl, libsUrl, tmlAnchor) {
	var libsJquery = null;
	
	// carico le librerie del template
	$.getJSON(libsUrl)

	.done(function(libs){ // se il caricamento ha successo
		// aggiungo le librerie alla pagina HTML
		loadLibs(libs);

		libsJquery = libs;
		// carico i dati del template
		
	})

	.fail(function(){ // errore
		console.log('errore di caricamento o file inesistente.');
	})

	.always(function(){ // in ogni caso

		// carico i dati del template
		$.getJSON(dataUrl)

		.done(function(dati) { // se il caricamento ha successo
			// carico il template tramite Ractive.load
			Ractive.load(tmlUrl).then( function(Template) {
				// creo l'oggetto ractive
				var ractive = new Template({
					el: tmlAnchor,
					data: dati
				});
			
				console.log('oggetto ractive '+tmlAnchor+' creato');
				// aggiungo l'oggetto creato ad un oggetto globale
				// che fa da lista per tutti i template caricati
				ractiveList[tmlAnchor] = ractive;

				if (libsJquery) { // se le librerie sono presenti

					// aggiungo alla pagina gli script di attivazione
					// dei plug-in se presenti
					var activators = libsJquery.activators;

					if (activators && activators !== undefined) { // se ci sono librerie
						for (var i = 0; i < activators.length; i++) {
							// aggiungo la libreria alla pagina HTML
							addLibraryFromUrl(activators[i]);
						}
					}
					else{console.log('activator non inserito');}
				}
			});

		})

		.fail( function() { // errore caricamento, file non valido
			console.log('file JSON dati non trovato o errore di caricamento!');
			alert('Si è verificato un errore durante il caricamento della pagina!')
		});

	});
}