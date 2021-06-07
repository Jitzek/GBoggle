# GBoggle

## Quick Start
1. Make sure nodejs and npm is installed
    - Debian: `curl -fsSL https://deb.nodesource.com/setup_16.x | bash -` (run as root, not sudo) (version might vary)
              `apt install nodejs` (run as root)
    - Arch Linux: `pacman -S nodejs npm`
    - Windows: https://www.npmjs.com/get-npm
2. Make executables executable (if not executable already)
    - `chmod +x ./run.sh`
    - `chmod +x ./boggle-api/run-redis.sh`
    - `chmod +x ./install-npm-dependencies.sh` (optional)
3. Install npm dependencies
    - `./install-npm-dependencies.sh`
    or
    - `npm install --prefix ./boggle-sveltexpress/svelte ./boggle-sveltexpress/svelte`
      `npm install --prefix ./boggle-sveltexpress/express ./boggle-sveltexpress/express`
      `npm install --prefix ./boggle-api ./boggle-api`
    or you can navigate to the directories with a package.json and run `npm install` in that directory.
4. Install Redis Server
    - Debian: `apt install redis-server`
    - Arch Linux: `pacman -S redis`
    - Windows: https://redislabs.com/blog/redis-on-windows-10/
5. Add `.api_key` files to `./boggle-sveltexpress/express/` and `./boggle-api/` containing a same value
6. Add a file called `.redis_password` to `./boggle-api/` with any value.