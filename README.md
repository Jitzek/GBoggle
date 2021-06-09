# GBoggle

## Quick Start

1. Make sure nodejs and npm are installed
   - Debian:<br>
     `curl -fsSL https://deb.nodesource.com/setup_16.x | bash -` (run as root, not sudo) (version may vary)<br>
     `apt install nodejs` (run as root)
   - Arch Linux:<br>
     `pacman -S nodejs npm`
   - Windows:<br>
     https://www.npmjs.com/get-npm
2. Make executables executable (if not executable already)
   - `chmod +x ./run.sh`
   - `chmod +x ./boggle-api/run-redis.sh`
   - `chmod +x ./install-npm-dependencies.sh` (optional)
3. Install npm dependencies
   - `./install-npm-dependencies.sh`
     or
   - `npm install --prefix ./boggle-sveltexpress/svelte`
     `npm install --prefix ./boggle-sveltexpress/express`
     `npm install --prefix ./boggle-api`
     optionally:
     `npm audit fix --prefix ./boggle-sveltexpress/svelte`
     `npm audit fix --prefix ./boggle-sveltexpress/express`
     `npm audit fix --prefix ./boggle-api`
     or you can navigate to all the directories with a package.json and run `npm install` in that directory (and optionally `npm audit fix`).
4. Install Redis Server
   - Debian:<br>
     `apt install redis-server`
   - Arch Linux:<br>
     `pacman -S redis`
   - Windows:<br>
     https://redislabs.com/blog/redis-on-windows-10/
5. Add a file called `.api_key` to `./boggle-sveltexpress/express/` and `./boggle-api/` containing a same value (used for submitting highscores)
