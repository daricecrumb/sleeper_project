Collecting notes/hints for myself for this project


NEXT STEPS
1. DONE - basic api endpoint?
2. DONE - figure out how to run the backend (look at gpt questions)
    a. DONE - create vercel postgresql database & table
    b. DONE - upload player data from api into vercel postgresql table
        i. https://stackoverflow.com/questions/77093626/vercel-postgres-bulk-insert-building-sql-query-dynamically-from-array
    c. DONE - make endpoint function manipulate the postgresql data based on an input variable
        i. DONE - app.py, figure out how to connect to database on production site (https://sleeper-project.vercel.app/)
            1. started prisma database - DONE
            2. after i migrate the change, i should test out querying the database (CRUD) here: https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/querying-the-database-typescript-postgresql
                i. prisma client won't see the pets database to run a test, figure out why it isn't visible
                ii. nvm... figured out how to run prisma migrations, command is `npx prisma migrate dev --name [name]`
                iii. START HERE, example of react+next+prisma - https://github.com/prisma/prisma-examples/tree/latest/javascript/rest-nextjs
                    1. FIGURE OUT WHY PETS NOT ON `npx prisma studio` & why player_info db empty.....
            3. then i have to figure out how to make sure prisma is hosting my backend server
        note: i officially have a deployment that works on https://sleeper-project-vite.vercel.app/ where i can submit a number into a input box and it outputs from a query from my supabase database - now i have to 
            a. put all the data into supabase
            b. build queries based on input values
            c. chart.js
3. DONE - send requests from frontend
    a. input variable from a frontend input - DONE
    b. send variable to api endpoint - DONE
    c. confirm it works on production - DONE
        i. figure out why vercel deployment is blocking on CORS resource - DONE
4. finish backend
    a. input the rest of the data from player_info
        i. data is not writing to db programmatically (using localhost:3000) - figure out why...
        ii. error inserting data into supabase - debugging with insomnia api and `node .` on root directory with the `index.js` file - seems to be working well, now to figure out why supabase won't work
        ii. update - worked!! supabase wasn't working because of grant permissions, due to prisma bug, which were sorted here: https://stackoverflow.com/questions/67551593/supabase-client-permission-denied-for-schema-public
        iii. now need to delete the current data from db and then write the whole db correctly from api
    b. do same with the scoring settings & the stats
    c. add manipulations to data that can be called by endpoints
    d. don't forget to add the routes & urls to CORS
5. chart.js
    a. https://towardsdatascience.com/django-pandas-and-chart-js-for-a-quick-dashboard-e261bce38bee
6. make interaction happen between user input & chart output



OTHER NOTES


PROBLEMS FOUND:
1. stop data from being added multiple times. every time player_stats.py is run, data is duplicated
1. also get rid of the 'pets' table in the DB
1. do we have to update schema.prisma every time i make a change to the db? probably...
    i. You now have a baseline for your current database schema. To make further changes to your database schema, you can update your Prisma schema and use prisma migrate dev to apply the changes to your database.
    ii. from here: https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/baseline-your-database-node-postgresql
2. only call active players in the player_info api, the majority of players aren't active, so calling them all is inefficient
3. player_stats.py takes ~2min to execute successfully - make this faster
4. figure out how to not 'run' the python formulas whenever files are imported - probably by separating the 'get' formulas from the 'send' formulas into 2 different files
5. running the 'add_player_info' route.js file takes like 8 minutes, so need to figure out how to pre-emptively filter out only the QB, RB, WR, and TE from the list, because there are a lot of DB/OL in the list

how to run backend

1. To execute api_calls.py, run it from the terminal
2. Launch psql from pgadmin to access the database directly, unsure how to access specific database from general psql terminal
    a. command to execute the psql file is \i ${filepath}
    b. ^ could maybe program this into the .sql file?

initial plan
1. run small test with web app that can send http requests to backend
    a. boilerplate html page
    b. number 1-100 textbox, save as `player_id`
    c. submit button
    d. blue textbox
    e. after submit, change the number in blue textbox to `player_id`
    f. after submit, return player_name from player_info based on `player_id` in blue textbox
2. figure out how to filter out if a player was hurt or not for a given week, since active player data is throwing off the standard deviation calculations
3. calculate projections


QUERIES
1. top 50 wide receivers by snap percentage in 1 game week
```
select
    concat(pi.first_name,' ',pi.last_name) as name,
    pi.position,
    pi.team,
    pi.age,
    case
        when ps.team_off_snp = 0
        then 0
        else round((ps.off_snp / ps.team_off_snp)::numeric,2)
        end as per_snp
from 
    player_stats as ps,
    player_info as pi
where
    ps.player_id = pi.player_id and
    pi.position = 'WR'
order by
    per_snp desc
limit 50
;
```

2. 

more notes
Backend Setup:
* 		API Endpoints: Develop API endpoints using a backend framework like Django, Flask, or FastAPI to handle user requests and fetch data from the PostgreSQL database.
* 		Data Processing: Create functions in the backend to process data, perform calculations, and generate necessary dataframes based on user inputs. Ensure these operations are optimized for speed and efficiency.
* 		Serialization: Serialize the dataframes into JSON format for easy consumption by the frontend.
Frontend Setup:
* 		React Components: Develop React components to capture user input (e.g., forms, buttons) and send requests to the backend API endpoints upon user interaction.
* 		Chart.js Integration: Utilize Chart.js to render charts within the React components. Set up the charts to accept data fetched from the backend.
* 		API Integration: Implement functions to make asynchronous requests to the backend API endpoints using tools like fetch or libraries like Axios.



