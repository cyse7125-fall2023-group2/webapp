# webapp

## Overview

This project demonstrates a setup for a web server application with the following features:

- A web server built using NodeJs that serves web pages and API endpoints.
- Integration tests to ensure the functionality of the web server.
- Docker builds for the web server and a Flyway container for database migration.
- A Jenkins pipeline to automate building, testing, and deploying the web server.

### Prerequisites

Before you proceed, ensure you have the following prerequisites in place:

- NodeJs installed and configured.
- Docker installed on your local machine for building containers.
- A running Jenkins instance.
- A Git repository for your project.
- Familiarity with Jenkins and its configuration.


- `app/`: Contains the source code of your web server application.
- `__tests__/`: Holds the integration test code.
- `flyway/`: Contains Flyway migration SQL scripts.
- `Dockerfile`: Builds the Docker image for the web server.
- `Jenkinsfile`: Defines the Jenkins pipeline for building, testing, and deploying the project.

### Building and Testing

1. **Web Server Image**:

   Build the Docker image for the web server from the project root directory:

   ```shell
   docker build -t web-server:latest .
   ```

### Flyway Database Migration

1. **Flyway Container Image**:

   Build the Docker image for Flyway migration:

   ```shell
   docker build -t flyway-migration:latest -f flyway/Dockerfile .
   ```

2. **Database Migration**:

   Run the Flyway migration using the Flyway container:

   ```shell
   docker run --rm -v /path/to/flyway/sql/scripts:/flyway/sql flyway-migration:latest migrate
   ```

### Jenkins Pipeline Setup

1. Create a new Jenkins pipeline job.
2. Configure the job to use the Jenkinsfile from your project repository.
3. Set up Jenkins environment variables as needed, such as Docker credentials and Flyway configurations.
4. Trigger the Jenkins job to automate building, testing, and deploying the project.

For a detailed Jenkins pipeline setup, please refer to the `Jenkinsfile` in the project repository.
test123-123-test-2