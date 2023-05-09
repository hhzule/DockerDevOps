FROM node:16
WORKDIR /app
COPY package.json .

# To Fix Permissions for Packages
# RUN npm config set unsafe-perm true

# then npm install --force; \

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi

COPY . ./

# To Fix Permissions for Packages
# RUN chown -R node /node_modules
# USER node



ENV PORT 3000
EXPOSE $PORT
# CMD [ "node", "index.js" ]
CMD [ "npm", "run", "dev" ]


