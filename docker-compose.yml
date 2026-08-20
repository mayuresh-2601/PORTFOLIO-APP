services:
  
  # MySQL Database
  
  db:
    image: mysql:8.0

    container_name: portfolio_db_container

    restart: unless-stopped

    env_file:
      - ./server/.env

    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}

    ports:
      - "3307:3306"

    volumes:
      - mysql_data:/var/lib/mysql
      - ./server/database/schema.sql:/docker-entrypoint-initdb.d/schema.sql:ro

    healthcheck:
      test:
        [
          "CMD",
          "mysqladmin",
          "ping",
          "-h",
          "localhost"
        ]
      interval: 10s
      timeout: 5s
      retries: 10

    networks:
      - portfolio_net

  
  # Express Backend
  
  server:
    build:
      context: ./server
      dockerfile: Dockerfile

    container_name: portfolio_server_container

    restart: unless-stopped

    env_file:
      - ./server/.env

    ports:
      - "5000:5000"

    depends_on:
      db:
        condition: service_healthy

    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--spider",
          "-q",
          "http://localhost:5000/api/health"
        ]
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 20s

    networks:
      - portfolio_net

  
  # React + Nginx
  
  client:
    build:
      context: ./client
      dockerfile: Dockerfile

    container_name: portfolio_client_container

    restart: unless-stopped

    ports:
      - "80:80"

    depends_on:
      server:
        condition: service_healthy

    networks:
      - portfolio_net


# Persistent Volumes

volumes:
  mysql_data:


# Networks

networks:
  portfolio_net:
    driver: bridge