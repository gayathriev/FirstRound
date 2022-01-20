# image
FROM osrm/osrm-backend:latest

# config
RUN mkdir /data
COPY australia.osm.pbf /data/australia.osm.pbf
RUN osrm-extract -p /opt/foot.lua /data/australia.osm.pbf
RUN osrm-partition /data/australia.osrm
RUN osrm-customize /data/australia.osrm

# expose port (osrm hardcoded to 5000)
# EXPOSE 5000
# run the server
RUN osrm-routed --algorithm mld /data/australia.osrm
