/**
 * JobbedOut Components: 
 *
 * <Container>
 *  <Header/>
 *  <AddJobForm/>
 *  <SearchForm/>
 *  <JobsList>
 *    <Job/>
 *  </JobsList>
 * </Container>
 * 
 * This was coded with ES6 syntax, some differences include: 
 *  - Arrow functions
 *  - `class` and `extends` keywords
 *  - With ES6, there is no `setInitialState()` method, state is 
 *    initialized in the constructor instead
 *  - Event handlers are not automatically bound with the current
 *    object, this is why we need to bind `this` explicitly on them
 *
 * TODO: Refactor components into their own files 
 * TODO: We can avoid binding `this` to each handler by creating a 
 *   base component that automatically creates this behavior: 
 *   http://www.newmediacampaigns.com/blog/refactoring-react-components-to-es6-classes
 * TODO: Set default propTypes
 * TODO: Set up configuration instead of setting global 'API_BASE_URL'
 */

let React = require('react');
let ReactDOM = require('react-dom');

const API_BASE_URL = '/api/v1';

// <Container/> component
class Container extends React.Component {
  constructor(props) {
    super(props);

    // With the ES6 class syntax, this is how you set initial state,
    //  setInitialState() doesn't exist when doing this over 
    //  the "createClass" method we discussed in class
    this.state = {
      // TODO: "shouldShowAddJobForm" starts off true here because of 
      //  how the toggling code works. Could be confusing?
      shouldShowAddJobForm: true,
      addJobFormVisibility: 'hidden',
      searchFormVisibility: 'visible',
      jobsListVisibility: 'visible'
    };
  }

  toggleAddJobForm() {
    this.setState({
      shouldShowAddJobForm: !this.state.shouldShowAddJobForm
    });

    (this.state.shouldShowAddJobForm) ? 
      this.showAddJobForm() : 
      this.hideAddJobForm();
  }

  showAddJobForm() {
    this.setState({
      shouldShowAddJobForm: false,
      addJobFormVisibility: 'visible',
      searchFormVisibility: 'hidden',
      jobsListVisibility: 'hidden'
    });
  }

  hideAddJobForm() {
    this.setState({
      shouldShowAddJobForm: true,
      addJobFormVisibility: 'hidden',
      searchFormVisibility: 'visible',
      jobsListVisibility: 'visible'
    });
  }

  searchHandler(options) {
    this.refs['jobslist'].executeSearch({
      title: options.title,
      company: options.company,
      sort: options.sort
    });
  }

  jobSaved(job) {
    this.hideAddJobForm();
    this.refs['jobslist'].jobAdded(job);
  }

  // With ES6 we need to bind "this" for the handler to work properly
  render() {
    return (
      <div>
        <Header addJobButtonHandler={ this.toggleAddJobForm.bind(this) }/>
        <AddJobForm saveButtonHandler={ this.jobSaved.bind(this) } cancelButtonHandler={ this.toggleAddJobForm.bind(this) } visibilityClassName={ this.state.addJobFormVisibility }/>
        <SearchForm searchButtonHandler={ this.searchHandler.bind(this) } visibilityClassName={ this.state.searchFormVisibility }/>
        <JobsList ref="jobslist" visibilityClassName={ this.state.jobsListVisibility }/>
      </div>
    );
  }
}

// <AddJobForm/> component
class AddJobForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      company: '',
      link: ''
    };
  }

  clearForm() {
    this.setState({
      title: '',
      company: '',
      link: ''
    });
  }

  save(e) {
    e.preventDefault();

    // TODO: Validate data before saving 
    $.ajax({
      url: `${ API_BASE_URL }/jobs`,
      method: 'POST',
      data: {
        job: {
          title: this.state.title,
          company: this.state.company,
          link: this.state.link
        }
      }
    }).done(function(response) {
      // Clear the current inputs for the next job entry
      this.clearForm();

      this.props.saveButtonHandler(response);
    }.bind(this)).fail(function(err) {
      console.log('Uh oh..', err);
    }.bind(this));
  }

  updateState() {
    this.setState({
      title: this.refs.addTitleInput.value,
      company: this.refs.addCompanyInput.value,
      link: this.refs.addLinkInput.value
    });
  }

  render() {
    return (
      <div className={ this.props.visibilityClassName }>
        <form action="">
          <div>
            <input id="title" ref="addTitleInput" onChange={ this.updateState.bind(this) } value={ this.state.title } placeholder="Title"/>
          </div>
          <div>
            <input id="company" ref="addCompanyInput" onChange={ this.updateState.bind(this) } value={ this.state.company } placeholder="Company"/>
          </div>
          <div>
            <input id="link" ref="addLinkInput" onChange={ this.updateState.bind(this) } value={ this.state.link } placeholder="Link"/>
          </div>
          <div className="add-job-save-button">
            <button onClick={ this.save.bind(this) }>Save</button> &nbsp;
            <a href="#" onClick={ this.props.cancelButtonHandler }>Cancel</a>
          </div>
        </form>
      </div>
    );
  }
}

// <SearchForm/> component
class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      company: '',
      sort: ''
    }
  }

  search(e) {
    e.preventDefault();

    this.props.searchButtonHandler({
      title: this.state.title,
      company: this.state.company,
      sort: this.state.sort
    });
  }

  updateSearch() {
    this.setState({
      title: this.refs.titleInput.value,
      company: this.refs.companyInput.value,
      sort: this.refs.sortInput.value
    });
  }

  render() {
    return (
      <div className={ this.props.visibilityClassName }>
        <form action="">
          <input ref="titleInput" onChange={ this.updateSearch.bind(this) } type="search" id="search-title" placeholder="Search by Title"/>
          <input ref="companyInput" onChange={ this.updateSearch.bind(this) } type="search" id="search-company" placeholder="Search by Company"/>
          Sort by:
          <select ref="sortInput" onChange={ this.updateSearch.bind(this) } id="sort">
            <option value="">Choose...</option>
            <option value="createdAt">Created At</option>
            <option value="title">Title</option>
            <option value="company">Company</option>
          </select>
          <button onClick={ this.search.bind(this) }>Search</button>
        </form>
      </div>
    );
  }
}

// <Job/> component
class Job extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      title: props.title,
      company: props.company,
      link: props.link,
      createdAt: props.createdAt
    }
  }

  deleteJob() {
    console.log('Deleting job', this.state.id);

    $.ajax({
      url: `${ API_BASE_URL }/jobs/${ this.state.id }`,
      method: 'DELETE'
    }).done(function(response) {
      // TODO: Right now we're reloading all the results once a job has 
      //  been deleted, but that's not very "Single Page App" of us. 
      //  Remove the job from the existing jobs array 
      this.props.deleteJobHandler(this.state.id);
    }.bind(this)).fail(function(err) {
      console.log('Uh oh..', err);
    }.bind(this));
  }

  render() {
    return (
      <li className="job" key={ this.state.id }>
        <h3><a href={ this.state.link }>{ this.state.title }</a></h3>
        <p>at <strong>{ this.state.company }</strong>, posted at { this.state.createdAt }</p>
        <button className="delete" onClick={ this.deleteJob.bind(this, this.state.id) }>Delete</button>
      </li>
    );
  }
}

// <JobsList/> component
class JobsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: [],
      searchParams: {
        page: 1,
        company: '',
        title: '',
        sort: '',
        limit: 5  // This isn't currently supported in the API
      },
      loadMoreButtonVisibility: 'visible',
      activityIndicatorVisibility: 'hidden'
    };
  }

  componentDidMount() {
    this.loadJobs();
  }

  jobAdded(job) {
    this.state.jobs.push(job);
  }

  loadJobs(searchOptions) {
    if (searchOptions) {
      // Clear the current job results
      this.setState({
        jobs: []
      });
    } else {
      searchOptions = {};
    }

    let company = searchOptions.company || this.state.searchParams.company;
    let title = searchOptions.title || this.state.searchParams.title;
    let sort = searchOptions.sort || this.state.searchParams.sort;

    this.setState({
      activityIndicatorVisibility: 'visible'
    });

    $.ajax({
      url: `${ API_BASE_URL }/jobs`,
      method: 'GET',
      data: {
        page: this.state.searchParams.page,
        company: company,
        title: title,
        sort: sort,
        limit: this.state.searchParams.limit
      }
    }).done(function(response) {
      console.log('response', response);

      // We don't want to replace the jobs, but keep adding them 
      //  as we load more
      this.setState({
        jobs: this.state.jobs.concat(response.docs)
      });

      // Did we reach the maximum number of results? 
      if (parseInt(response.page, 10) === parseInt(response.pages, 10)) {
        // Hide the "Load More" button
        this.setState({
          loadMoreButtonVisibility: 'hidden'
        });
      } else {
        this.setState({
          loadMoreButtonVisibility: 'visible'
        });
      }
    }.bind(this)).always(function() {
      // Hide the activity indicator
      this.setState({
        activityIndicatorVisibility: 'hidden'
      });
    }.bind(this)).fail(function(err) {
      console.log('Uh oh..', err);
    }.bind(this));
  }

  executeSearch(options) {
    console.log('Search options', options);
    
    // TODO: Setting the state of searchParams doesn't do anything here
    // when calling setState(), resorting to passing the options in the
    // chump way. I suspect it has something to do with using 'refs'
    this.setState({
      jobs: [],
      searchParams: {
        title: options.title,
        company: options.company,
        sort: options.sort,
        page: 1
      }
    });

    this.loadJobs(options);
  }

  loadMore() {
    this.setState({
      searchParams: {
        page: this.state.searchParams.page++
      }
    });

    this.loadJobs();
  }

  render() {
    var jobs = this.state.jobs.map(job => 
      <Job key={ job._id } id={ job._id } title={ job.title } company={ job.company } link={ job.link } createdAt={ job.createdAt } deleteJobHandler={ this.loadJobs.bind(this) } />
    );

    return (
      <section id="jobs-container" className={ this.props.visibilityClassName }>
        <p className={this.state.activityIndicatorVisibility}>Loading...</p>
        <ul>
          { jobs }
        </ul>
        <button id="load-more" className={ this.state.loadMoreButtonVisibility } onClick={ this.loadMore.bind(this) }>Load More</button>
      </section>
    );
  }
}

// <Header/> component
class Header extends React.Component {
  render() {
    return (
      <div>
        <h1>Jobbed Out</h1>
        <div className="add-job-button">
          <button id="add-job" onClick={ this.props.addJobButtonHandler }>Add a Job</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Container />, document.getElementsByClassName('container')[0]);