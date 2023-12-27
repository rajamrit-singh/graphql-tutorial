import JobList from '../components/JobList';
import { useJobs } from '../lib/graphql/hooks';
import PaginationBar from '../components/PaginationBar';
import { useState } from 'react';

const JOBS_PER_PAGE = 5;

function HomePage() {
  
  const [currentPage, setCurrentPage] = useState(1);
  const { jobs, loading, error }
    = useJobs(JOBS_PER_PAGE, (currentPage - 1) * JOBS_PER_PAGE);
  const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE)
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs?.items || []} />
      <PaginationBar
        onPageChange={setCurrentPage}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}

export default HomePage;
