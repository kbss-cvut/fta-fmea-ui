FROM ontotext/graphdb:10.2.0

# Override parent entrypoint
ENTRYPOINT []

ENV GRAPHDB_HOME=/opt/graphdb/home
ENV GRAPHDB_INSTALL_DIR=/opt/graphdb/dist

WORKDIR ${GRAPHDB_HOME}

# Install libs related to RDF processing
RUN apk add py3-rdflib
RUN apk add perl-uri

# Copy initialization repository config
COPY init-config /repo-config
COPY bin/* ${GRAPHDB_INSTALL_DIR}/bin/

EXPOSE 7200

CMD ${GRAPHDB_INSTALL_DIR}/bin/repo-init.sh /repo-config ${GRAPHDB_HOME} & ${GRAPHDB_INSTALL_DIR}/bin/graphdb -Dgraphdb.home=${GRAPHDB_HOME} -Dgraphdb.logback=${GRAPHDB_INSTALL_DIR}/conf/logback.xml
