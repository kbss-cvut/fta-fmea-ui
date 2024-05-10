#!/bin/bash


### DEFAULTS ###
APPEND=true
CONTENT_TYPE='text/turtle'
#CONTENT_TYPE='application/trig'
#CONTENT_TYPE='application/rdf+xml'
#CONTENT_TYPE='text/x-nquads'
#CONTENT_TYPE='application/ld+json'

function print_usage() {
	  echo "Rdf4j server deploy script. By default it appends data to the server, for replacement of data use -R parameter."
          echo "Parameters: "
          echo -e "\t-R -- replace content of GRAPH_IRI (appends by default). If specified together with -C 'application/trig', the graphs to be cleared are inferred from the trig file."
          echo -e "\t-c GRAPH_IRI -- specifies named-graph/context to replace/append. If  -R is specified and -c is not defined, context to be cleared are inferred  For trig files if it -c is not specified, it is inferred from the data, where all named graphs specified in trig file are used."
          echo -e "\t-C CONTENT_TYPE -- content type of input FILES, i.e. text/turtle (default), application/rdf+xml ..."
          echo "Usage: "
          echo -e "\t$0 -R -C <CONTENT_TYPE> -s <RDF4J_SERVER> -r <REPO_ID> -c <GRAPH_IRI> <FILES>"
          echo -e "\t$0 -R -C <CONTENT_TYPE> -u <RDF4J_REPOSITORY_URL> -c <GRAPH_IRI> <FILES>"
          echo "Examples: "
          echo -e "\tEXAMPLE-1 (append context): $0 -s http://onto.mondis.cz/openrdf-RDF4J -r ontomind_owlim -c http://onto.mondis.cz/resource/mdr-1.0-SNAPSHOT-temporary mdr.owl"
          echo -e "\tEXAMPLE-2 (replace context): $0 -R -C 'text/turtle' -s http://onto.fel.cvut.cz/rdf4j-server -r test -c http://vfn.cz/ontologies/fertility-saving-study study-model.ttl"
	  echo -e "\tEXAMPLE-3 (replace repository): $0 -R -C 'text/x-nquads' -s http://onto.fel.cvut.cz/rdf4j-server -r test fss-study-formgen.ng"
          echo -e "\tEXAMPLE-4 (use of repository url): $0 -R -C 'text/turtle' -u http://onto.fel.cvut.cz/rdf4j-server/repositories/test -c http://vfn.cz/ontologies/fertility-saving-study study-model.ttl"
          echo -e "\tEXAMPLE-5 (use of repository url): $0 -R -C 'application/trig' -u http://onto.fel.cvut.cz/rdf4j-server/repositories/test study-model.trig"
}

if [ "$#" -eq 0 ]; then
	print_usage
        exit
fi


while getopts "h:s:r:u:c:RC:" arg; do
      case $arg in
        h)
	  print_usage
          exit 0
          ;;
        s)
          RDF4J_SERVER=$OPTARG
          ;;
        r)
          REPOSITORY=$OPTARG
          ;;
        u)
          REPOSITORY_URL=$OPTARG
          ;;
        c)
          GRAPH=$(perl -MURI::Escape -e 'print uri_escape($ARGV[0]);' "<$OPTARG>")
          ;;
	R)
	  APPEND=false
	  ;;
	C)
	  CONTENT_TYPE=$OPTARG
	  ;;
      esac
done

shift $(($OPTIND-1))
FILES=$@

REPOSITORY_URL=${REPOSITORY_URL:-$RDF4J_SERVER/repositories/$REPOSITORY}


function get_contexts_from_trig_file() {
  FILE=$1
  grep '\S\S*\s\s*{\s*' ${FILE} | sed 's/\s*{\s*//' |  sort -u
}

function encode() {
  while read GRAPH; do
    perl -MURI::Escape -e "print uri_escape(q($GRAPH));"
    echo
  done
}

echo "INFO: *** RUNNING DEPLOY WITH PARAMETERS ***"
[ ! -z "$REPOSITORY_URL" ] && echo "INFO:     - repository url: $REPOSITORY_URL"
[ ! -z "$GRAPH" ] &&  echo "INFO:     - graph: $GRAPH"
echo "INFO:     - files: $FILES"
echo "INFO:     - method: $(if [ "$APPEND" = false ]; then echo "replace-data"; else echo "append-data"; fi)"

echo "INFO: *** PROVIDING INFO ABOUT INITIAL STATE OF REPOSITORY ***"
TEMP_FILE=`mktemp`
REPOSITORY_SIZE=`curl $REPOSITORY_URL/size  2> $TEMP_FILE`
echo "INFO:     - initial size of the repository is $REPOSITORY_SIZE"

if [ "$APPEND" = false ]; then
  echo "INFO: *** CLEARING DATA ***"

  for FILE in $FILES; do
    TEMP_FILE=`mktemp`

    QUERY_PARAMS=""

    if [ -n "$GRAPH" ]; then
      QUERY_PARAMS="context=$GRAPH"

    elif [ "$CONTENT_TYPE" = 'application/trig' ]; then
      GRAPHS_TO_ENCODE=$(get_contexts_from_trig_file $FILE)
      GRAPHS_LOG=$(echo $GRAPHS_TO_ENCODE | tr " " "\n" | sed 's/^/INFO:          - /')
      echo -e "INFO:     - inferred contexts to clear:\n$GRAPHS_LOG";
      QUERY_PARAMS=$(echo $GRAPHS_TO_ENCODE | tr " " "\n" |  encode | sed 's/^/\&context=/' | tr -d '\n' | sed 's/^.//')

    fi

    if [ -n "$QUERY_PARAMS" ]; then
      curl $REPOSITORY_URL/statements?$QUERY_PARAMS -v -X DELETE &> $TEMP_FILE
      cat $TEMP_FILE | grep "HTTP/1.1 204" &>/dev/null && echo 'INFO:     - clearing graphs was successful'
      cat $TEMP_FILE | grep "HTTP/1.1 204" &>/dev/null || ( echo 'ERROR:     - clearing graphs failed. Output of the process : '; cat $TEMP_FILE )

    else
      echo "INFO:     - nothing to clear"
    fi

  done

  echo "INFO: *** VALIDATING 'CLEARING DATA' ***"
  TEMP_FILE=`mktemp`
  REPOSITORY_SIZE=`curl $REPOSITORY_URL/size  2> $TEMP_FILE`
  echo "INFO:     - size of the repository after clearing is $REPOSITORY_SIZE"
fi

echo "INFO: *** ADDING DATA ***"
for FILE in $FILES; do
   echo "INFO:     - sending $FILE";
   TEMP_FILE=`mktemp`

   QUERY_PARAMS=""
   if [ -n "$GRAPH" ]; then
     QUERY_PARAMS="context=$GRAPH"
   fi

   curl -X POST -H "Content-Type: $CONTENT_TYPE" --data-binary "@$FILE" -o - -v "$REPOSITORY_URL/statements?$QUERY_PARAMS" 2> $TEMP_FILE
   cat $TEMP_FILE | grep "HTTP/1.1 204" &>/dev/null && echo 'INFO:     - sending data was successful'
   cat $TEMP_FILE | grep "HTTP/1.1 204" &>/dev/null || ( echo 'ERROR:     - sending data failed. Output of the process : '; cat $TEMP_FILE )
done

echo "INFO: *** VALIDATING 'ADDING DATA' ***"
TEMP_FILE=`mktemp`
REPOSITORY_SIZE=`curl $REPOSITORY_URL/size  2> $TEMP_FILE`
echo "INFO:     - new size of the repository is $REPOSITORY_SIZE"
