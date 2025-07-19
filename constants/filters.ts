export const jobFilters = [
  {
    name: 'Job Type',
    key: 'jobType',
    type: 'checkbox',
    options: [
      { label: 'Full-time',   value: 'full_time'   },
      { label: 'Part-time',   value: 'part_time'   },
      { label: 'Contract',    value: 'contract'    },
      { label: 'Internship',  value: 'internship'  },
    ],
  },
  {
    name: 'Experience Level',
    key: 'experienceLevel',
    type: 'checkbox',
    options: [
      { label: 'Entry',   value: 'entry'   },
      { label: 'Mid',     value: 'mid'     },
      { label: 'Senior',  value: 'senior'  },
      { label: 'Lead',    value: 'lead'    },
    ],
  },
  {
    name: 'Category',
    key: 'category',
    type: 'checkbox',
    options: [
      { label: 'Software Engineering', value: 'software_engineering' },
      { label: 'Design',               value: 'design'               },
      { label: 'Marketing',            value: 'marketing'            },
      { label: 'Sales',                value: 'sales'                },
      { label: 'Customer Support',     value: 'customer_support'     },
      // …add more as you onboard new professions
    ],
  },
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
      { label: 'Last 24 hours',  value: '24h'  },
      { label: 'Last 3 days',    value: '3d'   },
      { label: 'Last 7 days',    value: '7d'   },
      { label: 'Last 14 days',   value: '14d'  },
      { label: 'Last 30 days',   value: '30d'  },
    ],
  },
];