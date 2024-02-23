# FTA and FMEA tool

This tool provides two types of reliability analyses - `Fault Tree Analysis (FTA)` and `Failure Modes and Effects
Analysis (FMEA)`.
It is primarily focused on FTA which offers possibilities for system partonomy definition,
[FTA construction](./doc/fta-construction-algorithm.md) and an automatic conversion of the trees to FMEA tables given the unified ontological model. Detailed description of its features is described in [user manual](./doc/user-manual.md).

## Execution

```shell script
npm install
npm run build
npm run preview
```

## Registration

Tool also supports configuration to disable registration of new user within security, but by default, everybody can register.
There are two flags which need to be set:

- Backend - Run application with `-Dspring.profiles.active=admin-registration-only` profile
- Frontend - Set `FTA_FMEA_APP_ADMIN_REGISTRATION_ONLY` in [.env.production](.env.production) to true

## General Info

We use [Prettier](https://prettier.io/) to keep the codebase formatting consistent. To simplify this process, a pre-commit Git hook is set up with [Husky](https://github.com/typicode/husky).
This hook runs Prettier code formatting before every commit.

### Pre-commit troubleshooting

If you experience issues on pre-commit using the GUI and that you are using a node version manager, such as nvm, add the following script:

```
# ~/.config/husky/init.sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

For more information, follow [this guide](https://typicode.github.io/husky/how-to.html#node-version-managers-and-guis).

## Recommended Development Approach

- webpack setup
- styling (css/sass)
- routing
- user context
- data flow through the app
- modules binding
- consultation

## Related links

- Running demo application - [kbss/fta-fmea-demo](https://kbss.felk.cvut.cz/fta-fmea-demo/)
- Backend project - [fta-fmea](https://github.com/kbss-cvut/fta-fmea)

## Running complete tool in Docker

1. Change working directory using `cd ./deploy/no-proxy`
2. Run `docker-compose up -d` to start the application.
3. The application should be accessible at `http:/localhost:8080/`

---

This repository was created within the project [LTACH19032](https://starfos.tacr.cz/en/project/LTACH19032).

<p align="center">
    <img src="https://seeklogo.com/images/M/msmt-logo-84BD22A97D-seeklogo.com.png"/>
</p>

<p align="center">
    <img src="https://www.msmt.cz/uploads/Odbor%2033/inter-excellence-color.jpg"/>
</p>
