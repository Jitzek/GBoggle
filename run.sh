# Launches all necessary components for boggle.
# TODO: find a way to launch processes in seperate terminals.
npm run dev --prefix ./boggle-sveltexpress/svelte > /dev/null & ./boggle-api/run-redis.sh > /dev/null & npm run dev --prefix ./boggle-api > /dev/null & clear & npm run dev --prefix ./boggle-sveltexpress