<p align="center">
 <img src="https://raw.githubusercontent.com/soulsam480/furikaeru/master/app/public/icon-144.png" alt="Furi logo" />
</p>
<h1 align="center"> Furikaeru </h1>

> A look back

A small app for discussing retro while being `Anonymous`. Create public/private boards with a simple `kanban` baord interface and `realtime` changes. Built with a smooth and approachable UI, Furi is is more than an app for discussing retro.

![GitHub package.json version](https://img.shields.io/github/package-json/v/soulsam480/furikaeru)

### Status

- Hosted -> https://furikaeru.sambitsahoo.com
- Development -> public alpha
- Roadmap board -> [Don't spam please!](https://furikaeru.sambitsahoo.com/62b79a16-a97f-41c4-a6f6-8b7256be10d9/)

#### Features
Current:
- Create/delete Boards (public only for now)
- Add/Edit/remove Cards
- Vote on cards
- Comment/vote comment on cards
- Edit Board title/ Column title
- Column color customization
- Private boards
- Error handling

Projected:
- Add comment edit
- Add more in the public [roadmap board](https://furikaeru.sambitsahoo.com/62b79a16-a97f-41c4-a6f6-8b7256be10d9/)

#### Furi component library
At the heart of `Furikaeru`, there is a standalone `vue 3` component library. There are only a few components, which are being used repeatedly throughout the app. It was designed on the basis of the project needs but has room for customisations. To view or use the components have a look [here](./app/src/components/lib).
#### Stack

API:
- SQLite 3
- TypeORM
- Expressjs
- SocketIo
- Passport (Google OAuth2)
- TypeScript

APP:
- Vue 3 
- Vite
- Vue router
- Pinia
- SocketIo client
- Iconify
- Purge icons

#### Run it lcally
> You need to have yarn installed as this repo is a `Yarn Workspace`.

- Clone/fork repo
```bash
yarn # install deps
```
- Add `env` variables.
```bash
# APP
VITE_WSS # Socket endpoint -> ws://localhost:3000
VITE_API # REST endpoint -> http://localhost:3000/furikaeru

#API
REFRESH_TOKEN_SECRET
ACCESS_TOKEN_SECRET
GCLIENT_ID
GCLIENT_SECRET
GAUTH_REDIRECT
# create a postgres db and add it here
# the DB port is hardcoded to 5432 and an extra env variable can be added to change it
PGRES_USER
PGRES_PASS
PGRES_HOST
PGRES_DB
```
- Run
```bash
yarn dev # devserver
yarn build # build 
```
Any contributions are welcome. reach me on [soulsam480@hotmail.com](mailto:soulsam480@hotmail.com)