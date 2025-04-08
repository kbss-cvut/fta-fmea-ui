# FTA and FMEA tool

This tool provides two types of reliability analyses - `Fault Tree Analysis (FTA)` and `Failure Modes and Effects
Analysis (FMEA)`.
It is primarily focused on FTA, which offers possibilities for system partonomy definition,
[FTA construction](./doc/fta-construction-algorithm.md) and automatic conversion of the trees to FMEA tables given the unified ontological model. A detailed description of its features is described in [user manual](./doc/user-manual.md).

This repository contains the frontend of the tool. The backend is written in Java and is developed separately (its repository can be found [here](https://github.com/kbss-cvut/fta-fmea)).
A live demo of the tool is available [here](https://kbss.felk.cvut.cz/fta-fmea-demo/).


## Execution

```shell script
npm install
npm run build
npm run preview
```

## Running complete tool in Docker

1. Change the working directory using `cd ./deploy/internal-auth`
2. Run `docker-compose up -d` to start the application.
3. The application should be accessible at `http:/localhost:1235/`


## Configuration

The tool also supports configuration to disable registration of new users within security, but by default, everybody can register.
There are two flags which need to be set:

- Backend - Run application with `-Dspring.profiles.active=admin-registration-only` profile
- Frontend - Set `FTA_FMEA_APP_ADMIN_REGISTRATION_ONLY` in [.env.production](.env.production) to true

## Development

To develop the tool, the easiest way to run it is as follows:
1. Run the complete tool as described in [Running complete tool in Docker](#running-complete-tool-in-docker)
2. Run frontend of the tool that connects to just-started docker services:
```shell script
npm install
npm run dev
```

Note that the guide above runs two frontends, one as a docker service from step 1 and another executed by `npm run dev` from step 2.

### Recommended Development Approach

- Vite setup
- styling (css/sass)
- routing
- user context
- data flow through the app
- modules binding
- consultation

### Prettier

We use [Prettier](https://prettier.io/) to keep the codebase formatting consistent. To simplify this process, a pre-commit Git hook is set up with [Husky](https://github.com/typicode/husky).
This hook runs Prettier code formatting before every commit.

#### Pre-commit troubleshooting

If you experience issues on pre-commit using the GUI and you are using a node version manager, such as nvm, add the following script:

```
# ~/.config/husky/init.sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

For more information, follow [this guide](https://typicode.github.io/husky/how-to.html#node-version-managers-and-guis).

---

This repository was created within the project [LTACH19032](https://starfos.tacr.cz/en/project/LTACH19032).

<p align="center">
    <img src="https://seeklogo.com/images/M/msmt-logo-84BD22A97D-seeklogo.com.png"/>
</p>

<p align="center">
    <img src="https://www.msmt.cz/uploads/Odbor%2033/inter-excellence-color.jpg"/>
</p>
