import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://lovmqlrpfkmuhbduoejl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvdm1xbHJwZmttdWhiZHVvZWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIyMzczMjEsImV4cCI6MjAxNzgxMzMyMX0.sUEICYW0UuStRK8EsWRWhDG9Dyk_wHUvDxO3vvHQAu0')

const { data, error } = await supabase
    .from('player_info')
    .insert({ 
        player_id: '2',
        first_name: 'George',
        last_name: 'Borge',
        team: 'KC',
        position: 'QB',
        age: 25,
        years_exp: 3
    })
    .select()

export { data, error }