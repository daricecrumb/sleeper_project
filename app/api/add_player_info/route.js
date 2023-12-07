import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const response = await fetch('https://api.sleeper.app/v1/players/nfl');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const rawData = await response.json();

        const playersArray = Object.values(rawData);
        
        const playerData = playersArray.map(player => ({
            player_id: player.player_id,
            first_name: player.first_name,
            last_name: player.last_name,
            team: String(player.team),
            position: String(player.position),
            age: player.age ? player.age : 0,
            years_exp: player.years_exp ? player.years_exp : 0
        }));

        const pDataTest = [{"player_id":"1","first_name":"GJ","last_name":"Kinne","team":"null","position":"QB","age":28,"years_exp":1},{"player_id":"2","first_name":"Jeremy","last_name":"Zuttah","team":"null","position":"C","age":34,"years_exp":12},{"player_id":"3","first_name":"David","last_name":"Harris","team":"null","position":"LB","age":36,"years_exp":13},{"player_id":"4","first_name":"Roddy","last_name":"White","team":"null","position":"WR","age":38,"years_exp":15},{"player_id":"5","first_name":"Dallas","last_name":"Clark","team":"null","position":"TE","age":38,"years_exp":11}];

        console.log("before promises");

        const client = await sql.connect();        

        const insertPromises = playerData.map(async (player) => {
            const { player_id, first_name, last_name, team, position, age, years_exp } = player;
            await client.sql`INSERT INTO player_info (player_id, first_name, last_name, team, position, age, years_exp) VALUES (${player_id}, ${first_name}, ${last_name}, ${team}, ${position}, ${age}, ${years_exp});`;
            console.log(player);
        });

        console.log("before await promises");
        await Promise.all(insertPromises);
        console.log("after promises");

        const playerInfo = await client.sql`SELECT * FROM player_info;`;
        console.log("playerInfo");

        client.release();
        return NextResponse.json({ playerInfo }, { status: 200 });
    } catch (error) {
        console.error('There was a problem fetching the data:', error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
