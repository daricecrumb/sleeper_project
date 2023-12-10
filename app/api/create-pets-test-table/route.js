import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request) {
  try {
        const dropTable = await sql`
          DROP TABLE IF EXISTS PetsTest;`
        /*
          const result =
        await sql`CREATE TABLE PetsTest (
            record serial primary key,
            Name varchar(255),
            Owner varchar(255)
            );
        `;
        */
    return NextResponse.json({ dropTable }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}