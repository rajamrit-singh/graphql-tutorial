import { getCompany } from './db/companies.js'
import { getJob, getJobs, getJobsAtCompany } from './db/jobs.js'

export const resolvers = {
    Query: {
        job: (_root, { id }) => getJob(id),
        jobs: () => getJobs(),
        company: (_root, { id }) => getCompany(id),
    },

    Job: {
        date: (job) => job.createdAt.slice(0, 'yyyy-mm-dd'.length),
        company: async (job) => getCompany(job.companyId)
    },
    Company: {
        jobs: (company) => getJobsAtCompany(company.id)
    }
}