#!/bin/bash

function print_usage() {
    echo "RDF4J server SPARQL update script."
    echo "Parameters: "
    echo -e "\t-s -- URL of the RDF4J server"
    echo -e "\t-r -- Repository ID"
    echo -e "\t-q -- SPARQL update query file"
    echo "Usage: "
    echo -e "\t$0 -s <RDF4J_SERVER_URL> -r <REPOSITORY_ID> -q <SPARQL_UPDATE_QUERY_FILE>"
    echo "Examples: "
    echo -e "\t$0 -s http://localhost/rdf4j-server -r termit -q update-query.rq"
}

if [ "$#" -eq 0 ]; then
    print_usage
    exit 1
fi

while getopts "hs:r:q:" arg; do
    case $arg in
        h)
            print_usage
            exit 0
            ;;
        s)
            RDF4J_SERVER_URL=$OPTARG
            ;;
        r)
            REPOSITORY_ID=$OPTARG
            ;;
        q)
            SPARQL_UPDATE_QUERY_FILE=$OPTARG
            ;;
    esac
done

shift $((OPTIND-1))

if [ -z "$RDF4J_SERVER_URL" ] || [ -z "$REPOSITORY_ID" ] || [ -z "$SPARQL_UPDATE_QUERY_FILE" ]; then
    echo "Missing required arguments."
    print_usage
    exit 1
fi

echo "INFO: *** RUNNING SPARQL UPDATE QUERY ***"
echo "INFO:    - RDF4J server URL: $RDF4J_SERVER_URL"
echo "INFO:    - Repository ID: $REPOSITORY_ID"
echo "INFO:    - SPARQL update query file: $SPARQL_UPDATE_QUERY_FILE"

TEMP_FILE=$(mktemp)
QUERY=$(cat "$SPARQL_UPDATE_QUERY_FILE")

RESPONSE=$(curl -X POST -H "Content-Type: application/sparql-update" --data "$QUERY" -s -o "$TEMP_FILE" -w "%{http_code}" "$RDF4J_SERVER_URL/repositories/$REPOSITORY_ID/statements")

if [ "$RESPONSE" -eq 204 ]; then
    echo "INFO: SPARQL update query was successful."
else
    echo "ERROR: SPARQL update query failed. HTTP Status Code: $RESPONSE"
    echo "Output of the process:"
    cat "$TEMP_FILE"
fi

rm "$TEMP_FILE"

