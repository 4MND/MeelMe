"use strict";

$(document).ready(function() {
	$('#invite').ketchup().submit(function() {
		if ($(this).ketchup('isValid')) {
			var action = $(this).attr('action');
			$.ajax({
				url: action,
				type: 'POST',
				data: {
					email: $('#address').val()
				},
				success: function(data){
					$('#button-icon').removeClass("fa-chevron-right").addClass("fa-check");
					$('#button-icon').addClass("animated");
					$('#button-icon').addClass("flash");
				},
				error: function() {
					$('#button-icon').removeClass("fa-chevron-right").addClass("fa-times");
				}
			});
		}
		return false;
	});
});