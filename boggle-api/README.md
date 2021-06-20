# GBoggle API
The GBoggle API depends on Redis, for our purposes this has been installed and set-up using WSL (Debian) using the "redis-server" package.

## Redis Authentication
The API will look for a file named ".redis_password" inside the root of the boggle-api directory.
A password for Redis can be set in the command line using the following lines:
### Open Redis CLI
`redis-cli`
### Set a password
`CONFIG SET requirepass "password"`

## API Key
The only use case for an API key is to be able to post highscore data (since these values should be server validated first).
For now a file name ".api_key" will store the authentication key necessary for these actions.