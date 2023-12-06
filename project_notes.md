Collecting notes/hints for myself for this project


NEXT STEPS
1. basic api endpoint? - DONE
2. figure out how to run the backend (look at gpt questions)
    a. upload data from api into vercel postgresql
    b. make endpoint function manipulate the postgresql data based on an input variable
3. api frontend
    a. input variable from a frontend input
    b. send variable to api endpoint
4. chart.js
5. make interaction happen between user input & chart output



OTHER NOTES


PROBLEMS FOUND:
1. stop data from being added multiple times. every time player_stats.py is run, data is duplicated
2. only call active players in the player_info api, the majority of players aren't active, so calling them all is inefficient
3. player_stats.py takes ~2min to execute successfully - make this faster
4. figure out how to not 'run' the python formulas whenever files are imported - probably by separating the 'get' formulas from the 'send' formulas into 2 different files

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



