import { getCompany } from './db/companies.js'
import { getJobs } from './db/jobs.js'

export const resolvers = {
    Query: {
        jobs: () => getJobs()
    },

    Job: {
        date: (job) => job.createdAt.slice(0, 'yyyy-mm-dd'.length),
        company: async (job) => getCompany(job.companyId)
    }
}