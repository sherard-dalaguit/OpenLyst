import React from "react";
import {IconBookmark, IconCircleCheck, IconHome, IconSettings} from "@tabler/icons-react";

export const servicesContent = [
  {
    title: "Aggregated Job Listings",
    description: "Browse thousands of remote jobs in one place. Nomadlyst pulls roles from top boards like WeWorkRemotely, RemoteOK, and Wellfound into a single, unified feed—so you don’t have to hop between platforms.",
    image: "/screenshots/nomadlyst_2.webp",
  },
  {
    title: "Save & Track Jobs",
    description: "Bookmark jobs you’re interested in and revisit them anytime. Keep track of saved roles as you prepare applications, so nothing slips through the cracks.",
    image: "/screenshots/nomadlyst_3.webp",
  },
  {
    title: "Advanced Search & Filters",
    description: "Narrow down listings by role, industry, salary range, and more to find your perfect match. Combine multiple criteria to refine results with pinpoint accuracy.",
    image: "/screenshots/nomadlyst_4.webp",
  },
	{
    title: "Email Digests",
    description: "Stay updated without constant refreshing. Get curated daily or weekly emails with the latest remote jobs that match your interests—delivered straight to your inbox.",
    image: "/screenshots/nomadlyst_5.webp",
  },
];

export const FAQDetails = [
  {
    value: "item-1",
    title: "What is Nomadlyst?",
    content: "Nomadlyst is a free platform that collects remote job postings from multiple top job boards and displays them in one place. Instead of visiting several sites every day, you can browse everything from one dashboard.",
  },
  {
    value: "item-2",
    title: "How often are jobs updated?",
    content: "New jobs are pulled in throughout the day, so the feed is always fresh. You’ll see the latest postings whenever you log in.",
  },
  {
    value: "item-3",
    title: "Can I get jobs sent to my email?",
    content: "Yes! You can subscribe to daily or weekly digests to receive the newest jobs that match your preferred categories straight to your inbox.",
  },
  {
    value: "item-4",
    title: "Is Nomadlyst free to use?",
    content: "Absolutely. Nomadlyst is completely free—there are no hidden fees, subscriptions, or paywalls. I don't care about monetizing your job search.",
  },
  {
    value: "item-5",
    title: "Do you only list software engineering jobs?",
    content: "No. While Nomadlyst includes plenty of developer roles, it also covers design, marketing, sales, customer support, product management, and more. You can filter by category to see only the jobs you care about.",
  },
  {
    value: "item-6",
    title: "How do I keep track of jobs I’m interested in?",
    content: "You can save jobs to your personal list with one click, and they’ll be waiting for you in your Saved Jobs page whenever you return.",
  },
  {
    value: "item-7",
    title: "What about applied jobs?",
    content: "Nomadlyst lets you mark jobs as 'applied' so you can easily track your progress and avoid applying to the same posting twice.",
  },
  {
    value: "item-8",
    title: "Do you store or share my applications?",
    content: "No. Nomadlyst doesn't even have a feature to submit job applications to companies directly—it just links you to the original posting. Saved and applied jobs are only stored in your account for your personal tracking.",
  },
	{
		value: "item-9",
		title: "Why did you make this?",
		content: "After spending hours each day hopping between job boards, I wanted a simpler way to find remote roles. Nomadlyst is my solution to streamline the search process and help others do the same. Plus, the current SWE market is looking pretty tough so I wanted to build something useful that I can bring up in interviews 😭.",
	},
]

export const sidebarLinks = [
	{
    icon: <IconHome className="w-6 h-6" />,
		label: 'Jobs',
		route: '/jobs'
	},
	{
    icon: <IconBookmark className="w-6 h-6" />,
		label: 'Saved Jobs',
		route: '/saved-jobs'
	},
	{
    icon: <IconCircleCheck className="w-6 h-6" />,
		label: 'Applied Jobs',
		route: '/applied-jobs'
	},
  {
    icon: <IconSettings className="w-6 h-6" />,
    label: 'Settings',
    route: '/settings'
  },
];

export const dailyTips = [
  "Customize your resume and cover letter for each role",
  "Apply within 48 hours of a posting for higher visibility",
  "Track your applications to avoid duplicate submissions",
  "Treat your job search like a part-time job",
  "Follow up 3–5 days after applying",
  "Keep your resume to one page unless you have 10+ years experience",
  "Highlight measurable results in your achievements",
  "Use keywords from the job description in your application",
  "Connect with recruiters on LinkedIn",
  "Ask for informational interviews with industry professionals",
  "Save roles even if you’re unsure—you can revisit later",
  "Practice your interview answers out loud",
  "Research the company before applying",
  "Apply to stretch roles slightly above your current level",
  "Set weekly job application goals",
  "Don’t wait for motivation—build a routine",
  "Apply even if you don’t meet 100% of the requirements",
  "Always proofread before submitting",
  "Network with peers in your industry",
  "Use job boards and company career pages directly",
  "Block off time each day for your job search",
  "Review your applications weekly and follow up",
  "Leverage your personal network for referrals",
  "Stay persistent—one ‘yes’ can change everything",
  "Every no brings you closer to your yes"
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
    link: "https://github.com/sherard-dalaguit",
  },
  {
    id: 2,
    img: "/link.svg",
    link: "https://www.linkedin.com/in/sherard-d/"
  },
  {
    id: 3,
    img: "/insta.svg",
    link: "https://www.instagram.com/sherard_dalaguit/"
  },
];