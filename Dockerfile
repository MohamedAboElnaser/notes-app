FROM node:18-alpine
# Create app directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install 

#  Copy rest of the app
COPY . .

# Run the app
CMD ["yarn", "start"]