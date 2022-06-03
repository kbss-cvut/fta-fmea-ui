FROM nginx:latest
ARG CONTEXT=/fta-fmea
WORKDIR /etc/nginx/
COPY nginx.conf .
ENV CONTEXT=$CONTEXT
RUN sed -i "s:<ROOT>:${CONTEXT}:g" ./nginx.conf