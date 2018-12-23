# Why GraphQL

:zap: GraphQL is fast

Consider a blog website when we try to fetch a post:

If you're using REST APIs, you may need 3 fetch calls:

1) GET /posts/123
2) GET /posts?author=5678
3) GET /posts/123/comments

But while using GraphQL, you just need 1:

1) POST /graphql (with a GraphQL query)

> GraphQL query lets the client describe exactly what data it needs and gets that data from the server, nothing less and nothing more! As opposed to traditional REST API endpoints where the server determines what data comes back.

:smiley: GraphQL is flexible

Actually, from the example of REST API, we can create a new endpoint to fetch everything, which is the post, comments and other posts by author.

So this new endpoint will give the client everything it needs to render that page with just a single HTTP request.

What's the problem?

The problem of this now when we wrap three endpoints into one, it's OK for web application in desktop though. But how about mobile application?

We have less screen area, we have battery life to worry about, we have slow and expensive data. We want to make sure we're not abusing the device resource!

> Desktop application and mobile application don't need the same data for the same page. They want a flexible way for the individual clients to request exactly the data they need at the point of time. Nothing less and nothing more.

So maybe on the mobile device, we don't want to load comments until the user clicks a button to show comments. It would be nice if we could fetch the comments later when necessary.

:coffee: GraphQL is easy to use at simple to maintain

With above, we can say GraphQL creates fast and flexible APIs, giving clients complete control to ask for just the data they need.

1) Fewer HTTP requests
2) Flexible data querying
3) Less code to manage
