import { GraphQLClient, gql } from 'graphql-request';

const client = new GraphQLClient('http://localhost:9000/graphql');

export async function getJobs() {
  // gql is used for syntax highlighting
  const query = gql`query {
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
  const { jobs } = await client.request(query);
  return jobs;
}

export async function getJob(id) {
  const query = gql`query JobById($id : ID!){
    job(id: $id) {
      id
      title
      description
      date
      company {
        id
        name
      }
    }
  }`
  const { job } = await client.request(query, { id });
  return job
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

  const { company } = await client.request(query, { id });
  return company;
}

export async function createJob({ title, description }) {
  const mutation = gql`mutation CreateJob($input: CreateJobInput!){
    job: createJob(input: $input) {
      id
    }
  }`
  const { job } = await client.request(mutation, {
    input: {
      title, description
    }
  });
  console.log(job)
  return job;
}