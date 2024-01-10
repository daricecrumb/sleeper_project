const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const app = express();
const port = 8080;

// API calls to interact with the database & populate it

app.use(express.json())
const supabase = createClient('https://lovmqlrpfkmuhbduoejl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvdm1xbHJwZmttdWhiZHVvZWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIyMzczMjEsImV4cCI6MjAxNzgxMzMyMX0.sUEICYW0UuStRK8EsWRWhDG9Dyk_wHUvDxO3vvHQAu0');

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
    console.log(filteredPlayers.length)
    
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
        // console.log(player);
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

app.post('/add_player_stats', async (req,res) => {
    try {
        // get scoring settings
        const settings = await fetch('https://api.sleeper.app/v1/league/937433485218869248');
            if (!settings.ok) {
                throw new Error('Network response was not ok');
            }
            
            const rawData = await settings.json();
            
            const desiredSettings = [
                'pass_yd', 'pass_td', 'pass_2pt', 'pass_int', 'pass_int_td',
                'rush_yd', 'rush_td', 'rush_2pt', 'rush_td_40p',
                'rec', 'rec_yd', 'rec_td', 'rec_2pt', 'rec_td_40p',
                'fum_lost', 'fum_rec_td'
            ]

            const scoringSettings = Object.keys(rawData.scoring_settings)
                .filter(key => desiredSettings.includes(key))
                .reduce((obj, key) => {
                    obj[key] = rawData.scoring_settings[key];
                    return obj;
                }, {});

            console.log("successfully pulled settings")

        // iterate through weeks & seasons
        const seasons = [2023]
        const weeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]
        let successfulAdd = []
        let errorCount = 0
        for (let x of seasons) {
            console.log(`season ${x}`)
            for (let y of weeks) {
                console.log(`week ${y}`)

                const statsAPI = await fetch(`https://api.sleeper.app/stats/nfl/${x}/${y}?season_type=regular&position[]=QB&position[]=RB&position[]=TE&position[]=WR&order_by=ppr`)
                if (!statsAPI.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const rawStats = await statsAPI.json();
                const statsArray = Object.values(rawStats);

                // format api response into data we want
                const cleanStats = statsArray.map(player => ({
                    player_id: String(player.player_id),
                    team: String(player.team),
                    season: parseInt(player.season),
                    week: parseInt(player.week),
                    off_snp: parseFloat(player.stats?.off_snp || player.stats?.snp || 0.0),
                    tm_off_snp: parseFloat(player.stats?.tm_off_snp || 0.0),
                    pass_yd: parseFloat(player.stats?.pass_yd || 0.0),
                    pass_td: parseFloat(player.stats?.pass_td || 0.0),
                    pass_2pt: parseFloat(player.stats?.pass_2pt || 0.0),
                    pass_int: parseFloat(player.stats?.pass_int || 0.0),
                    pass_int_td: parseFloat(player.stats?.pass_int_td || 0.0),
                    rush_yd: parseFloat(player.stats?.rush_yd || 0.0),
                    rush_td: parseFloat(player.stats?.rush_td || 0.0),
                    rush_2pt: parseFloat(player.stats?.rush_2pt || 0.0),
                    rush_td_40p: parseFloat(player.stats?.rush_td_40p || 0.0),
                    rec: parseFloat(player.stats?.rec || 0.0),
                    rec_yd: parseFloat(player.stats?.rec_yd || 0.0),
                    rec_td: parseFloat(player.stats?.rec_td || 0.0),
                    rec_2pt: parseFloat(player.stats?.rec_2pt || 0.0),
                    rec_td_40p: parseFloat(player.stats?.rec_td_40p || 0.0),
                    fum_lost: parseFloat(player.stats?.fum_lost || 0.0),
                    fum_rec_td: parseFloat(player.stats?.fum_rec_td || 0.0),
                }));
                
                // Calculate points for each row
                const pointsColumn = await Promise.all(cleanStats.map(async(row) => {
                    let points = 0;
                
                    // Iterate over the keys in the row
                    for (const key in row) {
                        if (key in scoringSettings) {
                            points += row[key] * scoringSettings[key];
                        }
                    }
                
                    return parseFloat(points.toFixed(2)); // Round to two decimal places
                }));
                
                // Append the 'points' column to the cleanStats array
                const cleanStatsWithPoints = cleanStats.map((row, index) => ({
                    ...row,
                    points: pointsColumn[index],
                })); 
                
                console.log("have stats ready, about to add to supabase")

                // have to map this to be able to insert
                const insertStats = await Promise.all(cleanStatsWithPoints.map(async (player) => {
                    const { player_id, team, season, week, off_snp, tm_off_snp, pass_yd, pass_td, pass_2pt, pass_int, pass_int_td, rush_yd, rush_td, rush_2pt, rush_td_40p, rec, rec_yd, rec_td, rec_2pt, rec_td_40p, fum_lost, fum_rec_td, points } = player;
                    const { error } = await supabase
                        .from('player_stats')
                        .upsert({ 
                            player_id: player_id,
                            team: team,
                            season: season,
                            week: week,
                            off_snp: off_snp,
                            tm_off_snp: tm_off_snp,
                            pass_yd: pass_yd,
                            pass_td: pass_td,
                            pass_2pt: pass_2pt,
                            pass_int: pass_int,
                            pass_int_td: pass_int_td,
                            rush_yd: rush_yd,
                            rush_td: rush_td,
                            rush_2pt: rush_2pt,
                            rush_td_40p: rush_td_40p,
                            rec: rec,
                            rec_yd: rec_yd,
                            rec_td: rec_td,
                            rec_2pt: rec_2pt,
                            rec_td_40p: rec_td_40p,
                            fum_lost: fum_lost,
                            fum_rec_td: fum_rec_td,
                            points: points },
                            { onConflict: 'player_id, season, week'}
                        )
                    if (error) {
                        console.log(error);
                        errorCount+=1
                        console.log(`Error inserting data into Supabase for player_id: ${player_id}`);
                    }
                }));
                
                successfulAdd.push(`week ${x}, season ${y}; `)
                console.log(successfulAdd)
            };
        };
        console.log("outside season loop")
        console.log("inserting into supabase errorCount: "+errorCount)
        // change this when we add stats
        res.status(200).json({ message: `successfully added players from ${successfulAdd}` });
    } catch (error) {
        console.log("error thrown from outer try catch")
        console.log(error)
        res.status(500).json({ error: error.message });
    }
})

// starts server
app.listen(
    port,
    () => console.log(`running from index.js, it's alive on http://localhost:${port}`)
);