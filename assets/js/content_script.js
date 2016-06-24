(function(window, jQuery) {

	$(document).ready(function() {

		chrome.runtime.sendMessage({
		  from:    'content'
		});

		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			switch(request.from) {
				case "popup":
					console.log(request.data);

					var dataObject = {
						P_First_Name:     			$("#FirstName").val(),
						P_Last_Name:      			$("#LastName").val(),
						S_First_Name:     			$("#S_FirstName").val(),
						S_Last_Name:      			$("#S_LastName").val(),
						Address:          			$("#Address").val(),
						City:             			$("#City").val(),
						State:            			$("#State").val(),
						Zip:              			$("#Zip").val(),
						Home_Phone:       			$("input[name='PhoneContacts[0].Contact']").val(),
						Business_Phone:   			$("input[name='PhoneContacts[1].Contact']").val(),
						Mobile_Phone:     			$("input[name='PhoneContacts[2].Contact']").val(),
						Fax_Phone:        			$("input[name='PhoneContacts[3].Contact']").val(),
						Personal_Email:   			$("input[name='EmailContacts[0].Contact']").val(),
						Business_Email:   			$("input[name='EmailContacts[1].Contact']").val(),
						Instant_Messanger_Email:    $("input[name='EmailContacts[2].Contact']").val(),
						Other_Email:                $("input[name='EmailContacts[3].Contact']").val()
					};

					console.log(dataObject);
					$.ajax({
						type: "POST",
						url:  'https://zapex.stamplayapp.com/api/codeblock/v1/run/webhook_to_zapier',
						data: {'zapier_url': request.data.url, dataObject: dataObject},
						dataType: "json",
						success: function(res) {
							sendResponse({result: "success"});
						}
					});
					break;

				default:
					break;
			}
		});
	});
})(window, $)