'use strict'

/**
 * Parte del file editor.js relativa al controllo
 * del caricamento dei template e il loro inserimento
 * nella lista tml-list dell'editor
 */

var numTemplatesS = 2; // numero dei template singoli da caricare (ideale calcolarlo in automatico)
var numTemplatesC = 1; // numero dei template composti da caricare (ideale calcolarlo in automatico)

var ractiveArray = []; // andrà a contenere i vari oggetti ractive della lista

var ractive = null; // riferimento al template caricato nell'editor

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

/**
 * Funzione che crea la lista di template
 * in base al numero di template da caricare.
 */
function loadList() {
	$('#tml-list').append('<h3 class="tml-list-h3">Template singoli</h3>')
	// carico i template singoli
	for (var i = 1; i < numTemplatesS+1; i++) {
		// creo list item ancora
		var listItem = "<li class='tml-list-item' ><div class='tml-list-item-div'><a class='tml-list-item-a' onclick='selectTml(this)' href='javascript:void(0)' id='tml"+i+"'></a></div></li>";
		// appendo l'elemento alla lista
		$('#tml-list').append(listItem);
		// creo l'oggetto ractive col template relativo
		// type 0: template singoli tml'x'.html, 1: template composti ctml'x'.html
		loadTemplates( i , 0);
	}

	$('#tml-list').append('<h3 class="tml-list-h3">Template composti</h3>')
	// carico i template singoli
	for (var i = 1; i < numTemplatesC+1; i++) {
		// creo list item ancora
		var listItem = "<li class='tml-list-item' ><div class='tml-list-item-div'><a class='tml-list-item-a' onclick='selectTml(this)' href='javascript:void(0)' id='ctml"+i+"'></a></div></li>";
		// appendo l'elemento alla lista
		$('#tml-list').append(listItem);
		// creo l'oggetto ractive col template relativo
		// type 0: template singoli tml'x'.html, 1: template composti ctml'x'.html
		loadTemplates( i , 1);
	}

}

/**
 * Funzione che crea un oggetto ractive
 * in base all'indice del template in posizione pos.
 * es.: pos=1 --> template 'tml1'.
 *
 * @param      {number}  pos     The position of the current template
 * @param      {number}  type    The type of template category
 */
function loadTemplates(pos, type){
	var dir = '';
	if (type === 0) {
		dir = 'tml';
	}
	else if (type === 1) {
		dir = 'ctml';
	}
	else {
		console.log('tipo non valido');
		return;
	}
    var templateUrl = "templates/"+dir+pos+"/"+dir+pos+".html";
    var jsonUrl = "templates/"+dir+pos+"/"+dir+pos+".json";
    
    console.log('inizio a caricati i dati');
    // carico il json e l'HTML del template corrente
    $.getJSON(jsonUrl, function(json) {

    	Ractive.load(templateUrl).then(function(Template){
	        var tmlId = dir+pos;
	        // creo un'istanza ractive del template
	        ractiveArray[pos-1] = new Template({
	            el: tmlId,
	            data: json
	        });
	    });

    });  
}

/*
 * Parte relativa al caricamento dei template
 * selezionati nel div 'tml-anchor', parte centrale dell'editor
 */

/**
 * Funzione che recupera l'id del template selezionato
 * e gestisce la creazione del template nell'editor.
 *
 * @param      {reference}  el    riferimento all'oggetto che invoca il click
 */
function selectTml(el) {
	// recupero l'id
	var id = el.id;
	// creo le url per il template
	var tmlUrl = 'templates/'+id+'/'+id+'.html';
	var jsonUrl = 'templates/'+id+'/'+id+'.json';

	// richiamo la funzione creaTml per la creazione del template
	creaTml( tmlUrl, jsonUrl );
}

/**
 * Funzione che crea un istanza ractive, partendo
 * da due url.
 *
 * @param      {string}  htmlUrl  The html url
 * @param      {string}  jsonUrl  The json url
 */
function creaTml(htmlUrl, jsonUrl) {
	// carico il template e il json
	$.getJSON(jsonUrl, function(json) {
		
		Ractive.load(htmlUrl).then( function(Tml) {
			
			ractive = new Tml({
				el: templateAnchor,
				data: json
			});

		});

		// se l'editor per la modifica dati è pieno lo svuoto
		$('#tml-editor').empty();
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
		* tramite la funzione creaEditorFullJson()
		* momentaneamente controllo il tipo
		* tramite search sulla stringa, al posto
		* di passare anche il tipo a creaTml()
		*******************************************/
		if ( htmlUrl.search('ctml') !== -1 ) {
			// per template composti
			creaEditorFullJson( json, editorAnchor );


		}
		else {
			// per template singoli
			creaEditor( json, editorAnchor );

			// controllo il tipo di dato che viene modificato
			$('.edit').change( function(event) {
				// ricavo la classe del mittente
				var elmentClass = $(this).attr('class');

				var valore = event.target.value;
				var chiave = event.target.id;

				if (elmentClass.search('json-data-color') !== -1) { // è un colore
				    // controllo la validità dell input
					if (regExpArray[2].test(valore) || regExpArray[3].test('#'+valore)) {
						// se è valido setto l'oggetto ractive
						ractive.set(chiave, '#'+valore);

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
						// se è valido setto l'oggetto ractive
						ractive.set(chiave, valore);

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
						// se è valido setto l'oggetto ractive
						ractive.set(chiave, valore);

						// se il test ha avuto successo e la regExp
						// contiene la flag 'g' Bisogna resettare l'indice
						regExpArray[1].lastIndex = 0;
					}
					else {
						regExpArray[1].lastIndex = 0;
						console.log(valore);
						alert('Valore non valido');
					}
				}
				else if (elmentClass.search('json-data-img') !== -1) { // è un URL di immagine
					// controllo la validità dell input
					if ( regExpArray[4].test(valore) ) {
						/******************************************
						* soluzione temporanea per il caricamento
						* e visuallizzazione dei file immagine
						*******************************************/
						// creo un file system temporaneo nel browser
						window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
						window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, function(fs){
							var f = event.target.files[0];
							console.log(f);
							fs.root.getFile(f.name, {create: true, exclusive: true}, function(fileEntry) {
								fileEntry.createWriter(function(fileWriter) {
									fileWriter.write(f);
									var fUrl = fileEntry.toURL();
									console.log(fUrl);
									ractive.set(chiave, fUrl);
								});
							});
						});
						/*****************************************/
						// se è valido setto l'oggetto ractive
						//ractive.set(chiave, valore);
					}
					else {
						alert('Valore non valido');
					}
				}
				else if ( (elmentClass.search('json-data-string') !== -1) || ( elmentClass.search('json-data-textarea') !== -1 )  ) { // è una stringa
					// se è valido setto l'oggetto ractive
					ractive.set(chiave, valore);
				}
				else if (elmentClass.search('json-data-number') !== -1) { // è un numero
					
					var numero = Number(valore);
					if ( numero !== NaN ) {
						// se è valido setto l'oggetto ractive
						ractive.set(chiave, numero);
					}
					else {
						alert('valore non valido');
					}
					
				}
				else if (elmentClass.search('json-data-bool') !== -1) { // è un booleano
					// se è valido setto l'oggetto ractive
					ractive.set(chiave, valore);
				}
				else{
					alert('non so');
				}
				
			});
		} 		

	});
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

	// per poter visualizzare correttamente i color pickers
	// devo istanziare un oggetto jscolor ancorato agli id #jscolor
	$('document').ready(function(){
            window.jscolor.installByClassName('jscolor');
    });
}

/**
 * Funzione che dato un oggetto json, un id di ancoraggio e un indice
 * crea un editor contenente un input per ogni coppia 'key: value'
 * presente nell'oggetto json.
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
                    label = "<label class='json-label'>"+k+": <input type='text' class='json-data-email edit' id='"+path+k+"' placeholder='"+typeof obj[k]+" - email' ></label><br>";
                }
                else if (pos === 1) { // è una URL
                    
                    if ( regExpArray[4].test(obj[k]) ) { // se true è un'immagine
                        label = "<label class='json-label'>"+k+": <input type='file' class='json-data-img edit' id='"+path+k+"' ></label><br>";
                    }
                    else {
                        label = "<label class='json-label'>"+k+": <input type='text' class='json-data-url edit' id='"+path+k+"' placeholder='"+typeof obj[k]+" - URL' ></label><br>";
                    }  
                }
                else if (pos === 2 || pos === 3) { // è un colore
                    label =  "<label class='json-label'>"+k+": <span class='pick-color'>pick a color >> <input class='json-data-color jscolor edit' id='"+path+k+"'></span></label><br>";
                }
                else{ // è una normale stringa
                   
                   var simpleString = "<input type='text' class='json-data-string edit' id='"+path+k+"' placeholder='"+typeof obj[k]+"' maxLength='25' >";
                   var longText = "<textarea class='json-data-textarea edit' id='"+path+k+"' placeholder='inserire del testo'></textarea>";
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
                var label = "<label class='json-label'>"+k+": <input type='number' class='json-data-number edit' id='"+path+k+"' placeholder='"+typeof obj[k]+"' ></label><br>";
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


function creaEditorFullJson(obj, el) {
	var text = JSON.stringify(obj, null, '  ');

	var textarea = "<h4 class='ctml-editor-h4'>Json del teamplate</h4><textarea id='ctml-editor-textarea'></textarea>";

	$('#tml-editor').append(textarea);
	$('#ctml-editor-textarea').val(text);

	$('#ctml-editor-textarea').change( function() {
		var data = JSON.parse( $(this).val() );
		ractive.set(data);
	});
}