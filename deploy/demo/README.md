This docker deploys the demo version of the FTA-FMEA tool.
    
## Deployment

### Run Deployment

To change the default configuration see secrtion [Configure Environment](#configure-environment).
To run this deployment execute the following command:

`> docker-compose -f ..\internal-auth\docker-compose.yml --env-file .env -p fta-fmea-demo up -d`

The repository is initialized with data from the found on the path specified in `INIT_DATA_FOLDER` environment variable
folder.

### Configure Environment

#### Securing the Data Repository
To secure the data repository follow these steps:

1. Set up credentials
Edit the .env file to set-up credentials for a secured data repository.
```
REPOSITORY_USERNAME=admin
REPOSITORY_PASSWORD=<password>
```
The minimal configuration requires to setup the uses the `admin` user and it requires to set-up the password.

2. Run the deployment, see section [Run Deployment](#run-deployment)

3. Set-up User in DB-Server

After first running the deployment, visit the `{$INTERNAL_HOST_PORT}/fta-fmea/services/db-server` and make the `fta-fmea`
repo private:

* in `Setup/Users and Access` change the password of the `admin` user to the value of `REPOSITORY_PASSWORD` in .env
* in `Setup/Users and Access` turn on security

#### Configure Initial Data
To change the location from which initial data is imported into the data repository change the value of the 
`INIT_DATA_FOLDER` variable in the .evn file. The default configuration loads demo data contain examples Systems, 
Fault trees and Failure Mode tables.


