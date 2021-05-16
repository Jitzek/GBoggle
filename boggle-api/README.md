# GBoggle API
The GBoggle API depends on Redis, for our purposes this has been installed and set-up using WSL (Debian) using the "redis-server" package.

## Redis Authentication
The API will look for a file name ".redis_password" inside the root of the boggle-api directory.
To set a password for Redis can be done in the command line using the following lines:
### Open Redis CLI
`redis-cli`
### Set a password
`CONFIG SET requirepass "password"`