FROM frolvlad/alpine-mono:latest

MAINTAINER "SilverBulleter's LLC" <team@silverbulleters.org>

RUN mkdir /tmp/oscript/

ENV LANG ru_RU.utf8

RUN apk update && apk add curl && apk add unzip && apk add wget \
    && curl -o /tmp/oscript/oscript-latest.zip -sSL http://oscript.io/downloads/night-build/latest.zip

RUN unzip -o /tmp/oscript/oscript-latest.zip -d /usr/lib/osc-engine

RUN echo "#!/bin/sh" > /usr/bin/oscript \
  && echo '' >> /usr/bin/oscript \
  && echo 'mono /usr/lib/osc-engine/bin/oscript.exe "$@"' >> /usr/bin/oscript \
  && chmod +x /usr/bin/oscript

RUN apk --no-cache add ca-certificates
RUN apk add --update bash

RUN apk del curl \
  && apk del wget \
  && apk del unzip \
  && rm -rf /var/cache/apk/* \
  && rm -rf /tmp/oscript