FROM gitpod/workspace-node:latest

USER root

RUN apt-get update -yq && apt-get -yq upgrade && \
    apt-get install -y git-core curl gnupg build-essential openssl libssl-dev ruby ruby-dev ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release xdg-utils

COPY . /app

RUN npm i -g pnpm@latest

WORKDIR /app

RUN pnpm fetch

RUN pnpm install && pnpm build

RUN pnpx puppeteer browsers install chrome

ADD https://noto-website.storage.googleapis.com/pkgs/NotoSansCJKjp-hinted.zip /tmp

RUN unzip /tmp/NotoSansCJKjp-hinted.zip && \
    mkdir -p /usr/share/fonts/noto && \
    cp *.otf /usr/share/fonts/noto && \
    chmod 644 -R /usr/share/fonts/noto/ && \
    fc-cache -fv

ENV PORT 3000

EXPOSE 3000

ENTRYPOINT ["pnpm", "start"]
