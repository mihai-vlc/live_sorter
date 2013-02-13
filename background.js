/*
* ionutvmi@gmail.com
* Feb 2013
*/

chrome.browserAction.onClicked.addListener(function(tab) {
chrome.tabs.create({url: "sorter.html"});
});
