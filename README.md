# Notes - please read

- The implementation took me 3 hours exactly
- Sadly, I did not have more time to implement remaining features
- However, the users page is fully working, and the animals page would be a copy
- The InQool API does not set appropriate CORS headers, so there is **env variable VITE_USE_MOCK**.
  - intentionally committed to the repository so that things work out of the box

Future extensions:

- implementing the /animals page
- adding a navbar
- optimistically updating instead of refetching the data after an update
- more languages & better localization

## Introduction

You are given a simple REST API and asked to create a web application. The
API is a simple REST API with two entities - user and animal. You need to
create a web application to interact with these entities.

## Task

Create a web application using React and TypeScript. If you prefer to use
Next.js, that’s fine too. You must communicate with a REST API to fetch and
update data. For this application, we prefer client-side fetching over server-side.
We expect you to use some libraries for forms, fetching data, data validation,
etc.

### Page /users

• Fetch a list of users from the API
• Display the list of users in a table
• Add a filter to the table to filter the users by name (in the future, there
are plans to add more filters)
• Add a button to clear the filter
• Add a form to add a new user to the list
• Add a button to mark a user as banned
• Add a button to edit a user’s details

### Page /animals

Now do the same for the second entity - animal.
