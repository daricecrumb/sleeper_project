// Sample code to handle data processing and Supabase insertion
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const app = express();
const supabase = createClient('https://lovmqlrpfkmuhbduoejl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvdm1xbHJwZmttdWhiZHVvZWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIyMzczMjEsImV4cCI6MjAxNzgxMzMyMX0.sUEICYW0UuStRK8EsWRWhDG9Dyk_wHUvDxO3vvHQAu0');

app.get('/', async (req, res) => {
  try {
    // Fetch data from external API
    const response = await fetch('https://api.sleeper.app/v1/players/nfl');
    const data = await response.json();

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const rawData = await response.json();
    console.log("raw data")
    const playersArray = Object.values(rawData);
    console.log(playersArray[1])
    console.log("test selecting db")
    console.log(await supabase.from('player_info').select('first_name'))

    /*
    const playerData = playersArray.map(player => ({
        player_id: player.player_id,
        first_name: player.first_name,
        last_name: player.last_name,
        team: String(player.team),
        position: String(player.position),
        age: player.age ? player.age : 0,
        years_exp: player.years_exp ? player.years_exp : 0
    }));
    */

    const pDataTest = [{"player_id":"1","first_name":"GJ","last_name":"Kinne","team":"null","position":"QB","age":28,"years_exp":1},{"player_id":"2","first_name":"Jeremy","last_name":"Zuttah","team":"null","position":"C","age":34,"years_exp":12},{"player_id":"3","first_name":"David","last_name":"Harris","team":"null","position":"LB","age":36,"years_exp":13},{"player_id":"4","first_name":"Roddy","last_name":"White","team":"null","position":"WR","age":38,"years_exp":15},{"player_id":"5","first_name":"Dallas","last_name":"Clark","team":"null","position":"TE","age":38,"years_exp":11}];


    // Insert modified data into Supabase
    const { data: insertedData, error } = await supabase
      .from('player_info')
      .insert(pDataTest);

    if (error) {
      throw new Error('Error inserting data into Supabase');
    }

    res.status(200).json({ insertedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
