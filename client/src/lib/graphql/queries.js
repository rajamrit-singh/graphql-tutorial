import { getAccessToken } from '../auth'
import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink, gql, concat } from '@apollo/client'

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' });

const authLink = new ApolloLink((operation, forward) => {

  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
  } else {
    return {}
  }
  return forward(operation);
})

export const companyByIdQuery = gql`query CompanyByID($id: ID!) {
  company(id: $id) {
    id
    name
    description
    jobs {
      id
      title
      description
      date
  }
  }
}`

export const jobsQuery = gql`query GetJobs{
  jobs {
    id
    title
    date
    company {
      id
      name
    }
  }
}`

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
})

const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`;

export const jobByIdQuery = gql`query JobById($id : ID!){
  job(id: $id) {
    ...JobDetail
  }
}
${jobDetailFragment}
`
export const createJobMutation = gql`mutation CreateJob($input: CreateJobInput!){
  job: createJob(input: $input) {
    ...JobDetail
  }
}
${jobDetailFragment}
`

/*
export async function createJob({ title, description }) {

  const { data } = await apolloClient.mutate({
    createJobMutation,
    variables: {
      input: {
        title, description
      }
    },
    // This is a function that will be called when we get the response and
    // receives 2 params

    // This is how we can write data directly into apollo client cache
    update: (cache, { data }) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: data.job.id },
        data
      })
    }
  });

  return data.job;
}

*/