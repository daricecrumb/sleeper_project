const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const app = express();
const port = 8080;

app.use(express.json())
const supabase = createClient('https://lovmqlrpfkmuhbduoejl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvdm1xbHJwZmttdWhiZHVvZWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIyMzczMjEsImV4cCI6MjAxNzgxMzMyMX0.sUEICYW0UuStRK8EsWRWhDG9Dyk_wHUvDxO3vvHQAu0');

// gets info from hitting url
app.get('/tshirt', (req,res) => {
    res.status(200).send({
        tshirt:'y',
        size:'s'
    })
});

// capture dynamic values, allow user to add data to db
app.post('/tshirt/:id', (req, res) => {
    const { id } = req.params;
    const { logo } = req.body

    if(!logo) {
        res.status(418).send({message: 'we need a logo'})
        console.log("logopa")
    }
    // if valid response
    res.send({
        tshirt: `tshirt with your ${logo} and id of ${id}`
    })
});

app.delete('/delete_player_info', async (req,res) => {
    console.log("start req")
    const first_name = "Jeremy"
    const last_name = "Zuttah"
    const full_name = first_name+' '+last_name
    
    const { data: deleted, error } = await supabase
        .from('player_info')
        .delete()
        .eq('first_name',first_name)
        .eq('last_name',last_name)
        console.log( await supabase.from('player_info').select())

    console.log("after function")
    if (error) {
        console.log("there was an error")
        console.log(error)
        res.status(500)
    }
    if (!error) {
        console.log("http log delete successful")
        res.send({
            message: `deleted player ${full_name}`
        })
    }
})

app.post('/add_pi_test', async (req,res) => {
    
    console.log("before player add")
    const { data: testWrite, error} = await supabase
        .from('player_info')
        .insert([{ 
            player_id: '3',
            first_name: 'Toe', 
            last_name: 'Joe',
            team: 'LV', 
            position: 'RB', 
            age: 26, 
            years_exp: 4 
        }])
        .select('*')
        console.log(await supabase.from('player_info').select('*'))
    console.log("after player add");
    if (error) {
        console.log(error)
        res.status(500).send({message:"error, didn't work"})
    }
    if (testWrite) {
        console.log(testWrite)
        res.send({message:"worked!"})
    }
})

app.post('/node_exp_add_player_info', async (req, res) => {
  try {
    // Fetch data from external API
    const response = await fetch('https://api.sleeper.app/v1/players/nfl');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const rawData = await response.json();
    console.log("raw data")
    const playersArray = Object.values(rawData);
    console.log(playersArray[1])
    console.log("test selecting db")
    

    // format api response into data we want
    const allPlayers = playersArray.map(player => ({
        player_id: player.player_id,
        first_name: player.first_name,
        last_name: player.last_name,
        team: String(player.team),
        position: String(player.position),
        age: player.age ? player.age : 0,
        years_exp: player.years_exp ? player.years_exp : 0
    }));
    console.log(allPlayers[1])

    // filter out only the players we want to track
    const filteredPlayers = allPlayers.filter(player => {
        const validPositions = ['QB', 'WR', 'RB', 'TE'];
        return validPositions.includes(player.position);
      });
      
      

/*
    const pDataTest = [
        {"player_id":"1","first_name":"GJ","last_name":"Kinne","team":"null","position":"QB","age":28,"years_exp":1},
        {"player_id":"4","first_name":"Roddy","last_name":"White","team":"null","position":"WR","age":38,"years_exp":15},
        {"player_id":"5","first_name":"Dallas","last_name":"Clark","team":"null","position":"TE","age":38,"years_exp":11}
    ];
*/
    
    // Insert modified data into Supabase
    const insertPromises = filteredPlayers.map(async (player) => {
        const { player_id, first_name, last_name, team, position, age, years_exp } = player;
        const { error } = await supabase
            .from('player_info')
            .upsert({ 
                player_id: player_id,
                first_name: first_name, 
                last_name: last_name,
                team: team, 
                position: position, 
                age: age, 
                years_exp: years_exp },
                { onConflict: 'player_id'}
            )
        if (error) {
            console.log(error);
            console.log('Error inserting data into Supabase');
        }
        console.log(player);
    });
    

    console.log("before await promises");
    await Promise.all(insertPromises);
    console.log("after promises");



    const { data: playerInfo, error } = await supabase
        .from('player_info')
        .select('*')
    console.log("playerInfo");

    res.status(200).json({ playerInfo });
  } catch (error) {
    console.log("error caught at end of function, outside try loop")
    res.status(500).json({ error: error.message });
  }
});

// starts server
app.listen(
    port,
    () => console.log(`it's alive on http://localhost:${port}`)
);