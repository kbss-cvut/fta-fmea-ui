# FTA and FMEA tool

This tool provides two types of reliability analyses - `Fault Tree Analysis (FTA)` and `Failure Modes and Effects
Analysis (FMEA)`.
It is primarily focused on FTA which offers possibilities for system partonomy definition,
[FTA construction](./doc/fta-construction-algorithm.md) and an automatic conversion of the trees to FMEA tables given the unified ontological model. Detailed description of its features is described in [user manual](./doc/user-manual.md).

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
2. Set `GRAPHDB_ZIP` variable in `.env` file to point to the downloaded zip file.
3. Run `docker-compose up -d` to start the application.

-----
This repository was created within the project [LTACH19032](https://starfos.tacr.cz/en/project/LTACH19032).
<p align="center">
    <img src="https://seeklogo.com/images/M/msmt-logo-84BD22A97D-seeklogo.com.png"/>
</p>

<p align="center">
    <img src="https://www.msmt.cz/uploads/Odbor%2033/inter-excellence-color.jpg"/>
</p>

