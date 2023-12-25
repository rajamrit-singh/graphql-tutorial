import { useMutation, useQuery } from '@apollo/client';
import { companyByIdQuery, createJobMutation, jobByIdQuery, jobsQuery } from './queries';

export function useCompany(id) {
    const { data, loading, error } = useQuery(companyByIdQuery, {
        variables: {
            id: id
        }
    });
    return { company: data?.company, loading, error: Boolean(error) }
}

export function useJob(id) {
    const { data, loading, error } = useQuery(jobByIdQuery, {
        variables: {
            id: id
        }
    });
    return { job: data?.job, loading, error: Boolean(error) }
}

export function useJobs() {
    const { data, loading, error } = useQuery(jobsQuery, {
        fetchPolicy: 'network-only'
    });
    console.log(data);
    return { jobs: data?.jobs || [], loading, error: Boolean(error) }
}

export function useCreateJob() {
    const [mutate, { loading }] = useMutation(createJobMutation);

    const createJob = async (title, description) => {
        return mutate({
            variables: { input: { title, description } },
            update: (cache, { data }) => {
                cache.writeQuery({
                    query: jobByIdQuery,
                    variables: { id: data.job.id },
                    data
                })
            }
        });
    }
    return { createJob, loading  }
}