var mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONN_JOBBED_OUT);

var Job = require('./models/job');

var jobs = [
  {
    link: "http://www.builtinaustin.com/job/full-stack-developer-5",
    title: "Full Stack Developer",
    company: "Eureka Software Solutions, Inc.",
  },
  {
    link: "http://www.builtinaustin.com/job/front-end-web-developer-1",
    title: "Front-end Web Developer",
    company: "Alchemy Systems",
  },
  {
    link: "http://www.builtinaustin.com/job/devops-engineer-23",
    title: "DevOps Engineer",
    company: "Sprinklr",
  },
  {
    link: "http://www.builtinaustin.com/job/qa-engineer-10",
    title: "QA Engineer",
    company: "Phunware",
  },
  {
    link: "http://www.builtinaustin.com/job/firmware-engineer",
    title: "Firmware Engineer",
    company: "Ambiq Micro",
  },
  {
    link: "http://www.builtinaustin.com/job/senior-web-developer-2",
    title: "Senior Web Developer",
    company: "HealCode",
  },
  {
    link: "http://www.builtinaustin.com/job/data-scientist-10",
    title: "Data Scientist",
    company: "Indeed.com",
  },
  {
    link: "http://www.builtinaustin.com/job/data-science-analyst-0",
    title: "Data Science Analyst",
    company: "Indeed.com",
  },
  {
    link: "http://www.builtinaustin.com/job/mid-front-end-engineer",
    title: "Mid Front-End Engineer",
    company: "OnPrem Solution Partners",
  },
  {
    link: "http://www.builtinaustin.com/job/senior-front-end-engineer-10",
    title: "Senior Front-End Engineer",
    company: "OnPrem Solution Partners",
  },
  {
    link: "http://www.builtinaustin.com/job/software-architect-backend",
    title: "Software Architect (Backend)",
    company: "Jobs2Careers",
  },
  {
    link: "http://www.builtinaustin.com/job/software-architect-javascript",
    title: "Software Architect (Javascript)",
    company: "Jobs2Careers",
  }
];

Job.create(jobs, function (err) {
    if (err) throw err;
    console.log("Added!");
});
