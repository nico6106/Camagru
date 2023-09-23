#!/bin/sh

#export DATABASE_URL="postgresql://postgres:n2J5dJGelC0W4UEtiHkMZRrdrSHsLKr7@dev-db:5434/nest?schema=public"

export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@dev-db:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

npm install


sleep 5
pg_isready -U ${POSTGRES_USER} -h localhost -p 5432

psql -U ${POSTGRES_USER} -d test -c "SELECT 1;" 2>/dev/null
EXIT_CODE=$?
echo "bdd exitcode=" $EXIT_CODE
if [ $EXIT_CODE -eq 0 ]; then
	echo "La base de données 'test' existe déjà."
else
	echo "Creating DB"

	psql -U ${POSTGRES_USER} -c "CREATE DATABASE test;"

	if [ $? -eq 0 ]; then
    	echo "La base de données 'test' a été créée avec succès."
	else
		echo "Erreur lors de la création de la base de données 'test'."
	fi

fi

# npx prisma generate

# echo "-----Migrating database-----"

# while true; do
# 	echo "-----Migrating database try-----"
# 	# uncomment to reset database if error when using migrate dev (especially if columns have been deleted with values still in the db)
# 	# npx prisma migrate reset --force 
# 	npx prisma migrate dev --name init
# 	EXIT_CODE=$?
# 	echo "PRISMA EXIT CODE: $EXIT_CODE"
# 	if [ $EXIT_CODE -eq 0 ]; then
# 		break
# 	fi
# done

# echo "-----Starting backend-----"

npm run devStart 
