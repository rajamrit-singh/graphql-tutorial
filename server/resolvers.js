import { createJob, deleteJob, getJob, getJobCount, getJobs, getJobsAtCompany, updateJob } from './db/jobs.js'
import { GraphQLError } from 'graphql'
import { getUser } from './db/users.js';

export const resolvers = {
    Query: {
        job: async (_root, { id }) => {
            const job = await getJob(id);
            if (!job) {
                throw new notFoundError('No job found with id ' + id);
            }
            return job;
        },
        jobs: async (_root, { limit, offset }) => {
            console.log('asdasd')
            const items = await getJobs(limit, offset)
            const { totalCount } = await getJobCount();
            console.log(totalCount)
            return {
                items,
                totalCount
            }
        },
        company: async (_root, { id }) => {
            const company = await getCompany(id)
            if (!company) {
                throw new notFoundError('No company found with id' + id)
            }
            return company
        }
    },

    Mutation: {
        createJob: async (_root, {input: {title, description}}, { user }) => {
            if (!user) {
                throw unauthorizedError('Missing Authentication');
            }
            const job = await createJob({companyId: user.companyId, title, description});
            return job
        },
        deleteJob: async (_root, { id }, { user }) => {
            if (!user) {
                throw unauthorizedError('Missing Authentication')
            }
            const job = await deleteJob(id, user.companyId);
            if (job) {
                return job;
            } else {
                throw notFoundError('No job could be found');
            }
        },
        updateJob: async (_root, { input }, { user }) => {
            if (!user) {
                throw unauthorizedError('Missing Authentication');
            }
            const job = await updateJob(input, user.companyId);
            if (job) {
                return job;
            } else {
                throw notFoundError('No job could be found');
            }
        }
    },

    Job: {
        date: (job) => job.createdAt.slice(0, 'yyyy-mm-dd'.length),
        company: (job, _args, { companyLoader }) => {
            return companyLoader.load(job.companyId);
        },
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

function unauthorizedError(message) {
    return new GraphQLError(message, {
        extensions: 'UNAUTHORIZED'
    })
}