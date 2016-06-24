(function(window, jQuery){

	$(document).ready(function() {

		function updatePopup() {
			// console.log(JSON.parse(localStorage.getItem("zapex_step") || null));
			if (JSON.parse(localStorage.getItem("zapex_step") || null) == null || JSON.parse(localStorage.getItem("zapex_step") || null) == "1") {
				localStorage.setItem("zapex_step", "1");
				$("#tasklists").hide();
				$("#success").hide();
				$("#login").show();
			} else {
				var step = JSON.parse(localStorage.getItem("zapex_step") || null);
				if (step == "2") {
					$("#tasklists").show();
					$("#success").hide();
					$("#login").hide();
					$("#tasklists .list").html("");

					var datas = JSON.parse(localStorage.getItem("zapex_data") || null);
					if (datas != null) {
						for (var i = 0; i < datas.length; i++) {
							var item = $("<li><button class='form-control' data-url='" + datas[i].zapier_url + "'>" + datas[i].name + "</button></li>");
							$("#tasklists .list").append(item);
							
							item.click(function() {
								console.log("clicked");
								chrome.tabs.query({
								    active: true,
								    currentWindow: true
								}, function (tabs) {
								    chrome.tabs.sendMessage(
								        tabs[0].id,
								        {from: 'popup', data: {url: item.find("button").attr("data-url")}},
								        function(response) {
								        	console.log(response);
								        	localStorage.setItem("zapex_step", "3");
								        	updatePopup();
								        });
								});
							});
						}
					}
				} else {
					$("#tasklists").hide();
					$("#success").show();
					$("#login").hide();
				}
			}
		};

		updatePopup();

		$("#submit").click(function() {
			var input1 = $("#value1").val(),
				input2 = $("#value2").val();

			var credentials = {
			  email : input1,
			  password : input2
			};

			Stamplay.init("zapex");

			Stamplay.User.login(credentials)
			  .then(function(res) {
				   Stamplay.Object("zapex_task")
					  .get({page: 1, per_page: 20})
					  .then(function(res) {
					    // Success
					    console.log(res);
					    localStorage.setItem("zapex_step", "2");
					    localStorage.setItem("zapex_task_count", res.data.length);

					    var datas = [];

					    for (var i = 0; i < res.data.length; i++) {
					    	var data = { 
					    		name: res.data[i].name, 
					    		zapier_url: res.data[i].zapier_url
					    	};
					    	datas.push(data);
					    }
					    localStorage.setItem("zapex_data", JSON.stringify(datas));

					    updatePopup();
					  }, function(err) {
					    // Handle Error
					  });
			  }, function(err) {
			  	$(".error").show();
				localStorage.setItem("zapex_step", "1");
			  });
		});

		$("#back-to-login").click(function() {
			localStorage.setItem("zapex_step", "1");
			updatePopup();
		});

		$("#back-to-task-list").click(function() {
			localStorage.setItem("zapex_step", "2");
			updatePopup();
		});

		$("#value1").keyup(function(e) {
			$(".error").hide();
		});

		$("#value2").keyup(function(e) {
			$(".error").hide();
		});

	});

})(window, $);