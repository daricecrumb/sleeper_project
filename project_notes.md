Collecting notes/hints for myself for this project


NEXT STEPS
1. basic api endpoint? - DONE
2. figure out how to run the backend (look at gpt questions)
    a. DONE - create vercel postgresql database & table
    b. DONE - upload player data from api into vercel postgresql table
        i. https://stackoverflow.com/questions/77093626/vercel-postgres-bulk-insert-building-sql-query-dynamically-from-array
    c. make endpoint function manipulate the postgresql data based on an input variable
        i. app.py, figure out how to connect to database on production site (https://sleeper-project.vercel.app/)
            1. started prisma database - DONE
            2. after i migrate the change, i should test out querying the database (CRUD) here: https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/querying-the-database-typescript-postgresql
                i. prisma client won't see the pets database to run a test, figure out why it isn't visible
                ii. nvm... figured out how to run prisma migrations, command is `npx prisma migrate dev --name [name]`
                iii. START HERE, example of react+next+prisma - https://github.com/prisma/prisma-examples/tree/latest/javascript/rest-nextjs
                    1. FIGURE OUT WHY PETS NOT ON `npx prisma studio` & why player_info db empty.....
            3. then i have to figure out how to make sure prisma is hosting my backend server
3. api frontend
    a. input variable from a frontend input - DONE
    b. send variable to api endpoint - DONE
    c. confirm it works on production
        i. figure out why vercel deployment is blocking on CORS resource
        
4. finish backend
    c. do same with the scoring settings & the stats
    d. add manipulations to data that can be called by endpoints
    e. don't forget to add the routes & urls to CORS
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



