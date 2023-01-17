FROM mcr.microsoft.com/mssql/server:2019-latest

USER root

# Copy required files
COPY ./entrypoint.sh ./entrypoint.sh
COPY ./setup.sql ./setup.sql

# Switch back to mssql user and run the entrypoint script
USER mssql
ENTRYPOINT /bin/bash ./entrypoint.sh