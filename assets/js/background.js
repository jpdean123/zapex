(function(window, jQuery){
	chrome.runtime.onMessage.addListener(function(request, sender) {
		if (request.from == "content") {
			chrome.pageAction.show(sender.tab.id);
		}
	});
})(window, $);