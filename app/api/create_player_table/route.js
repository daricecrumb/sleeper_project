/*
DROP TABLE IF EXISTS player_info;

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

DROP TABLE IF EXISTS player_info; CREATE TABLE IF NOT EXISTS player_info(

*/


import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request) {
  try {
    const result =
      await sql`
        CREATE TABLE player_info(
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
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
