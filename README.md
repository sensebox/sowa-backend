# Sensor Wiki API



# Install

Install requirements
```sh
yarn install
```

Copy env file
```sh
cp .env.example .env
```

Start PostgreSQL DB
```sh
docker-compose up 
```

If you want to load the Dump file:

Connect to PostgreSQL docker container
```sh
docker exec -it ID bash
```

Load Dump File
```sh
psql -U DB_USERNAME -d DB_NAME < dataDump.sql
```

If you dont want to load the dump file:

Migrate DB
```sh
npx prisma migrate dev
```

Start node application
```
npx nodemon
```