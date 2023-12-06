#import libraries
import requests
import pandas as pd
import psycopg2 
import psycopg2.extras as extras

def get_info():
    #get raw data from api
    url = 'https://api.sleeper.app/v1/players/nfl'
    raw_data = requests.get(url).json()

    #pull data we want from rawdata & store in clean dataframe
    raw_df = pd.DataFrame(raw_data)
    #transpose the data - can't remember why...
    t_raw_df = raw_df.T
    clean_df = pd.DataFrame()

    clean_df['player_id'] = t_raw_df['player_id']
    clean_df['first_name'] = t_raw_df['first_name']
    clean_df['last_name'] = t_raw_df['last_name']
    clean_df['team'] = t_raw_df['team'].fillna('')
    clean_df['position'] = t_raw_df['position'].fillna('')
    # Convert the 'age' column to numeric, replacing non-numeric values with NaN, then replace NaN with 0
    clean_df['age'] = pd.to_numeric(t_raw_df['age'], errors='coerce').fillna(0)
    clean_df['years_exp'] = pd.to_numeric(t_raw_df['years_exp'], errors='coerce').fillna(0)

    #clean df datatypes to match sql table in player_info_script.sql

    clean_df = clean_df.astype({
        'player_id':'string',
        'first_name':'string',
        'last_name':'string',
        'team':'string',
        'position':'string',
        'age':'int',
        'years_exp':'int'
    })
    return clean_df

'''
def send_info(dataframe):
    #connection parameters for postgresql db
    conn = psycopg2.connect(
        user = 'Andres',
        password = 'adidassler',
        host = 'localhost',
        port = '5432',
        database = 'Sleeper'
    )

    cursor = conn.cursor()

    #create list of tuples (?) which contain every line item from collected api data
    tuples = [tuple(x) for x in dataframe.to_numpy()]
    cols = ','.join(list(dataframe.columns))

    #query to submit to extras.execute_values module to follow (???)
    #the %%s variable accepts the list of tuples above
    #UPSERT query with conflict handling to avoid duplication
    query = "INSERT INTO player_info(%s) VALUES %%s ON CONFLICT DO NOTHING" %cols

    #execute the sql code using the cursor
    extras.execute_values(cursor, query, tuples)

    #commit the query to the database
    conn.commit()
    print("done")

#run the code
send_info(get_info())
'''