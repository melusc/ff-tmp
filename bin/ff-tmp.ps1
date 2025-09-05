$root = "$PSScriptRoot/.."
node --env-file "$root/.env" "$root/dist/cli.js" @args
