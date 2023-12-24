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

const apolloClient = new ApolloClient({
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

const jobByIdQuery = gql`query JobById($id : ID!){
  job(id: $id) {
    ...JobDetail
  }
}
${jobDetailFragment}
`

export async function getJobs() {
  // gql is used for syntax highlighting
  const query = gql`query GetJobs{
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

  const { data } = await apolloClient.query({
    query,
    fetchPolicy: 'network-only'
  });
  return data.jobs;
}

export async function getJob(id) {
  const { data } = await apolloClient.query(
    {
      query: jobByIdQuery,
      variables: {
        id
    }
  });
  return data.job
}

export async function getCompany(id) {
  const query = gql`query CompanyByID($id: ID!) {
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
  }`;

  const { data } = await apolloClient.query(
    {
      query,
      variables: {
        id
    }
  });
  return data.company
}

export async function createJob({ title, description }) {
  const mutation = gql`mutation CreateJob($input: CreateJobInput!){
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
  `
  const { data } = await apolloClient.mutate({
    mutation,
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

