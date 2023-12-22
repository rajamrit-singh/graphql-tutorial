export const resolvers = {
    Query: {
        jobs: () => {
            return [{
                id: '1',
                title: 'The Title',
                description: 'The description '
            },
            {
                id: '2',
                title: 'The Title 2 ',
                description: 'The description '
            },
        ]
        }
    }
}