# FTA and FMEA tool

This tool provides two types of reliability analyses - `Fault Tree Analysis (FTA)` and `Failure Modes and Effects
Analysis (FMEA)`.
It is primarily focused on FTA which offers possibilities for system partonomy definition,
[FTA construction](./doc/fta-construction-algorithm.md) and an automatic conversion of the trees to FMEA tables given the unified ontological model.

## Execution

```shell script
npm install
npm run watch
npx serve
```

## Registration
Tool also supports configuration to disable registration of new user within security, but by default, everybody can register. 
There are two flags which need to be set:

* Backend - Run application with `-Dspring.profiles.active=admin-registration-only` profile
* Frontend - Set `REACT_APP_ADMIN_REGISTRATION_ONLY` in [.env.prod](.env.prod) to true




## Recommended Development Approach

- webpack setup
- styling (css/sass)
- routing
- user context
- data flow through the app
- modules binding
- consultation

## Related links
* Running demo application - [kbss/fta-fmea-demo](https://kbss.felk.cvut.cz/fta-fmea-demo/) 
* Backend project - [fta-fmea](https://github.com/kbss-cvut/fta-fmea)

## Dockerization
1. Download [GraphDB](https://graphdb.ontotext.com/) standalone server ZIP archive and place it into the `deploy/db-server` folder.
2. Set `GRAPHDB_ZIP` variable in `deploy/db-server/Dockerfile` to the name of the file you downloaded.
3. Clone [fta-fmea](https://github.com/kbss-cvut/fta-fmea) as a subfolder of the 'deploy' folder, i.e.:
`git clone https://github.com/kbss-cvut/fta-fmea.git`
4. Run `docker-compose -f deploy/docker-compose.yml up -d` to start the application.