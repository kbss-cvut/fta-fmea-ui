#!/bin/sh

#
# Initializes GraphDB repositories (the repositories are created if they do not exist yet and some of the data are replaced)
#

SOURCE_DIR=$1
GRAPHDB_HOME=$2

SCRIPT_DIR="`dirname $0`"

wait_for_graphdb() {
    # Set the GraphDB URL and max retry attempts
    local GRAPHDB_URL="http://localhost:7200/rest/repositories"
    local MAX_RETRIES=30
    local RETRY_INTERVAL=1 # seconds

    # Loop to check if GraphDB is ready
    local attempt=1
    while ! curl -s --head --fail "$GRAPHDB_URL" > /dev/null; do
        if [ $attempt -ge $MAX_RETRIES ]; then
            echo "ERROR: GraphDB did not start within the expected time."
            return 1
        fi
        echo "INFO: Waiting for GraphDB to be ready (Attempt $attempt/$MAX_RETRIES)..."
        sleep $RETRY_INTERVAL
        attempt=$((attempt + 1))
    done

    echo "INFO: GraphDB is up and running."
    return 0
}

############
### MAIN ###
############

echo "INFO: Running initializer for GraphDB repositories ..."

echo "INFO: Waiting for GraphDB to start up..."
if ! wait_for_graphdb; then
    echo "ERROR: Could not establish connection to GraphDB. Exiting."
    exit 1
fi

ls ${SOURCE_DIR}/*-config.ttl | while read REPO_CONFIG_FILE; do

	REPO_NAME=`$SCRIPT_DIR/get-value-of-rdf-property.py $REPO_CONFIG_FILE 'http://www.openrdf.org/config/repository#repositoryID'`

	if [ -z "$REPO_NAME" ]; then
    		echo "ERROR: Could not parse repository name from file $REPO_CONFIG_FILE"
    		exit 1
	fi

	if [ ! -d ${GRAPHDB_HOME}/data/repositories/${REPO_NAME} ] || [ -z "$(ls -A ${GRAPHDB_HOME})/data/repositories/${REPO_NAME}" ]; then
		echo "INFO: Initializing repository $REPO_NAME..."

	    # Create repository based on configuration
	    echo "INFO: Creating repository $REPO_NAME..."
	    curl -X POST --header "Content-Type: multipart/form-data" -F "config=@${REPO_CONFIG_FILE}" "http://localhost:7200/rest/repositories"
	    echo "INFO: Repository $REPO_NAME successfully initialized."
	else
	    echo "INFO: Repository $REPO_NAME already exists. Skipping initialization..."
	fi
done


DATA_DIR=/root/graphdb-import
cd /

for DIR in ${DATA_DIR}/*/; do
    REPO_NAME="`basename ${DIR}`"

    echo "INFO: Updating data in repository $REPO_NAME ..."

    find ${DATA_DIR}/${REPO_NAME} -name '*.trig' | while read DATA_FILE; do

	echo "INFO: Replacing contexts with data from file ${DATA_FILE}."
	$SCRIPT_DIR/rdf4j-deploy-context.sh -R -C 'application/trig' -s http://localhost:7200 -r ${REPO_NAME} ${DATA_FILE}
    done

    find ${DATA_DIR}/${REPO_NAME} -name '*.ru' | while read UPDATE_QUERY_FILE; do

	echo "INFO: Running update query from file ${UPDATE_QUERY_FILE}."
        $SCRIPT_DIR/rdf4j-sparql-update.sh -s http://localhost:7200 -r ${REPO_NAME} -q ${UPDATE_QUERY_FILE}
    done
done
