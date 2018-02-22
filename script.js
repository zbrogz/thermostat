var state;
var timeout;
$(document).ready(function() {
	getThermostat(true);
	
	// $("#refresh").click(function(e) {
	// 	e.preventDefault();
	// 	getThermostat();
	// });

	$("#decrease").off().on('click', function(e) {
		clearTimeout(timeout);
		e.preventDefault();
		state.desired_temperature -= 1;
		$( "#desired_temp" ).text(state.desired_temperature + '\u00B0');
		setTimeout(delayed, 1)
	});

	$("#increase").off().on('click', function(e) {
		clearTimeout(timeout);
		e.preventDefault();
		state.desired_temperature += 1;
		$( "#desired_temp" ).text(state.desired_temperature + '\u00B0');
		setTimeout(delayed, 1)
	});

	$('input:radio[name=mode]').change(function(e) {
		e.preventDefault();
		state.mode = this.value;
		sendState();
	});

	$('input:radio[name=fan_mode]').change(function(e) {
		e.preventDefault();
		state.fan = this.value;
		sendState();
	});
});

function delayed(func) {
	timeout = setTimeout(sendState, 1000);
}
function sendState() {
	$(":input").prop("disabled", true);
	$.ajax({
		url: "https://pouztpq4a1.execute-api.us-west-2.amazonaws.com/dev/thermostat/47b42a430c9b4910910d781f454c1147",
		type: 'PUT',
		data: JSON.stringify(state),
		dataType: "json",
		success: function(json) {
			console.log(json);
			setTimeout(updateState, 2500);
	  	}
	});
}

function updateState() {
	getThermostat(false);
	getTemperature();
	getHvac();
}

function getTemperature() {
	$.ajax({
		url: state.temperature_url,
		dataType: "json",
		success: function(json) {
			console.log(json);
			$( "#current_temp" ).text(json.temperature + '\u00B0');
		}
	});
}

function getHvac() {
	$.ajax({
		url: state.hvac_url,
		dataType: "json",
		success: function(json) {
			console.log(json);
			if(json.heater) {
				$('.main').css('background-color', '#FEE');
				$('#heater').css('color', '#000')
				$('#ac').css('color', '#999')
				$('#fan').css('color', '#000')
			}
			else if(json.ac) {
				$('.main').css('background-color', '#EEF');
				$('#heater').css('color', '#999')
				$('#ac').css('color', '#000')
				$('#fan').css('color', '#000')
			}
			else if(json.fan) {
				$('.main').css('background-color', '#EFF');
				$('#heater').css('color', '#999')
				$('#ac').css('color', '#999')
				$('#fan').css('color', '#000')
			}
			else {
				$('.main').css('background-color', '#EEE');
				$('#heater').css('color', '#999')
				$('#ac').css('color', '#999')
				$('#fan').css('color', '#999')
			}
		}
	});
}

function getThermostat(update_all) {
	$.ajax({
		url: "https://pouztpq4a1.execute-api.us-west-2.amazonaws.com/dev/thermostat/47b42a430c9b4910910d781f454c1147",
		dataType: "json",
		success: function(json) {
			$(":input").prop("disabled", false);
			console.log(json);
			state = json;
			$( "#area" ).text(json.area);
	    	$( "#desired_temp" ).text(json.desired_temperature + '\u00B0');
	    	$('input:radio[name=mode]').filter('[value=' + json.mode + ']').prop('checked', true);
			$('input:radio[name=fan_mode]').filter('[value=' + json.fan + ']').prop('checked', true);
			if(update_all) {
				getHvac();
				getTemperature();
			}
	  	}
	});
}

