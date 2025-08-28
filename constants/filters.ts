export const jobFilters = [
  {
    name: 'Job Type',
    key: 'jobType',
    type: 'dropdown',
    options: [
      { label: 'Full-time', value: 'full_time' },
      { label: 'Contract', value: 'contract' },
      { label: 'Internship', value: 'internship' },
    ],
  },
  {
    name: 'Category',
    key: 'category',
    type: 'dropdown',
    options: [
      { label: 'Software Engineering', value: 'software_engineering' },
      { label: 'Data', value: 'data' },
      { label: 'Product Management', value: 'product_management' },
      { label: 'Design', value: 'design' },
      { label: 'DevOps', value: 'devops' },
      { label: 'Marketing', value: 'marketing' },
      { label: 'Sales', value: 'sales' },
      { label: 'Customer Support', value: 'customer_support' },
      { label: 'Quality Assurance', value: 'quality_assurance' },
      { label: 'Operations', value: 'operations' },
      { label: 'Other', value: 'other' },
    ],
  },
  // {
  //   name: 'Source',
  //   key: 'source',
  //   type: 'checkbox',
  //   options: [
  //     { label: 'RemoteOk', value: 'RemoteOk' },
  //     { label: 'Working Nomads', value: 'WorkingNomads' },
  //     { label: 'Skip The Drive', value: 'SkipTheDrive' },
  //     { label: 'Jobspresso', value: 'Jobspresso' },
  //     { label: 'We Work Remotely', value: 'WeWorkRemotely' },
  //     { label: 'Remotive', value: 'Remotive' },
  //     { label: 'JavaScript Jobs', value: 'JavascriptJobs' },
  //   ]
  // },
	{
    name: 'Salary Range (USD)',
    key: 'salary',
    type: 'rangeSlider',
    min: 0,
    max: 500000,
    step: 10,
    unit: '$',
  },
  {
    name: 'Date Posted',
    key: 'datePosted',
    type: 'dropdown',
    options: [
      { label: 'Last 24 hours', value: '24h' },
      { label: 'Last 3 days', value: '3d' },
      { label: 'Last 7 days', value: '7d' },
      { label: 'Last 14 days', value: '14d' },
      { label: 'Last 30 days', value: '30d' },
      { label: 'Last 60 days', value: '60d' },
      { label: 'Last 90 days', value: '90d' },
      { label: 'Anytime', value: 'anytime' },
    ],
  },
  {
    name: 'Sort By',
    key: 'sortBy',
    type: 'dropdown',
    options: [
      { label: 'Newest', value: 'newest' },
      { label: 'Oldest', value: 'oldest' },
    ]
  }
];