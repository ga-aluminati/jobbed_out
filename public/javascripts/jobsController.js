(function() {
  var app = angular.module('JobbedOutApp');

  app.controller('JobbedOutController', function($http) {
    var self = this;

    // API base url 
    this.apiBaseUrl = '/api/v1';
    
    // Jobs that ng-repeat pulls from
    this.jobs = [];

    // Params used for search
    this.searchParams = {
      page: 1,
      company: '',
      title: '',
      sort: '',
      limit: 5
    };

    // Set up a new job object to connect to the model
    this.newJob = {
      link: '',
      title: '',
      company: ''
    };

    this.searchJobs = function() {
      // When searching, clear the current results
      self.jobs = [];
      self.loadJobs();
    };

    this.loadMore = function() {
      self.searchParams['page']++;
      self.loadJobs();
    };

    this.loadJobs = function() {
      console.log('Loading page: ', self.searchParams.page);

      $http({
        method: 'GET',
        url: self.apiBaseUrl + '/jobs?page=' + self.searchParams.page + 
          '&company=' + self.searchParams.company + 
          '&title=' + self.searchParams.title + 
          '&sort=' + self.searchParams.sort
      }).then(function successCallback(response) {
        console.log('success', response.data);

        if (response.data.docs.length) {
          // We want to keep appending jobs to the current array, not just overwrite
          self.jobs = self.jobs.concat(response.data.docs);
        } 

        // If there's no more jobs then hide the "Load More" button
        if (response.data.page == response.data.pages.toString()) {
          self.hideLoadMoreButton();
        }
      }, function errorCallback(response) {
        console.log('Uh oh..', response);
      });
    };

    this.addNewJob = function() {
      $http({
        method: 'POST',
        url: self.apiBaseUrl + '/jobs',
        data: {
          job: {
            title: self.newJob.title,
            company: self.newJob.company,
            link: self.newJob.link
          }
        }
      }).then(function successCallback(response) {
        self.jobs.push(response.data);
        self.showNewJobForm();
      }, function errorCallback(response) {
          console.log('Uh oh.. ', response);
      });

      self.newJob.title = '';
      self.newJob.company = '';
      self.newJob.link = '';
    };

    this.showNewJobForm = function() {
      self.showForm = !self.showForm;
    };

    this.deleteJob = function(jobId) {
      console.log('Deleting: ', jobId);

      $http({
        method: 'DELETE',
        url: self.apiBaseUrl + '/jobs/' + jobId
      }).then(function successCallback(response) {
        self.resetResults();
        self.loadJobs();
      }, function errorCallback(response) {
        console.log('Uh oh.. ', response);
      });
    };

    this.resetResults = function() {
      self.searchParams['page'] = 1;
      self.showLoadMoreButton();
      self.jobs = [];
    };

    this.hideLoadMoreButton = function() {
      document.getElementById('load-more').style.display = 'none';
    };

    this.showLoadMoreButton = function() {
      document.getElementById('load-more').style.display = 'block';
    }

    // When the controller first loads, request the jobs
    this.loadJobs();
  });
})();