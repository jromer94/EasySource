var request = require('request');
var async = require('async');
var prompt = require('prompt');

function getRepos(pageNum, callback) {
  var options = {
    url: 'https://api.github.com/search/repositories?q=language:python&sort=stars&order=desc&page='+ pageNum + '&client_id=4ed42df05d18938798f3&client_secret=e2d8403260f9a518d4b2d05b241ffe4162fd50f4',
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
    if(labels[i].name === 'bug') {
      easy = true;
    }
  }
  callback(easy);
}

//for(var i = 0; i < 10; i++){
//  getRepos(i, function (repos){
//    for(var i = 0; i < repos.length; i++){
//      getIssues(repos[i], function(issues){
//        for(var i = 0; i < issues.length; i++) {
//          isIssueEasy(issues[i]);
//        }
//      });
//    }
//  });
//}

results = [];

prompt.start();

prompt.get(['language'], function (err, result) {
  async.each([1,2,3,4], function(i , callback) {
    getRepos(i, function(repos) {
      async.each(repos, function(repo, callback){
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
      }, function(err){
        callback();
      });
    });
  }, function(err) {
    for(var i = 0; i < results.length; i++){
      console.log(results[i].title);   
      console.log("");
    }
  });
});
