$('document').ready( function(){
	$('#index-json').focus( function(){
		$(this).val('');
	});
	$('#index-json').change( function(){
		console.log('input changed');
		$('#editor').empty();
	});
});


// funzione che carica il file .json,
// lo scrive nella textarea e invoca la funzione parse()
function valueForParse(){
	var jPos = $('#index-json').val();

	// carico il file json numero jPos
	$.getJSON('json'+jPos+'.json').then( function(data){
		// intestazione 
		$('#text-area').val("/********* file json"+ jPos +".json *********/"+ '\n\n' + JSON.stringify(data, null, '\t'));
		// chiamo funzione di parsing
		var elToAppend = '#editor';
		parse(data, elToAppend);
	});
}


// funzione che parsa un json e in base al tipo di dato
// riempie un elemento div in maniera opportuna
function parse(obj, el){
	var index = 1; // indice per settare l'id dei objDiv
	for (var k in obj)
    {
    	if (typeof obj[k] === 'string') { // se è una stringa
    		var label = "<label class='json-label'>"+k+": <input type='text' class='json-data' id='"+obj[k]+"ID' placeholder='"+typeof obj[k]+"' ></label><br>";
    		$(el).append(label);
    	}

    	else if (typeof obj[k] === 'number') { // se è una numero
    		var label = "<label class='json-label'>"+k+": <input type='text' class='json-data' id='"+obj[k]+"ID' placeholder='"+typeof obj[k]+"' ></label><br>";
    		$(el).append(label);
    	}

    	else if (typeof obj[k] === 'boolean') { // se è una booleano
    		var label = "<label class='json-label'>"+k+": <select class='json-data'><option value='true'>true</option><option value='false'>false</option></select></label><br>";
    		$(el).append(label);
    	}

    	else if (typeof obj[k] == 'object' && obj[k] instanceof Array) { // se è una array
    		var arrayName = "<span class='array-span'> '"+ k +"' &egrave; un array, di seguito i suoi dati         &#8595;</span><div class='objDiv' id='objDiv"+ index +"'>";
    		$(el).append(arrayName);
    		var elOld = el; // salvo l'ancora precedente
    		el = "#objDiv"+ index; // creo l'ancora
    		index++; // incremento index
    		parse(obj[k], el);
    		el = elOld; // risetto l'ancora precedente
    		$(el).append('</div>');
    	}

        else if (typeof obj[k] == "object" && obj[k] !== null && !(obj[k] instanceof Array) ){ // se è un object
        	var objName = "<span class='array-span'> '"+ k +"' &egrave; un object, di seguito i suoi dati         &#8595;</span><div class='objDiv' id='objDiv"+ index +"'>";
            $(el).append(objName);
    		var elOld = el; // salvo l'ancora precedente
    		el = "#objDiv"+ index; // creo l'ancora
    		index++; // incremento index
    		console.log('andata parse()-->obj[k]: '+obj[k]+'-->el: '+el);
    		parse(obj[k], el);
    		console.log('ritorno parse()-->obj[k]: '+obj[k]+'-->el: '+el);
    		el = elOld; // risetto l'ancora precedente
    		$(el).append('</div>');   
        }
        else {
           var msg = "<span style='color: red;'>Tipo non riconosciuto</span>";
           $(el).append(msg);
        }
    }
}