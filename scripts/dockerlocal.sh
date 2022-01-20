# build the docker image
docker build ../deploy/ -t firstround-osrm 

# run the docker image
docker run -p 6000:6000 firstround-osrm