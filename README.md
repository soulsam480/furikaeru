### Furikaeru

> Look back on

A small app for discussing retro while being Anonymous.

#### Features
Current:
- Create/delete Boards (public only for now)
- Add/Edit/remove Cards
- Vote on cards
- Comment/vote comment on cards
- Edit Board title/ Column title

Projected:
- Add comment edit
- Add user logout
- Add private boards
- Error handling
- Column color customization
#### Stack

API:
- SQLite 3
- TypeORM
- Expressjs
- SocketIo
- Socket controllers
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