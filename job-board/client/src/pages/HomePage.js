import { useState } from 'react';
import JobList from '../components/JobList';
import { useJobs } from '../lib/graphql/hooks';
import PaginationBar from '../components/PaginationBar';


// getJobs().then((jobs)=>{console.log('jobs',jobs);})

function HomePage() {

  const JOBS_PER_PAGES= 20;

  const [currentPage, setCurrentPage] = useState(1);
  const {jobs,loading,error}= useJobs(JOBS_PER_PAGES, (currentPage-1)*JOBS_PER_PAGES);
  
  if(loading){
    return <div>Loading...</div>
  }

  if(error){
    return <div className='has-text-danger'>Data unavailable</div>
  }

  const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGES);

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <JobList jobs={jobs.items} />
    </div>
  );
}

export default HomePage;
