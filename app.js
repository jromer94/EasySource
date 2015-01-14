request = require('request');

function getRepos(callback) {
  var options = {
    url: 'https://api.github.com/search/repositories?q=language:python&sort=stars&order=desc&page=3&client_id=4ed42df05d18938798f3&client_secret=e2d8403260f9a518d4b2d05b241ffe4162fd50f4',
    headers: {
      'User-Agent': 'jromer94'
    } 
  }
  request(options, function(error, response, body){
    if(!error){
      var items = JSON.parse(body).items;  
      callback(items);
    }
  });
}

function getIssues(repo, callback) {
  console.log('fetching issues for ' + repo.full_name);

  var options = {
    url: 'https://api.github.com/repos/' + repo.full_name + '/issues?client_id=4ed42df05d18938798f3&client_secret=e2d8403260f9a518d4b2d05b241ffe4162fd50f4',
    headers: {
      'User-Agent': 'jromer94'
    } 
  }
  request(options, function(error, response, body){
    if(!error){
      var issues = JSON.parse(body);
      console.log("got " + issues.length + " issues for " + repo.full_name);
      callback(issues);
    } else {
      console.log(error);
    }
  });
}

function isIssueEasy(issue, callback){
  var labels = issue.labels;
  for(var i = 0; i < labels.length; i++) {
    if(labels[i].name === 'easy') {
      console.log(issue.url);
    }
  }
}
getRepos(function (repos){
  for(var i = 0; i < repos.length; i++){
    getIssues(repos[i], function(issues){
      for(var i = 0; i < issues.length; i++) {
        isIssueEasy(issues[i]);
      }
    });
  }
});
