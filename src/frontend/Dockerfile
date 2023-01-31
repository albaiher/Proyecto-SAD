FROM kafkajs
COPY ./*.js /src/
COPY ./config/*.js /src/config/
CMD node /src/client.js $BROKER_URL
