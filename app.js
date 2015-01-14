request = require('request');

function getRepos(callback) {
  var options = {
    url: 'https://api.github.com/search/repositories?q=language:python&sort=stars&order=desc',
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

  var options = {
    url: 'https://api.github.com/repos/' + repo.full_name + '/issues',
    headers: {
      'User-Agent': 'jromer94'
    } 
  }
  request(options, function(error, response, body){
    var issues = JSON.parse(body);
    callback(issues);
  });
}

function isIssueEasy(issue, callback){
  var labels = issue.labels;
  for(i = 0; i < labels.length; i++) {
    if(labels[i].name === 'bug') {
      console.log(issue);
    }
  }
}
getRepos(function (repos){
  for(i = 0; i < repos.length; i++){
    getIssues(repos[i], function(issues){
      for(i = 0; i < issues.length; i++) {
        isIssueEasy(issues[i]);
      }
    });
  }
});
