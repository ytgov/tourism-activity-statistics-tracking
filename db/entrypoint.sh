#start SQL Server, start the script to create the DB

/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $MSSQL_SA_PASSWORD -d master -v UserPass="$DB_PASS" -i setup.sql -l 60 &

/opt/mssql/bin/sqlservr 
#& ./init-database.sh