import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import FetchPlayerInfo from './components/fetchPlayerInfo';
import FetchStDevVAvg from "./components/fetchStDevVAvg";
import './App.css'


const supabase = createClient('https://lovmqlrpfkmuhbduoejl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvdm1xbHJwZmttdWhiZHVvZWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIyMzczMjEsImV4cCI6MjAxNzgxMzMyMX0.sUEICYW0UuStRK8EsWRWhDG9Dyk_wHUvDxO3vvHQAu0')

function App() {
  const [playerInfo, setPlayerInfo] = useState(null);

  const handlePlayerInfo = (data) => {
    setPlayerInfo(data);
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
      <div >
        <FetchStDevVAvg supabase={supabase} />
      </div>
      <div>
        <FetchPlayerInfo supabase={supabase} onDataFetched={handlePlayerInfo} />
        {/* Display the fetched data */}
        {playerInfo && (
          <div>
            <h2>Fetched Data:</h2>
            <pre>{JSON.stringify(playerInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </>
  )
}

export default App
