#Build images
docker build -t kafkajs ./base/
docker build -t broker ./broker/
docker build -t frontend ./frontend/
docker build -t worker ./worker/

echo -e "\n\n******\nImagenes creadas\n******\n\n"

#Docker-compose
docker-compose up

exit