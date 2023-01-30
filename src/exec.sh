#Build images
docker build -t kafkajs ./configuration/
docker build -t broker ./broker/
docker build -t client ./client/
docker build -t entry ./entry/
docker build -t worker ./worker/

echo -e "\n\n******\nImagenes creadas\n******\n\n"

#Docker-compose
docker-compose up

exit