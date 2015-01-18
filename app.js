var request = require('request');
var async = require('async');
var prompt = require('prompt');

function getRepos(pageNum, language, callback) {
  var options = {
    url: 'https://api.github.com/search/repositories?q=language:'+ language + '&sort=stars&order=desc&page='+ pageNum + '&client_id=4ed42df05d18938798f3&client_secret=e2d8403260f9a518d4b2d05b241ffe4162fd50f4&per_page=100',
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
  var easy = false;
  for(var i = 0; i < labels.length; i++) {
    if(labels[i].name === 'easy') {
      easy = true;
    }
  }
  if(issue.body && issue.body.search("array out of bound") != -1){
      easy = true;
  }
  callback(easy);
}

results = [];
RepoCount = 0;

prompt.start();
console.log("Enter Language to search");
prompt.get(['language'], function (err, result) {
  async.each([1,2,3,4,5,6,7,8,9,10], function(i , callback) {
    getRepos(i, result.language, function(repos) {
      async.each(repos, function(repo, callback){
        if(repo.open_issues_count > 0){
          RepoCount++;
          getIssues(repo, function(issues){
            async.each(issues, function(issue, callback){
              isIssueEasy(issue, function(easy){

                if(easy){
                  results.push(issue); 
                }

                callback(); 
              }); 
            }, function(err){
              callback();
            });
          });
        } else {
          callback();
        }
      }, function(err){
        callback();
      });
    });
  }, function(err) {
    console.log("Searched " + repoCount + "repos"
    for(var i = 0; i < results.length; i++){
      var title = results[i].url.replace("https://api.github.com/repos/", "");
      title = '\n' + title.replace( /\/issues.*/g, "");
      console.log(title); 
      console.log(results[i].title);   
      console.log(results[i].html_url);
    }
  });
});
