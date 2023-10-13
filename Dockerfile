# Use a Node.js 10 Alpine base image
FROM node:10-alpine

# Set the working directory in the image
WORKDIR /home/node/app

# Copy only the package.json and package-lock.json files to the image
COPY package*.json ./

# Change ownership to the 'node' user and install Node.js dependencies
RUN chown -R node:node /home/node/app \
    && npm install

# Copy the rest of the application code
COPY . .

# Expose the port your application will listen on
EXPOSE 4000

# Switch back to the 'node' user for running the application
USER node

# Define the command to start your Node.js application
CMD [ "node", "app.js" ]
