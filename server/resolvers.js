import { getCompany } from './db/companies.js'
import { createJob, deleteJob, getJob, getJobs, getJobsAtCompany, updateJob } from './db/jobs.js'
import { GraphQLError } from 'graphql'

export const resolvers = {
    Query: {
        job: async (_root, { id }) => {
            const job = await getJob(id);
            if (!job) {
                throw new notFoundError('No job found with id ' + id);
            }
            return job;
        },
        jobs: () => getJobs(),
        company: async (_root, { id }) => {
            const company = await getCompany(id)
            if (!company) {
                throw new notFoundError('No company found with id' + id)
            }
            return company
        }
    },

    Mutation: {
        createJob: async (_root, {input: {title, description}}) => {
            // console.log(args);
            console.log(title)
            const companyId = 'FjcJCHJALA4i';
            const job = await createJob({companyId, title, description});
            console.log(job);
            return job
        },
        deleteJob: async (_root, { id }) => deleteJob(id),
        updateJob: async (_root, { input}) => updateJob(input)
    },

    Job: {
        date: (job) => job.createdAt.slice(0, 'yyyy-mm-dd'.length),
        company: async (job) => getCompany(job.companyId)
    },
    Company: {
        jobs: (company) => getJobsAtCompany(company.id)
    }
}

function notFoundError(message) {
    return new GraphQLError(message, {
        extensions: 'NOT_FOUND'
    })
}