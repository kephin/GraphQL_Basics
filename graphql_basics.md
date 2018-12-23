# GraphQL Basics: Schema and Queries

There are three major operations we can perform on any GraphQL API.

1. Query: fetch data
2. Mutation: change data
3. Subscription: watch data for changes, which is great for real-time applications

```graphql
query {
  posts {
    id
    title
  }
  test
}
```

We're able to get very useful feedback on our fields before we actually ever send the request off. For example, GraphQL knows 'posts' is valid and 'test' is invalid.

How's all of this possible?

And how for example are we able to type in 'p' and have it know that there is a 'post' field I can actually request?

> All is because GraphQL APIs are self-documented! We no longer need to make a dummy request to the endpoint and console.log out the data.
