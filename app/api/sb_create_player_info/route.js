// create table copy here

//import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request) {
  try {
    //const dropTable = await sql`
    //  DROP TABLE IF EXISTS player_info;`
    
      // Wait for all DROP promises to resolve before proceeding to INSERT
    //await Promise.all(dropTable);
    
    const createTable =
      await sql`
        CREATE TABLE IF NOT EXISTS player_info(
            record serial primary key,
            player_id text,
            first_name text,
            last_name text,
            team text,
            position text,
            age int,
            years_exp int
        );
      `;
    return NextResponse.json({ createTable }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
