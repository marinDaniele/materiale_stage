'use strict';

/**
 * Parte del file editor.js relativa al controllo
 * del caricamento dei template e il loro inserimento
 * nella lista tml-list dell'editor
 */
var templatesToLoad = {
	tml: 4,
	ctml: 1,
	jtml: 3
};

var tl = new TemplateLoaderForMustache('templates');
var sc = new ScriptControllForMustache();
var tpl = new Object();

var templateAnchor = '#tml-anchor'; // id ancora per l'aggancio del template nell'editor


// array di espressioni regolari per il controllo
// dei valori di tipo string
// 0: e-mail, 1: url, 2: colore rbg(), 3: clore HEX, 4: url immagini
var regExpArray = [
	/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
	/\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi,
	/rgb\((( *0*([1]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]) *),){2}( *0*([1]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]) *)\)/,
	/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i,
	/(.+)[.]{1}(jpg|jpeg|png|gif|svg)/i
]

// regexp altennative per le url
// /(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?/i
// /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i


/**
 * Funzione che crea la lista di template
 * in base al numero di template da caricare.
 */
 function createTemplateList() {
 	// effettuo il pre load delle librerie jQuery se presenti
 	tl.preLoadWithObject(templatesToLoad);

 	// carico i template basandomi sull'oggetto templateToLoad
 	for(var type in templatesToLoad){
 		if (type === 'tml') {
 			$('#tml-list').append('<h3 class="tml-list-h3">Template singoli</h3>');
 		}
 		else if (type === 'jtml') {
 			$('#tml-list').append('<h3 class="tml-list-h3">Template singoli jQuery</h3>');
 		}
 		else if (type === 'ctml') {
 			$('#tml-list').append('<h3 class="tml-list-h3">Template composto</h3>');
 		}
 		else {
 			$('#tml-list').append('<h3 class="tml-list-h3">Template composto jQuery</h3>');
 		}
 		// carico i template di tipo type
 		loadTemplateList(type, templatesToLoad[type]);
 	}
 }


/**
 * Funzione che crea la lista dei template
 * fra cui l'utente può scegliere.
 *
 * @param      {string}  type    Tipo del template (tmlx, jtmlx, ecc..)
 * @param      {number}  num     Numero di template di tipo type
 */
function loadTemplateList(type, num) {
	// per ogni tipo di template li carico tutti
	for (var i = 1; i < num+1; i++) {
		// creo list item ancora
		var listItem = "<li class='tml-list-item' ><div class='tml-list-item-div'><a class='tml-list-item-a' onclick='selectTml(this)' href='javascript:void(0)' id='anchor-"+type+i+"'></a></div></li>";
		// appendo l'elemento alla lista
		$('#tml-list').append(listItem);

		var anchor = '#anchor-'+type+i;
		// creo l'oggetto  col template relativo
		if (type === 'tml' || type === 'ctml') { // template senza jQuery
			var html = 'templates/'+type+i+'/'+type+i+'.html';
			var dati = 'templates/'+type+i+'/'+type+i+'.json';

			// carico il template
			tl.loadTemplateWithoutJQuery(html, dati, anchor);
 		}
 		else if (type === 'jtml' || type === 'jctml') { // template senza jQuery
			var html = 'templates/'+type+i+'/'+type+i+'.html';
			var dati = 'templates/'+type+i+'/'+type+i+'.json';
			var libs = 'templates/'+type+i+'/'+type+i+'_libs.json';

			// carico il template
			tl.loadTemplateWithJQueryPlugins(html, dati, libs, anchor);
 		}
		
	}
}


/***********************************************************************
 * Parte relativa al caricamento dei template
 * selezionati nel div 'tml-anchor', parte centrale dell'editor
 */

/**
 * Funzione che recupera l'id del template selezionato
 * e gestisce la creazione del template nell'editor.
 *
 * @param      {object}  el    riferimento all'oggetto che invoca il click
 */
function selectTml(el) {
	// recupero l'id
	var id = el.id.slice(7,el.id.length); // tolgo 'anchor-' da 'anchor-*tmlx'

	document.querySelector(templateAnchor).innerHTML = null;
	
	
	// creo l'oggetto  col template relativo
	if ( id.match(/tml(\d+)/i) || id.match(/ctml(\d+)/i) ) { // template senza jQuery
		var htmlUrl = 'templates/'+id+'/'+id+'.html';
		var datiUrl = 'templates/'+id+'/'+id+'.json';
		
		// carico i dati del template
		$.getJSON(datiUrl, function(dati) { // se il caricamento ha successo
			// carico il template
			$.get(htmlUrl, function(template) {
				// render del template
				var rendered = Mustache.render(template, dati);
				// inserimento del template
				
				document.querySelector(templateAnchor).innerHTML = rendered;

				// registro i dati del template selezionato nell'editor
				tpl.html = template;
				tpl.dati = dati;

				creaTmlEditor(id,dati);
				
			});
		})
		.fail( function() { // errore caricamento, file non valido
			console.log('file non trovato o errore di caricamento!');
		});

	}
	else if ( id.match(/jtml(\d+)/i) || id.match(/jctml(\d+)/i) ) { // template senza jQuery
		var htmlUrl = 'templates/'+id+'/'+id+'.html';
		var datiUrl = 'templates/'+id+'/'+id+'.json';
		var libsUrl = 'templates/'+id+'/'+id+'_libs.json';
		
		// carico le librerie del template
		$.getJSON(libsUrl, function(libs) { // se il caricamento ha successo
			// aggiungo le librerie alla pagina HTML
			//scriptControll.loadLibs(libs);
			
			// carico i dati del template
			$.getJSON(datiUrl, function(dati) { // se il caricamento ha successo
				// carico il template
				$.get(htmlUrl, function(template) {
					// render del template
					var rendered = Mustache.render(template, dati);
					// inserimento del template
					
					document.querySelector(templateAnchor).innerHTML = rendered;

					// aggiungo alla pagina gli script di attivazione
					// dei plug-in se presenti
					var activators = libs.activators;

					if (activators && activators !== undefined) { // se ci sono librerie
						for (var i = 0; i < activators.length; i++) {
							// aggiungo la libreria alla pagina HTML
							scriptControll.addLibraryFromUrl(activators[i]);
						}
					}

					// registro i dati del template selezionato nell'editor
					tpl.html = template;
					tpl.dati = dati;

					creaTmlEditor(id,dati);
					
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

}

/**
 * Funzione che crea l'editor per la modifica
 * dei dati del template, in base al tipo di template.
 *
 * @param      {string}  type    The type
 * @param      {object}  dati    The dati
 */
function creaTmlEditor(type,dati) {
	
	// se l'editor per la modifica dati è pieno lo svuoto
	document.querySelector('#tml-editor').innerHTML = null;
	// costruisco la sezione di modifica dei dati
	// all'interno del div 'tml-editor' tramite
	// la funzione creaEditor() che ha bisogno:
	// 1 - dell'oggetto json relativo al template
	// 2 - l'elemento di partenza nel quale creare l'editor (in questo caso 'tml-editor')
	//var index = 1;
	var editorAnchor = '#tml-editor';

	
	/******************************************
	* se il template è di tipo composto
	* visualizzo solo una textarea con il json
	* tramite la funzione creaEditorOnlyJson()
	* momentaneamente controllo il tipo
	* tramite search sulla stringa, al posto
	* di passare anche il tipo a creaTmlEditor()
	*******************************************/
	if ( type.match(/ctml(\d+)/i)  || type.match(/jctml(\d+)/i)) {
		// per template composti
		creaEditorOnlyJson( dati, editorAnchor );

	}
	else {
		// per template singoli
		creaEditor( dati, editorAnchor );
	}	 	
		
}

/**
 * Funzione che crea l'editor con gli input
 * di modifica delle varie proprietà modificabili
 * del template relativo.
 *
 * @param      {object}  obj     The json object with template data
 * @param      {string}  el      The template base html anchor
 */
function creaEditor(obj, el) {
	var index = 1; // indice (di default 1) che permette di creare l'id dei div istanziati in modo ricorsivo
	
	// keypath di partenza per le proprietà del json
	var path = '';

	// invoco la funzione parse() con l'oggetto json, id dell'elemento ancora, l'indice e le espressioni regolari
	parse( obj, el, index, regExpArray, path );

	
	// controllo il tipo di dato che viene modificato
	$('.edit').change( function(event) {
		// ricavo la classe del mittente
		var elmentClass = $(this).attr('class');

		var valore = event.target.value;
		var chiave = event.target.id;

		if (elmentClass.search('json-data-color') !== -1) { // è un colore
		    // controllo la validità dell input
			if (regExpArray[2].test(valore) || regExpArray[3].test('#'+valore)) {

				// modifico il valore del campo con key chiave
				// nell'oggetto tpl
				tpl.dati[chiave] = '#'+valore;

				// render del template
				var rendered = Mustache.render(tpl.html, tpl.dati);
				// inserimento del template
				document.querySelector(templateAnchor).innerHTML = rendered;
				

				// se il test ha avuto successo e la regExp
				// contiene la flag 'g' Bisogna resettare l'indice
				regExpArray[2].lastIndex = 0;
				regExpArray[3].lastIndex = 0;
			}
			else {
				alert('Valore non valido');
			}
			
		}
		else if (elmentClass.search('json-data-email') !== -1) { // è un e-mail
			// controllo la validità dell input
			if ( regExpArray[0].test(valore) ) {
				// se è valido setto l'oggetto 
				
				// modifico il valore del campo con key chiave
				// nell'oggetto tpl
				tpl.dati[chiave] = valore;
				// render del template
				var rendered = Mustache.render(tpl.html, tpl.dati);
				// inserimento del template
				document.querySelector(templateAnchor).innerHTML = rendered;

				// se il test ha avuto successo e la regExp
				// contiene la flag 'g' Bisogna resettare l'indice
				regExpArray[0].lastIndex = 0;
			}
			else {
				alert('Valore non valido');
			}
		}
		else if (elmentClass.search('json-data-url') !== -1) { // è un URL
			// controllo la validità dell input
			if ( (regExpArray[1].test(valore) && !regExpArray[4].test(valore)) || valore === '' ) {
				// se è valido setto l'oggetto 
				
				// modifico il valore del campo con key chiave
				// nell'oggetto tpl
				tpl.dati[chiave] = valore;
				// render del template
				var rendered = Mustache.render(tpl.html, tpl.dati);
				// inserimento del template
				document.querySelector(templateAnchor).innerHTML = rendered;

				// se il test ha avuto successo e la regExp
				// contiene la flag 'g' Bisogna resettare l'indice
				regExpArray[1].lastIndex = 0;
			}
			else {
				regExpArray[1].lastIndex = 0;
				
				alert('Valore non valido');
			}
		}
		else if (elmentClass.search('json-data-img') !== -1) { // è un URL di immagine
			// controllo la validità dell input
			if ( regExpArray[4].test(valore) ) {
				
				// necessita di chiamata al server
			}
			else {
				alert('Valore non valido');
			}
		}
		else if ( (elmentClass.search('json-data-string') !== -1) || ( elmentClass.search('json-data-textarea') !== -1 )  ) { // è una stringa
			
			// modifico il valore del campo con key chiave
			// nell'oggetto tpl
			if (valore !== '' && valore !== undefined) {
				tpl.dati[chiave] = valore;
				// render del template
				var rendered = Mustache.render(tpl.html, tpl.dati);
				// inserimento del template
				document.querySelector(templateAnchor).innerHTML = rendered;
			}
			else {
				alert('Valore non valido')
			}
			
		}
		else if (elmentClass.search('json-data-number') !== -1) { // è un numero
			
			var numero = Number(valore);
			if ( numero !== NaN ) {
				
				// modifico il valore del campo con key chiave
				// nell'oggetto tpl
				tpl.dati[chiave] = numero;
				// render del template
				var rendered = Mustache.render(tpl.html, tpl.dati);
				// inserimento del template
				document.querySelector(templateAnchor).innerHTML = rendered;
			}
			else {
				alert('valore non valido');
			}
			
		}
		else if (elmentClass.search('json-data-bool') !== -1) { // è un booleano
			
			// modifico il valore del campo con key chiave
			// nell'oggetto tpl
			tpl.dati[chiave] = valore;
			// render del template
			var rendered = Mustache.render(tpl.html, tpl.dati);
			// inserimento del template
			document.querySelector(templateAnchor).innerHTML = rendered;
		}
		else{
			alert('non so');
		}
		
	});

	/*********************************************************/
	// per poter visualizzare correttamente i color pickers
	// devo istanziare un oggetto jscolor ancorato agli id #jscolor
	$('document').ready(function(){
        window.jscolor.installByClassName('jscolor');
    });
}

/**
 * Funzione che dato un oggetto json, un id di ancoraggio e un indice
 * crea un editor contenente un input per ogni coppia 'key: value'
 * presente nell'oggetto json contenente i dati del template.
 *
 * @param      {object}  obj     The json object
 * @param      {string}  el      The id of html anchor element
 * @param      {number}  index   The start index to initialize the ids of html divs
 * @param      {object}  regExpArray	The regular expression array
 * @param      {string}  path	The keypath of element
 */
function parse(obj, el, index, regExpArray, path ){

    if (obj == null || obj == undefined) {
        return;
    }
    else {

        for (var k in obj) {

            if (typeof obj[k] === 'string') { // se è una stringa
                // controllo tramite regExp il tipo della stringa
                var pos = -1;
                var trovato = false;
                
                for (var i = 0; i < regExpArray.length-1 && !trovato; i++) { // regExpArray.length-1 per non controllare le immagini
                    if ( regExpArray[i].test(obj[k]) ) {
                    	
                        trovato = true;
                        pos = i;
                        // dopo un successo, se la regExp contiene
                        // anche la flag 'g' BISOGNA resettare lastIndex
                        // dell'espressione regolare, altrimenti se
                        // il prossimo controllo dovrebbe dare un successo
                        // non lo darà falsando il risultato.
                        regExpArray[i].lastIndex = 0;
                    }
                }

                // assegno il codice HTML in base al tipo trovato
                var label = "";

                if (pos === 0) { // è una e-mail
                    label = "<label class='json-label'>"+k+": <input type='text' class='json-data-email edit' id='"+path+k+"' value='"+obj[k]+"' ></label><br>";
                }
                else if (pos === 1) { // è una URL
                    
                    if ( regExpArray[4].test(obj[k]) ) { // se true è un'immagine
                        label = "<label class='json-label'>"+k+": <input type='file' class='json-data-img edit' id='"+path+k+"' ></label><br>";
                    }
                    else {
                        label = "<label class='json-label'>"+k+": <input type='text' class='json-data-url edit' id='"+path+k+"' value='"+obj[k]+"' ></label><br>";
                    }  
                }
                else if (pos === 2 || pos === 3) { // è un colore
                    label =  "<label class='json-label'>"+k+": <span class='pick-color'>pick >> <input class='json-data-color jscolor edit' id='"+path+k+"' value='"+obj[k]+"'></span></label><br>";
                }
                else{ // è una normale stringa
                   
                   var simpleString = "<input type='text' class='json-data-string edit' id='"+path+k+"' value='"+obj[k]+"' maxLength='25' >";
                   var longText = "<textarea class='json-data-textarea edit' id='"+path+k+"'>"+obj[k]+"</textarea>";
                   var labelBefore = "<label class='json-label'>"+k+": ";
                   var labelAfter = "</label><br>";

                   if (obj[k].length > 25) { // se supera i 20 caratteri è una textarea
                   		label = labelBefore + longText + labelAfter;
                   }
                   else {
                   		label = labelBefore + simpleString + labelAfter;
                   }
                }
                
                $(el).append(label);
                
            }

            else if (typeof obj[k] === 'number') { // se è una numero
                var label = "<label class='json-label'>"+k+": <input type='number' class='json-data-number edit' id='"+path+k+"' value='"+obj[k]+"' ></label><br>";
                $(el).append(label);

            }

            else if (typeof obj[k] === 'boolean') { // se è una booleano
                var label = "<label class='json-label'>"+k+": <select class='json-data-bool edit' id='"+path+k+"'><option value='true'>true</option><option value='false'>false</option></select></label><br>";
                $(el).append(label);

            }

            else if (typeof obj[k] == 'object' && obj[k] instanceof Array) { // se è una array
                var arrayName = "<span class='array-span'> '"+ k +"' : tipo array, proprietà &emsp; &#8595;</span><div class='objDiv' id='objDiv"+ index +"'>";
                $(el).append(arrayName);
                var elOld = el; // salvo l'ancora precedente
                el = "#objDiv"+ index; // creo nuova l'ancora
                index++; // incremento index
                
                // setto il path con la key
                var temp = path;
                path = path + k +'.';

                parse(obj[k], el, index, regExpArray, path);

                path = temp;

                el = elOld; // risetto l'ancora precedente
                $(el).append('</div>');
            }

            else if (typeof obj[k] == "object" && obj[k] !== null && !(obj[k] instanceof Array) ){ // se è un object
                var objName = "<span class='array-span'> '"+ k +"' : tipo object, proprietà &emsp; &#8595;</span><div class='objDiv' id='objDiv"+ index +"'>";
                $(el).append(objName);
                var elOld = el; // salvo l'ancora precedente
                el = "#objDiv"+ index; // creo l'ancora
                index++; // incremento index
                
                // setto il path con la key
                var temp = path;
                path = path + k +'.';

                parse(obj[k], el, index, regExpArray, path);

                path = temp;
                
                el = elOld; // risetto l'ancora precedente
                $(el).append('</div>');   
            }
            else {
               var msg = "<span style='color: red;'>Tipo non riconosciuto</span>";
               $(el).append(msg);
            }
        }

    }
}


function creaEditorOnlyJson(obj, el) {

	var text = JSON.stringify(obj, null, '  ');

	var textarea = "<h4 class='ctml-editor-h4'>Json del teamplate</h4><textarea id='ctml-editor-textarea' spellcheck='false' ></textarea>";

	$(el).append(textarea);

	$('#ctml-editor-textarea').val(text);

	$('#ctml-editor-textarea').change( function() {
		var data = JSON.parse( $(this).val() );
		// rerenderizzo il template
		var rendered = Mustache.render(tpl.html, data);
		// inserimento del template
		document.querySelector(templateAnchor).innerHTML = rendered;
	});
}

