
$(document).ready(function () {

	$('.jtml3-button-1').clickSpark();

	$('.jtml3-button-2').clickSpark({
		particleImagePath: 'templates/jtml3/img/particle-2.png',
		particleCount: 35,
		particleSpeed: 10,
		particleSize: 15,
		particleRotationSpeed: 20,
		animationType: 'explosion',
		callback: ''
	});


	$('.jtml3-button-3').clickSpark({
		particleImagePath: 'templates/jtml3/img/particle-3.png',
		particleCount: 55,
		particleSpeed: 10,
		particleSize: 24,
		particleRotationSpeed: 5,
		animationType: 'blowleft'
	});

});