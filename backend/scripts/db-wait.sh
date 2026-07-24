#!/bin/sh
# db-wait.sh

host="$1"
port="$2"
shift 2
cmd="$@"

echo "Waiting for database at $host:$port..."

until nc -z -v -w30 "$host" "$port"; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is up - executing command"
exec $cmd
