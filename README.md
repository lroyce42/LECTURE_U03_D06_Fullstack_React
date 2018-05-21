# Full Stack with React

Today we will be discussing how to build a full stack app with a Node/Express backend and a React frontend

## Big Picture

_What the frontend is going on??_

### Node/Express

Node (specify Express) is our backend.  Here is Express's job:

* Serving up a static HTML page with our React code.  The HTML page itself has only one div: `<div id="root"></div>`
  - React will run on the frontend to handle all the rendering
* All database transactions (for CRUD actions).  We will be using Postgres (but the same concepts apply for any DB)
* Responding (with JSON) to API requests from the the frontend

Locally, Node will be running on port **4200**.


### React

React is our frontend.  Here is React's job:

* Page rendering
* Frontend routing (via React Router)
* Making AJAX requests (via Axios) to the backend to CRUD data.  The client does **not** talk to our database.  Just to our server.  The server talks to the database.

Locally, React will be running on port **3000**.

> [Refresher here](https://git.generalassemb.ly/code-rosie/LAB_U03_D01_Intro_to_React#clarification) on why we have a local server to use React



## Why?

Using Express as our backend and React as our frontend is an alternative to doing all of our rendering from the backend (with EJS or Handlebars).  This is more complex but has many advantages.

### Better user experience for the client

Having rendering and routing done from the frontend allows us to create SPAs.  This is appears faster for the client.

* The client does not have to wait for an entire page to load to see part of a page.
* If a connection is lost, the client can still navigate the app and see any data that does not need to be request via AJAX.
* The browser can also cache the pages with a [Service Worker](https://developers.google.com/web/fundamentals/primers/service-workers/). `create-react-app` does this for us.

### Separation of Concerns


Having a separation of concerns can keep our code more organized and is helpful when working on large teams.

* All logic dealing with how data should be displayed lives on the frontend. (Not the case when using a view engine)
* The backend deals with responding to and responding with JSON
* Backend engineers can work on the API and frontend engineers can work rendering.  These can even be entirely separate repos (not what we will be doing today but many teams do do this)


## The React-Express Environment

### Local dev

Locally we will be using [`concurrently`](https://www.npmjs.com/package/concurrently).  This will allow us to run Express and React from one process!  That means only one tab in terminal.


### Heroku

On Heroku we only need to build the React code when we deploy and run the server.  The server will be serving up the React code.  In order to do this we will have Heroku build all of our React code.  It will take all of our [Webpack and Babel](https://git.generalassemb.ly/code-rosie/LECTURE_U03_D01_Intro_to_React#how-react-works) code and spit out browser ready files.

More info on deploying `create-react-app` apps [here](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment)


## File Structure

It is 100% OK if you don't understand all of it.  You may (and should) copy-paste most of what you see here.

> For real: understanding how to make the pieces that are specific to your app is much more important than understanding how to get the environments set up.  This is a place where it is OK to just copy and paste.

### `package.json`

At the top-level our app in an Express app.  It has it's own `package.json` that looks something like this.  The `scripts` section is what's important here.


```js
{
  "name": "lecture_u03_d06_fullstack_react",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon server.js",
    "start": "concurrently \"npm run dev\" \"npm run client\"",
    "server": "node server.js",
    "client": "cd client && npm start",
    "heroku-postbuild": "cd client/ && npm install && npm install --only=dev --no-shrinkwrap && npm run build"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.18.3",
    "concurrently": "^3.5.1",
    "express": "^4.16.3",
    "pg-promise": "^8.4.4"
  },
  "devDependencies": {
    "nodemon": "^1.17.4"
  }
}
```

<details><summary>Breakdown on each piece here</summary>
<p>

Inside of the `scripts` block:

* `test`: whatever you tests you want to run
* `dev`: you can run this to run just your server (but you probably won't)
* `start`: in this case will run both the server and client
* `server`: will be run by Heroku.  Does not run client.
* `client`: you can run this to run just your client (but you probably won't)
* `heroku-postbuild`: definitely copy-paste this one.  Heroku will automatically run this command after you deploy.  It will build all of your React code and put it inside of `client/build` directory.

</p>
</details>

Running `npm start` will run both Node and React concurrently!  One tab!  Go to [localhost:3000](http://localhost:3000) and you should see your React app.


> As always you need to `npm install` first.

As you can see, this one also has some dependencies we might need for our Node app.  These all get here by doing, for example, `npm install --save body-parser` **inside of the root of our project**.


### `Procfile`

Add a file called `Procfile` in the root. Heroku will automatically read and run the `web` command when you deploy.

```
web: npm run server
```

Your `Procfile` will look exactly like the above.  This way, locally you can run whatever you want (which in our case is `npm start`) but Heroku will run `npm run server` (which according our `package.json` will run `node server.js`).


### `server.js`

Your `server.js` looks just as we have done it in the past with a few additions.

When Heroku runs `scripts.heroku-postbuild` it will put all of the browser-ready React code in the `./client/build` directory.  We want all of this to be public.

```js
// ...
const path = require('path');
// ...

// make everything in ./client/build public
app.use(express.static(path.resolve(__dirname, './client/build')));
```


Then we should end with something like this:

```js
// all routes / routers above here

// fallback
app.get('*', (req, res) => {
  if (isXhr(req)) { // if ajax request
    // no route found
    res.status(404).json({error: 'not found'});
  } else { // else, browser request
    // let react handle routing client side
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
  }
});

// https://stackoverflow.com/a/28540611
const isXhr = req => req.xhr || req.headers.accept.indexOf('json') > -1;
// this works for checking Axios requests but not every AJAX library
```

`app.get('*')` is a last chance to give a response when no route matches (so this must go last).  In the callback we are checking to see if the request is Xhr/Ajax.  If so, we can send a `404`.  If not, we can assume it is a browser request and we should let React-Router handle the routing.

All the routes before `*` should start with `/api` (`/api/people`, `/api/people/:id`, etc.)  This way you can have a route in React `/people` that is not the same as an route in your Express app.


### `client/package.json`

Our React code goes inside of a `client` directory.  It has it's own `package.json`.  It looks something like this.  The `proxy` attribute is what's important here.  That is what allows us to locally make requests to the backend on a different port.  (React is 3000, Express is 4200).

```js
{
  "name": "client",
  "version": "0.1.0",
  "private": true,
  "proxy": "http://localhost:4200/",
  "dependencies": {
    "axios": "^0.18.0",
    "react": "^16.3.2",
    "react-dom": "^16.3.2",
    "react-router-dom": "^4.2.2",
    "react-scripts": "1.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

As you can see, this one also has some dependencies we might need for our React app.  These all get here by doing, for example, `npm install --save axios` **inside of the `client` directory**.

The rest of the code inside of your `client` directory is just a React App created with `create-react-app`.  Since we have it in our Express repo, it should **not** be it's own repo (no repos inside of repos).  So you should create the app with `create-react-app` not `cra`.

You can make all api requests to your app without ever having to specify the port or domain.

Example:

```js
class ThingsIndex extends Component {
  // ...

  componentDidMount () {
    // do not add port or domain. this will work in both dev and prod! (local and heroku)
    axios.get('/api/things').then(res => {
      this.setState({things: res.data})
    });
  }

}
```


### Hints

Do yourself a favor.  Don't have any other servers running.  Close out of all over Terminal and Atom windows.  You should have one terminal windows with exactly the three following tabs:

* One running `npm start` from the root directory.  That will run Node and React concurrently.
* One that stays in the command line in the root directory.
  - Here you can run `npm install --save <WHATEVER>` for any packages needed by your server
* One that stays in the command line in the `client` directory.
  - Here you can run `npm install --save <WHATEVER>` for any packages needed by your React app


The order is up to you but pick an order than makes sense to you and stick with it. If you stick with this you are much less likely to feel disorganized.


## Lab

Let us build a frontend to the Express `doggo` app we have been working on.  (It should similar to [this](https://git.generalassemb.ly/code-rosie/LECTURE_U03_D06_Refactor-and-Deploy-API/tree/master/doggo-refactored) but it should be it's own repo).

### Setup

* Close out of all extra Terminal and Atom windows.  At most you should have this repo open in Atom and possibly this directory open in terminal.
* In a new Terminal window, `cd` into your `doggo` Express app.  The repo itself should be an App. (Not an app in a subdirectory of the Repo. I.e the root of the repo has `package.json`).  Open up Atom here.

Commit after each step below:

### Server-side Setup

* Make the `scripts` section of your `package.json` look like that of this repo.
  - If your file is called `index.js` instead of `server.js` that part might change.
* Add a `Procfile` that looks exactly like this one.
* `npm install --save concurrently`, add `package.json`/`package-lock.json`
* Update your `server.js` section to reflect what we saw [here](https://git.generalassemb.ly/code-rosie/LECTURE_U03_D06_Fullstack_React#serverjs)
* Change the port from **3000** to **4200**
* Update your dog router path to be `/api/dogs` instead of just `/dogs`

### Client-side Setup

* Inside of the root of your project run `create-create-app client`
  - Do not use `cra` as this creates a new repo.
* Open up a new terminal tab and `cd` into that directory.
* Add `"proxy": "http://localhost:4200/",` to `client/package.json`
  - Order does not matter but keep in mind that there should be a comma at the end of a line if and only if it is followed by another attribute

### Server + client setup

* Open a new tab. `cd` into the root of your project (not in `client`) and run `npm start`.  Go to [localhost:3000](http://localhost:3000) and there should be a React App running.
* You should now have exactly [3 tabs](https://git.generalassemb.ly/code-rosie/LECTURE_U03_D06_Fullstack_React#hints)
* Test that the proxy is working
  - We are going to be using `Axios` but as a quick test we can use `fetch`
  - Paste this into the Chrome console in the React tab
  - `fetch('/api/dogs').then(r => r.json()).then(console.log)`
  - If you get a response with 3 dogs you are good to go!


### Fun stuff!

Now you can actually write your React code. **Inside of the `client` directory**:

* `npm install --save axios`.  Add files and commit
* `npm install --save react-router-dom`.  Add files and commit
* Create a `/dogs` route.  List all the of their names
* Create a `/dogs/:id` route.  Show information about each dog
* Add a link to `/dogs` somewhere that is always visible
* Add a link to each dog on the `/dogs` page.
* Make this app into your own!  Add fun things!

### Deployment

Try deploying your app!

* If this app has already been deployed just run `git push heroku master`.
* If you have not yet deployed, follow the instructions from [this lecture](https://git.generalassemb.ly/code-rosie/LECTURE_U03_D06_Refactor-and-Deploy-API)
* If something goes wrong:
  - Check the above steps. Is your `package.json` correct?  Your `client/package.json`?  Your `server.js`? Is your `Profile` checked in?
  - See if you get any info from `heroku logs --tail`.  Read it closely
  - If something is showing but it's not what you expect, open up the Chrome console.  Is an error?  A **404**?  A **500**?
