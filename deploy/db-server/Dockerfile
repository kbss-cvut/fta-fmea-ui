FROM openjdk:11

ENV GRAPHDB_ZIP=graphdb-free-9.11.1-dist.zip
ENV GRAPHDB_VOLUME=/graphdb
ENV GRAPHDB_HOME=${GRAPHDB_VOLUME}/home
ENV GRAPHDB_INSTALL_DIR=${GRAPHDB_VOLUME}/dist

RUN mkdir -p $GRAPHDB_VOLUME $GRAPHDB_INSTALL_DIR $GRAPHDB_HOME

COPY ./deploy/db-server/$GRAPHDB_ZIP /tmp/$GRAPHDB_ZIP

WORKDIR /tmp
RUN unzip $GRAPHDB_ZIP
RUN export GRAPHDB_DIR=`ls -d graphdb*/` && mv $GRAPHDB_DIR/* $GRAPHDB_INSTALL_DIR

ENV PATH=${GRAPHDB_INSTALL_DIR}/bin:$PATH

RUN rm -rf ${GRAPHDB_HOME}/data

COPY ./deploy/db-server/data ${GRAPHDB_HOME}/data

CMD ["-Dgraphdb.home=/graphdb/home"]
ENTRYPOINT ["/graphdb/dist/bin/graphdb"]

EXPOSE 7200