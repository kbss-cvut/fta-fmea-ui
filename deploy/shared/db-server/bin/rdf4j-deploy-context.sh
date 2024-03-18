#!/bin/bash


### DEFAULTS ###
APPEND=true
CONTENT_TYPE='text/turtle'
#CONTENT_TYPE='application/trig'
#CONTENT_TYPE='application/rdf+xml'
#CONTENT_TYPE='text/x-nquads'
#CONTENT_TYPE='application/ld+json'

function print_usage() {
	  echo "Rdf4j server deploy script."
          echo "Parameters: "
          echo -e "\t-R -- replace content of GRAPH_IRI (appends by default)"
          echo -e "\t-C CONTENT_TYPE -- content type of input FILES, i.e. text/turtle (default), application/rdf+xml ..."
          echo "Usage: "
          echo -e "\t$0 -R -C <CONTENT_TYPE> -s <RDF4J_SERVER> -r <REPO_ID> -c <GRAPH_IRI> <FILES>"
          echo -e "\t$0 -R -C <CONTENT_TYPE> -u <RDF4J_REPOSITORY_URL> -c <GRAPH_IRI> <FILES>"
          echo "Examples: "
          echo -e "\tEXAMPLE-1 (append context): $0 -s http://onto.mondis.cz/openrdf-RDF4J -r ontomind_owlim -c http://onto.mondis.cz/resource/mdr-1.0-SNAPSHOT-temporary mdr.owl" 
          echo -e "\tEXAMPLE-2 (replace context): $0 -R -C 'text/turtle' -s http://onto.fel.cvut.cz/rdf4j-server -r test -c http://vfn.cz/ontologies/fertility-saving-study study-model.ttl"
	  echo -e "\tEXAMPLE-3 (replace repository): $0 -R -C 'text/x-nquads' -s http://onto.fel.cvut.cz/rdf4j-server -r test fss-study-formgen.ng"
          echo -e "\tEXAMPLE-4 (use of repository url): $0 -R -C 'text/turtle' -u http://onto.fel.cvut.cz/rdf4j-server/repositories/test -c http://vfn.cz/ontologies/fertility-saving-study study-model.ttl"
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

echo "INFO: *** DEPLOYING ***"
[ ! -z "$REPOSITORY_URL" ] && echo "INFO:    - repository url: $REPOSITORY_URL"
[ ! -z "$RDF4J_SERVER" ] && echo "INFO:  destination server:  $RDF4J_SERVER"
[ ! -z "$REPOSITORY" ] && echo "INFO:    - repository $REPOSITORY"
echo "INFO:    - graph $GRAPH"
echo "INFO:    - files $FILES"

if [ "$APPEND" = false ] ; then
   echo "INFO: *** CLEARING THE GRAPH ***"
   TEMP_FILE=`mktemp`
   QUERY_PARAMS="context=$GRAPH"
   if [ ! "$GRAPH" ]; then QUERY_PARAMS= ;  fi
   curl $REPOSITORY_URL/statements?$QUERY_PARAMS -v -X DELETE &> $TEMP_FILE
   cat $TEMP_FILE | grep "HTTP/1.1 204" &>/dev/null && echo 'INFO:  clearing graph was sucessfull'  
   cat $TEMP_FILE | grep "HTTP/1.1 204" &>/dev/null || ( echo 'ERROR:  clearing graph failed. Output of the process : '; cat $TEMP_FILE )
fi 

echo "INFO: *** SENDING DATA ***"
for FILE in $FILES
do
   echo INFO: " -- sending $FILE";
   TEMP_FILE=`mktemp`
   QUERY_PARAMS="context=$GRAPH"
   if [ ! "$GRAPH" ]; then QUERY_PARAMS= ;  fi
  
   curl -X POST -H "Content-Type: $CONTENT_TYPE" --data-binary "@$FILE" -o - -v "$REPOSITORY_URL/statements?$QUERY_PARAMS" 2> $TEMP_FILE
   cat $TEMP_FILE | grep "HTTP/1.1 204" &>/dev/null && echo 'INFO:  sending data was sucessfull'  
   cat $TEMP_FILE | grep "HTTP/1.1 204" &>/dev/null || ( echo 'ERROR:  sending data failed. Output of the process : '; cat $TEMP_FILE )
done;

echo "INFO: *** CHECKING ***"
TEMP_FILE=`mktemp`
GRAPH_SIZE=`curl $REPOSITORY_URL/size 2> $TEMP_FILE`
echo "INFO:  size of the new graph is $GRAPH_SIZE"

