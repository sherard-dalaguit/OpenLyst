import React from "react";

export const servicesContent = [
  {
    title: "Aggregated Job Listings",
    description: "Pull remote roles from multiple top boards—WeWorkRemotely, RemoteOk, Wellfound, and more—into one unified feed. This consolidated view eliminates the need to hop between platforms and helps you discover opportunities faster. Customize your feed by skills, location, and salary to see the most relevant listings first.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-500 text-white">
        Aggregated Listings
      </div>
    ),
  },
  {
    title: "Real-Time Email Alerts",
    description: "Get instant email notifications the moment new jobs matching your criteria go live. Stay ahead of the competition by being one of the first applicants. Define multiple alert rules so you can focus solely on roles that align with your career goals.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-500 to-teal-400 text-white">
        Email Alerts
      </div>
    ),
  },
  {
    title: "Advanced Search & Filters",
    description: "Narrow down listings by role, industry, salary range, experience level, and more to find your perfect match. Combine multiple criteria to refine results with pinpoint accuracy. Save custom filter presets for quick access to your most-used searches.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        Advanced Filters
      </div>
    ),
  },
  {
    title: "Save & Bookmark Jobs",
    description: "Quickly mark favorites and revisit them anytime with a single click. Organize your bookmarks into custom folders and add personal notes for each saved role. Never lose track of your top prospects as you prepare your applications.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
        Saved Jobs
      </div>
    ),
  },
  {
    title: "Custom Email Digests",
    description: "Receive daily or weekly digests of top matching remote jobs directly to your inbox. Tailor the frequency and format of your summaries to suit your workflow. Scan through curated listings at a glance without having to log in.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-600 text-white">
        Email Digests
      </div>
    ),
  },
];

export const sidebarLinks = [
	{
		imgURL: '/icons/home.svg',
		label: 'Jobs',
		route: '/jobs'
	},
	{
		imgURL: '/icons/users.svg',
		label: 'Saved Jobs',
		route: '/saved-jobs'
	},
	{
		imgURL: '/icons/star.svg',
		label: 'Applied Jobs',
		route: '/applied-jobs'
	},
	{
		imgURL: '/icons/tag.svg',
		label: 'Email Alerts',
		route: '/email-alerts'
	},
	{
		imgURL: '/icons/user.svg',
		label: 'Profile',
		route: '/profile'
	},
];

export const jobs = [
  {
    _id: "1",
    title: "Software Engineer",
    companyName: "Airbnb",
    companyLogoUrl: "https://remote-radar.com/logos/airbnb.png",
    datePosted: "2025-07-18T14:00:00Z",
    jobType: "Full-time",
    experienceLevel: "Mid",
    salary: "$120,000 - $150,000",
    category: "Software Engineering",
    snippet: "Join our team to build scalable web services that power Airbnb’s core booking platform.",
    applyUrl: "https://wellfound.com/airbnb/software-engineer-1",
    source: "Wellfound",
    isBookmarked: true,
    isApplied: false,
  },
  {
    _id: "2",
    title: "Data Engineer",
    companyName: "Palantir",
    companyLogoUrl: "https://remote-radar.com/logos/palantir.png",
    datePosted: "2025-07-17T09:30:00Z",
    jobType: "Full-time",
    experienceLevel: "Senior",
    salary: "$140,000 - $170,000",
    category: "Data Engineering",
    snippet: "Design and implement data pipelines to process petabytes of data for critical analytics workloads.",
    applyUrl: "https://weworkremotely.com/companies/palantir/jobs/2",
    source: "WeWorkRemotely",
    isBookmarked: false,
    isApplied: false,
  },
  {
    _id: "3",
    title: "Senior Software Engineer",
    companyName: "Prismatic Software",
    companyLogoUrl: "https://remote-radar.com/logos/prismatic.png",
    datePosted: "2025-07-16T12:15:00Z",
    jobType: "Contract",
    experienceLevel: "Senior",
    salary: "$80,000 - $100,000",
    category: "Software Engineering",
    snippet: "Lead feature development on our Node.js microservices architecture and mentor junior engineers.",
    applyUrl: "https://remoteok.com/remote-jobs/3",
    source: "RemoteOK",
    isBookmarked: false,
    isApplied: true,
  },
  {
    _id: "4",
    title: "Full Stack Software Engineer",
    companyName: "Twilio",
    companyLogoUrl: "https://remote-radar.com/logos/twilio.png",
    datePosted: "2025-07-15T08:00:00Z",
    jobType: "Full-time",
    experienceLevel: "Mid",
    salary: "$110,000 - $135,000",
    category: "Software Engineering",
    snippet: "Work on both frontend (React) and backend (Node.js) to deliver scalable communication APIs.",
    applyUrl: "https://remotive.com/jobs/4",
    source: "Remotive",
    isBookmarked: true,
    isApplied: false,
  },
  {
    _id: "5",
    title: "Staff Software Engineer",
    companyName: "Discord",
    companyLogoUrl: "https://remote-radar.com/logos/discord.png",
    datePosted: "2025-07-14T16:45:00Z",
    jobType: "Full-time",
    experienceLevel: "Lead",
    salary: "$160,000 - $190,000",
    category: "Software Engineering",
    snippet: "Architect and scale our real-time chat infrastructure to handle millions of concurrent users.",
    applyUrl: "https://wellfound.com/discord/staff-software-engineer-5",
    source: "Wellfound",
    isBookmarked: false,
    isApplied: true,
  },
  {
    _id: "6",
    title: "Frontend Engineer",
    companyName: "Meta",
    companyLogoUrl: "https://remote-radar.com/logos/meta.png",
    datePosted: "2025-07-13T11:20:00Z",
    jobType: "Full-time",
    experienceLevel: "Mid",
    salary: "$130,000 - $155,000",
    category: "Frontend Engineering",
    snippet: "Build and optimize React components for high-traffic social media products.",
    applyUrl: "https://weworkremotely.com/companies/meta/jobs/6",
    source: "WeWorkRemotely",
    isBookmarked: true,
    isApplied: false,
  },
  {
    _id: "7",
    title: "Backend Engineer",
    companyName: "Stripe",
    companyLogoUrl: "https://remote-radar.com/logos/stripe.png",
    datePosted: "2025-07-12T13:10:00Z",
    jobType: "Full-time",
    experienceLevel: "Mid",
    salary: "$135,000 - $160,000",
    category: "Backend Engineering",
    snippet: "Design and maintain RESTful APIs and microservices powering global payments.",
    applyUrl: "https://remoteok.com/remote-jobs/7",
    source: "RemoteOK",
    isBookmarked: false,
    isApplied: true,
  },
  {
    _id: "8",
    title: "DevOps Engineer",
    companyName: "Google",
    companyLogoUrl: "https://remote-radar.com/logos/google.png",
    datePosted: "2025-07-11T07:50:00Z",
    jobType: "Contract",
    experienceLevel: "Senior",
    salary: "$100,000 - $125,000",
    category: "DevOps",
    snippet: "Implement CI/CD pipelines and infrastructure-as-code for our cloud services.",
    applyUrl: "https://remotive.com/jobs/8",
    source: "Remotive",
    isBookmarked: false,
    isApplied: false,
  },
  {
    _id: "9",
    title: "Machine Learning Engineer",
    companyName: "OpenAI",
    companyLogoUrl: "https://remote-radar.com/logos/openai.png",
    datePosted: "2025-07-10T10:30:00Z",
    jobType: "Full-time",
    experienceLevel: "Senior",
    salary: "$180,000 - $210,000",
    category: "Machine Learning",
    snippet: "Develop and deploy state-of-the-art NLP models in production environments.",
    applyUrl: "https://wellfound.com/openai/ml-engineer-9",
    source: "Wellfound",
    isBookmarked: true,
    isApplied: false,
  },
  {
    _id: "10",
    title: "Cloud Solutions Architect",
    companyName: "AWS",
    companyLogoUrl: "https://remote-radar.com/logos/aws.png",
    datePosted: "2025-07-09T15:00:00Z",
    jobType: "Full-time",
    experienceLevel: "Lead",
    salary: "$170,000 - $200,000",
    category: "Cloud Architecture",
    snippet: "Architect scalable, secure cloud solutions and guide enterprise migrations to AWS.",
    applyUrl: "https://weworkremotely.com/companies/aws/jobs/10",
    source: "WeWorkRemotely",
    isBookmarked: true,
    isApplied: true,
  },
];
