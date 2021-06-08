#!/usr/bin/env bash

# Please Use Google Shell Style: https://google.github.io/styleguide/shell.xml

# ---- Start unofficial bash strict mode boilerplate
# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -o errexit  # always exit on error
set -o errtrace # trap errors in functions as well
set -o pipefail # don't ignore exit codes when piping output
set -o posix    # more strict failures in subshells
# set -x          # enable debugging

IFS=$'\n\t'
# ---- End unofficial bash strict mode boilerplate

# change the app user's uid:gid to match the repo root directory's
# uid=$(stat -c "%u" .)
# if [[ "${uid}" == "0" ]]; then
#   # Never run as root even if directory is owned by root.
#   # Fall back to 1000 which we know is the app user
#   uid=1000
# fi
# usermod --uid "${uid}" --non-unique "${run_user}" |& grep -v "no changes" || true

# scripts_dir="$(dirname "${BASH_SOURCE[0]}")"

# "${scripts_dir}/fix-volumes.sh" "${run_user}"

run_user="node"
command=(npx migrator migrate -y)

unset IFS
exec su-exec "${run_user}" "${command[@]}"
exit
