#!/usr/bin/env bash
# wait-for-it.sh

host="$1"
shift
cmd="$@"

until nc -z ${host%:*} ${host##*:}; do
  >&2 echo "Waiting for $host to be available..."
  sleep 1
done

>&2 echo "$host is available – executing command"
exec $cmd
