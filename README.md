# E-Commerce Messaging System with RabbitMQ

This repository implements a simple messaging system for an e-commerce scenario using RabbitMQ. It demonstrates two key messaging patterns:

- **Point-to-Point (P to P)**: Orders are sent to a queue and processed by one consumer from a pool of workers.
- **Publish/Subscribe (Pub/Sub)**: Announcements are broadcast to multiple subscribers via a fanout exchange.

The system uses Node.js for scripting, JSON as the message format, and includes web interfaces for both producers and consumers.

## Prerequisites

Before running the system, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) (to run RabbitMQ)
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Repository Structure

### Core Message System

- `producer-server.js`: Handles order submissions from the web interface to RabbitMQ.
- `consumer-server.js`: Creates consumer instances with their own web interfaces.
- `socket-server.js`: Manages real-time updates between consumers and their web interfaces.

### Web Interfaces

- `producer.html`: Web form for submitting orders.
- `consumer.html`: Web interface for monitoring orders processed by each consumer.

### Server Setup

- `server.js`: Main server for the producer interface.
- `package.json`: Defines project dependencies.

## Dependencies

```json
{
  "dependencies": {
    "amqplib": "^0.10.3",
    "express": "^4.17.1",
    "socket.io": "^4.5.1"
  }
}
```

## Setup Instructions

### 1. Install Dependencies

Clone this repository and install the required packages:

```bash
git clone https://github.com/alexdieu/E-Commerce-Messaging-System-with-RabbitMQ/tree/main
cd E-Commerce-Messaging-System-with-RabbitMQ
npm install
```

### 2. Run RabbitMQ with Docker

Start a RabbitMQ instance with the management UI:

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

- Port 5672: RabbitMQ AMQP port for communication.
- Port 15672: Management console (access at http://localhost:15672, default credentials: guest/guest).

### 3. Start the System

1. Start the producer server (handles order submissions):

```bash
node server.js
```

Access the order form at: http://localhost:3000

2. Start multiple consumers (each on a different port):

```bash
node consumer-server.js 3001
node consumer-server.js 3002
node consumer-server.js 3003
```

Access each consumer's interface at:

- Consumer 1: http://localhost:3001
- Consumer 2: http://localhost:3002
- Consumer 3: http://localhost:3003

## How It Works

1. **Order Submission**:

   - Access the producer interface at http://localhost:3000
   - Fill in the customer name and select products
   - Submit the order

2. **Order Processing**:

   - Orders are distributed among available consumers (round-robin)
   - Each consumer has its own web interface showing only the orders it processes
   - Real-time updates via Socket.IO show orders as they're processed

3. **Monitoring**:
   - Open multiple consumer interfaces to see how orders are distributed
   - Each consumer interface shows:
     - Order ID
     - Customer Name
     - Selected Items
     - Processing Time
     - Consumer Port (to identify which consumer processed the order)

## System Architecture

- **Producer Interface (Port 3000)**:

  - Web form for order submission
  - Sends orders to RabbitMQ queue

- **Consumer Instances (Ports 3001+)**:

  - Each runs on a separate port
  - Has its own web interface
  - Processes orders from the shared queue
  - Shows real-time updates via Socket.IO

- **RabbitMQ**:
  - Manages order queue
  - Distributes orders among consumers
  - Ensures reliable message delivery

## Troubleshooting

- **Connection Errors**: Ensure RabbitMQ is running (`docker ps`)
- **Port Conflicts**: Make sure ports 3000-3003 are available
- **Consumer Issues**: Each consumer needs a unique port
- **UI Not Updating**: Check browser console for Socket.IO connection errors

## Notes

- Orders are persistent and survive RabbitMQ restarts
- Each consumer operates independently
- Web interfaces update in real-time
- System demonstrates both queue-based messaging and real-time updates
