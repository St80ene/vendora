# Vendora
A scalable and secure e-commerce API built with NestJS, TypeScript, and MySQL.

🚀 Overview

Vendora is a powerful backend API designed for modern e-commerce platforms. It provides essential features such as user authentication, product management, order processing, payment integration, and shipping logistics. Built with NestJS, TypeScript, and MySQL, it ensures high scalability, maintainability, and security.

✨ Features
- 🔐 User Authentication & Authorization (JWT-based)

- 🛒 Product Management (CRUD operations)

- 📦 Order Processing & Checkout

- 💳 Payment Gateway Integration

- 🚚 Shipping & Delivery Management

- 📊 Admin Dashboard APIs

- 📝 Comprehensive API Documentation

- 🛠 Modular and Scalable Architecture

🏗️ Tech Stack

- Backend: NestJS (TypeScript)

- Database: MySQL with TypeORM

- Authentication: JWT & Bcrypt

- API Docs: Swagger

- Environment Configuration: dotenv

- Deployment: Docker, CI/CD Ready

📦 Installation

```
# Clone the repository
git clone https://github.com/St80ene/vendora.git
cd vendora

# Install dependencies
yarn install
```

🔧 Configuration

Create a .env file in the root directory and add the required environment variables:

```
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=vendora
JWT_SECRET=your_jwt_secret
BCRYPT_SALT_ROUNDS=12
```

🚀 Running the Application

```
# Start the development server
yarn start:dev

# Start the production server
yarn start:prod

# Run database migrations
yarn migration:run
```

🛠️ API Documentation

Swagger is integrated for easy API exploration.

After running the server, visit: http://localhost:3000/api

🧪 Running Tests

```
# Run unit tests
yarn test

# Run end-to-end tests
yarn test:e2e
```

🐳 Docker Support

```
# Build and run the application in a Docker container
docker-compose up --build
```

🤝 Contributing

- Fork the repo

- Create a new branch (feature/new-feature)

- Commit your changes (git commit -m 'Add new feature')

- Push to the branch (git push origin feature/new-feature)

- Create a pull request

📜 License

This project is licensed under the MIT License.

📬 Contact

For inquiries or contributions, reach out via:

📧 Email: etienejames5@gmail.com

🐦 Twitter: [etienejames5](https://x.com/etienejames5)

🔗 LinkedIn: [Etiene Essenoh](https://www.linkedin.com/in/etiene-essenoh/)

---


Made with ❤️ by Etiene Essenoh 🚀


