"use strict";

// variabile globale che contiene
// la lista dei template da caricare
// i tml vanno dal 1 al 4 e sono normali
// i jtml vanno dal 5 al 13 e contengono plug-in jQuery
// jtml da 5 a 10 script attivazione interno al template html
// jtml da 11 a 13 script attivazione esterno al template html
var templatesArray = ['jtml2','jtml2','jtml1','tml2','jtml1'];

var tl = null;

(function(){
	
	tl = new TemplateLoaderForMustache('templates');
	tl.preLoadWithArray(templatesArray);
	tl.loadAllTemplate(templatesArray);

})();
