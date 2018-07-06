---
title: React & GraphQL
url: /docs/react-graphql
type: docs
include:
  - docs.sidebar
---

The preferred way of accessing GraphQL endpoints from React components
is by creating an instance of the [GraphQLWebSocket](/docs/graphql-web-socket)
in your main script and forwarding it to your React components.

```js
const gql = new GraphQLWebSocket();
InitReact({
    globalProps: { gql }
});
```

Since this prop will only be available on the front-end
you should check if `this.props.gql` is undefined before accessing it
to avoid errors during server-side rendering.

One of the more interesting things we can do with React & GraphQL
is subscribing to an event feed.  
Here's a template for a React component that will update it's state when an event occurs:

```ts
export type GqlProps =
{
    gql?: GraphQLWebSocket
}

export class SubscribedComponent extends React.Component<GqlProps>
{
    public componentWillMount(): void
    {
        if (this.props.gql)
        {
            this.props.gql.promiseOnOpen.then(() =>
            {
                this.props.gql.subscribe(
                    { id: 'event-feed-endpoint' },
                    (e: EventData) =>
                    {
                        if (e.errors)
                        {
                            console.log(e.errors);
                        }
                        else
                        {
                            this.setState(e.data);
                        }
                    });
            });
        }
    }
}
```
