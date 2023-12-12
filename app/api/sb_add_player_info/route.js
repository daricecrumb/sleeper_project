import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server';

// Create a single supabase client for interacting with your database
const supabase = createClient('https://lovmqlrpfkmuhbduoejl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvdm1xbHJwZmttdWhiZHVvZWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIyMzczMjEsImV4cCI6MjAxNzgxMzMyMX0.sUEICYW0UuStRK8EsWRWhDG9Dyk_wHUvDxO3vvHQAu0')

export async function GET(request) {
    try {
        const response = await fetch('https://api.sleeper.app/v1/players/nfl');
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

        const insertManual = async () => {
            const { data, error} = await supabase
                .from('player_info')
                .insert([{ 
                    player_id: '3',
                    first_name: 'toe', 
                    last_name: 'joe',
                    team: 'LV', 
                    position: 'RB', 
                    age: 26, 
                    years_exp: 4 
                }])
                .select('*')
            console.log("player added");
            if (error) {
                console.log(error)
            }
            if (data) {
                console.log(data)
            }
        }
        
        
        console.log("insert manual")
        console.log(insertManual)
        console.log(await supabase.from('player_info').select())

        const insertPromises = pDataTest.map(async (player) => {
            const { player_id, first_name, last_name, team, position, age, years_exp } = player;
            //await client.sql`INSERT INTO player_info (player_id, first_name, last_name, team, position, age, years_exp) VALUES (${player_id}, ${first_name}, ${last_name}, ${team}, ${position}, ${age}, ${years_exp});`;
            const { error } = await supabase
                .from('player_info')
                .insert([{ 
                    player_id: player_id,
                    first_name: first_name, 
                    last_name: last_name,
                    team: team, 
                    position: position, 
                    age: age, 
                    years_exp: years_exp }
                ])
            console.log(player);
        });

        console.log("before await promises");
        await Promise.all(insertPromises);
        console.log("after promises");

        const { data: playerInfo, error } = await supabase
            .from('player_info')
            .select()
        console.log("playerInfo");

        return NextResponse(JSON.stringify(({ playerInfo }, { status: 200 })));
    } catch (error) {
        console.error('There was a problem fetching the data:', error);
        return NextResponse(JSON.stringify(({ error }, { status: 500 })));
    }
}