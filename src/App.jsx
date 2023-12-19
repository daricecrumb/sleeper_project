import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import FetchStDevVAvg from "./components/fetchStDevVAvg";
import { Helmet } from 'react-helmet';
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
      <Helmet>
        <title>Mostly Legal Fantasy Football</title>
          <meta property="og:title" content="Your Open Graph Title" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://www.daricecrumb.com/ogp.jpg" />
          <meta property="og:url" content="https://www.daricecrumb.com" />
      </Helmet>
      </div>
      <div>
        <h1>Mostly Legal Fantasy Football</h1>
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
    </>
  )
}

export default App
