import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loading = () => {
	return (
		<section>
			<div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
				<h1 className="h1-bold text-dark100_light900">All Jobs</h1>
			</div>

			<div className="mb-10 mt-11 flex flex-wrap items-center justify-between gap-5">
				<Skeleton className="h-14 flex-1"/>
				<div className="hidden max-md:block">
					<Skeleton className='h-14 w-28' />
				</div>
			</div>

			<div className="my-10 hidden flex-row gap-3 md:flex">
				<Skeleton className="h-9 w-28" />
				<Skeleton className="h-9 w-28" />
				<Skeleton className="h-9 w-47" />
				<Skeleton className="h-9 w-33" />
				<Skeleton className="h-9 w-25" />
			</div>

			<div className="flex w-full flex-col lg:flex-row lg:flex-wrap gap-6">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
					<Skeleton key={item} className="h-48 lg:w-48/100 rounded-xl" />
				))}
			</div>
		</section>
	)
}

export default Loading;