import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import './App.css'

const supabase = createClient('https://lovmqlrpfkmuhbduoejl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvdm1xbHJwZmttdWhiZHVvZWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIyMzczMjEsImV4cCI6MjAxNzgxMzMyMX0.sUEICYW0UuStRK8EsWRWhDG9Dyk_wHUvDxO3vvHQAu0')

function App() {
  const [players, setPlayers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    getPlayers();
  }, []);

  async function getPlayers() {
    const { data } = await supabase.from("player_info").select();
    setPlayers(data);
  }

  const sendDataToFlask = async () => {
    try {
      // somehow get the player id to be input here
      const { data, error } = await supabase
        .from('player_info')
        .select()
        .eq('player_id', inputValue) 
      setFetchedData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <div>
        <p>
          capital H Hard capital D Data
        </p>
        <p>
          capital A analysis
        </p>
      </div>
      <div>
        <input
          name="firstInput"
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            console.log(e.target.value);
          }}
        />
        <button onClick={sendDataToFlask}>Submit</button>
      </div>
      {/* Display the fetched data */}
      {fetchedData && (
        <div>
          <h2>Fetched Data:</h2>
          <pre>{JSON.stringify(fetchedData, null, 2)}</pre>
        </div>
      )}
    </>
  )
}

export default App
