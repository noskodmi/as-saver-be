# Assaver App
ETH Berlin project Assaver submission.
- [LIVE](https://www.docker.com/get-started)
- [Frontend repo](https://github.com/bobetbat/web3-boilerplate)

Assaver is a blockchain security tool designed to notify you when a suspicious wallet interacts with you. This README will guide you through setting up and running the application locally using Docker and Docker Compose.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the Repository

Clone the repository to your local machine:

```sh
git clone https://github.com/yourusername/assaver.git
cd assaver
```

### 2. Set Up Environment Variables

Create a \`.env\` file in the root directory of the project and populate it with the necessary environment variables. Use the \`.env.example\` file as a reference.

```sh
cp .env.example .env
```

Edit the \`.env\` file to configure your specific environment variables.

### 3. Build and Run the Application with Docker Compose

Use Docker Compose to build and run the application:

```sh
docker-compose up -d
```

This command will build the Docker images (if they do not already exist) and start the services defined in the \`docker-compose.yml\` file in detached mode.

### 4. Access the Application

Once the application is running, you can access it by navigating to \`http://localhost\` in your web browser. If the application uses a different port, replace \`localhost\` with \`localhost:<port>\`.

## Stopping the Application

To stop the application, use the following command:

```sh
docker-compose down
```

This command will stop and remove the containers defined in the \`docker-compose.yml\` file.

## Running Commands Inside the Container

To execute commands inside the running container, use the \`docker-compose exec\` command:

```sh
docker-compose exec <service_name> <command>
```

For example, to open a shell inside the \`app\` service container:

```sh
docker-compose exec app /bin/sh
```

## Troubleshooting

If you encounter any issues, check the logs of the running containers:

```sh
docker-compose logs -f
```

This command will stream the logs and help you identify any problems.

Push
We need to subscribe to a server that will then send the data back to the app. The app's Service Worker will receive data from the push server, which can then be shown using the notifications system.

The technology is still at a very early stage — some working examples use the Google Cloud Messaging platform, but are being rewritten to support VAPID (Voluntary Application Identification), which offers an extra layer of security for your app

Implementing Push Notifications in PWAs:
1. Register a Service Worker:
    The service worker handles background tasks like push events.

2. Subscribe to Push Service:
    Use the Push API to subscribe users to push notifications.
    Obtain a push subscription and store it on your server.

3. Send Push Notifications:
    Use a service like Firebase Cloud Messaging (FCM) for Android and Web Push Protocol for iOS/Safari.
    Push notifications are sent from your server to the push service, which delivers them to the client.


Server Side:

You need to implement a backend to handle push notifications.
Use Web Push libraries (like web-push for Node.js) to send notifications.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


