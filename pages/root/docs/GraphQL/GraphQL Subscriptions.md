---
title: GraphQL Subscriptions
url: /docs/graphql-subscriptions
type: docs
include:
  - docs.sidebar
---

Subscriptions were introduced to allow sending events to clients.
These events are usually caused by Mutations.

The main way of creating subscriptions endpoints is by inheriting
from one of the base subscription resolvers.

## SubscriptionResolverBase

Lets first see how a basic subscription resolver works.

```ts
@Subscription('counting: String')
export class CountingFeed extends SubscriptionResolverBase<string>
{
    public init(source, args, context, info)
    {
        return { done: false, count: 0 };
    }

    protected async next(state, source, args, context, info)
    {
        await timeout(1000);
        return state.done ?
            { done: true, value: undefined } :
            { done: false, value: 'Count: ' + ++state.count };
    }
}
```

In the `init()` method we initialize our state.
The state must have a `done` property set to false.

Then in the `next()` method we generate a new event every second where we increment the count.  
The `state.done` will be changed to `true` when the client tries to cancel the subscription
and in this case we return `done: true` to notify him that there are no more events.

The `next()` method will be called after it returns `done: true`.  
While it is possible to return a `value` in the last message
it is usually discarded, so we will leave it as undefined.

We can also override the `resolve()` method to alter the `value` before it is sent,
but since we are also generating the value, this is usually not going to be necessary.

## SubscriptionEventResolverBase

The event-based subscriptions are much easier to implement,
you simply have to assign an `EventEmitter` and a list of event to subscribe to.

```ts
const postCreated = 'post_created';
const postUpdates = 'post_updates';
const postDeleted = 'post_deleted';

const eventEmitter: EventEmitter = new EventEmitter();

@Mutation('postCreate(author: ID, text: String): Post', PostTypeDefs)
export class PostCreateMutation implements IResolver
{
    public handle(source, {author, text}, context, info): Post
    {
        const post: Post = { /* ... */ };
        posts.push(post);
        eventEmitter.emit(postCreated, post);
        return post;
    }
}

// other mutations...

@Subscription('post: Post', PostTypeDefs)
export class PostSubscription extends SubscriptionEventResolverBase
{
    public eventNames: Array<string> = [postCreated, postUpdates, postDeleted];
    public eventEmitter: EventEmitter = eventEmitter;
}
```

Here we listen for any mutation on any post.
Our subscription will then return the new post data.

But most of the time we will want to subscribe to a limited number of items.  
Lets see how we could subscribe only to changes on a single post.

```ts
@Subscription('post(id: ID!): Post')
export class PostSubscription extends SubscriptionEventResolverBase
{
    public eventNames: Array<string> = [postCreated, postUpdates, postDeleted];
    public eventEmitter: EventEmitter = eventEmitter;

    public filterValue(value: Post, source, {id}, context, info): boolean
    {
        return value.id == id;
    }
}
```

Here we defined an `id` argument and we check if the altered post has the same id.

We can also override the `resolve()` method to alter the event before it is sent.

To check permissions and validate the request you should override `subscribe()` method
and call the base implementation if your checks pass.

```ts
@Subscription('post(id: ID!): Post')
export class PostSubscription extends SubscriptionEventResolverBase
{
    public subscribe(source, args, context, info)
    {
        // check access
        // validate request
        return super.subscribe(source, args, context, info);
    }
}
```
