
$(document).ready(function () {

	$('#button-1').clickSpark();

	$('#button-2').clickSpark({
		particleImagePath: 'templates/tml13/img/particle-2.png',
		particleCount: 35,
		particleSpeed: 10,
		particleSize: 15,
		particleRotationSpeed: 20,
		animationType: 'explosion',
		callback: ''
	});


	$('#button-3').clickSpark({
		particleImagePath: 'templates/tml13/img/particle-3.png',
		particleCount: 55,
		particleSpeed: 10,
		particleSize: 24,
		particleRotationSpeed: 5,
		animationType: 'blowleft'
	});

});