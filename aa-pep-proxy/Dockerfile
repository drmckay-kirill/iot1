FROM ubuntu:14.04

MAINTAINER FIWARE Wilma PEP Proxy Team. DIT-UPM

WORKDIR /opt

# Install Ubuntu dependencies
RUN sudo apt-get update && \
	sudo apt-get install make g++ software-properties-common python-software-properties -y && \
	sudo add-apt-repository ppa:chris-lea/node.js -y && \
	sudo apt-get update && \
	sudo apt-get install nodejs git -y

# Copy source code
COPY /src/fiware-pep-proxy /opt/fiware-pep-proxy 

# Copy config
COPY /config.js /opt/fiware-pep-proxy/config.js

# Install npm dependencies
RUN cd fiware-pep-proxy && \
	npm install

# Run PEP Proxy
WORKDIR /opt/fiware-pep-proxy
CMD ["npm", "start"]