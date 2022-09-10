# Installation
- Make sure the ports "4000" and "5435" are available on your end!
## DEV
```
docker-compose --env-file ./env/.env.development up -d --build
```
## PROD
```
docker-compose --env-file ./env/.env.production up -d --build
```

## TEST
```
docker-compose --env-file ./env/.env.test up -d --build && docker-compose --env-file ./env/.env.test logs -f backend
```

# Address
The app will be running at 
## DEV
```
http://localhost:4501
```
## DEV
```
http://localhost:4500
```

# Running Tests
```
docker-compose --env-file ./env/.env.test up -d --build && docker-compose --env-file ./env/.env.test logs backend
```

# Clean
```
docker-compose --env-file ./env/.env.test down --remove-orphans --rmi "local" --volumes;
```