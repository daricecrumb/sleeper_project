import { createClient } from "@supabase/supabase-js";
import FetchStDevVAvg from "./components/fetchStDevVAvg";
import './App.css'


const supabase = createClient('https://lovmqlrpfkmuhbduoejl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvdm1xbHJwZmttdWhiZHVvZWpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIyMzczMjEsImV4cCI6MjAxNzgxMzMyMX0.sUEICYW0UuStRK8EsWRWhDG9Dyk_wHUvDxO3vvHQAu0')

function App() {

  return (
    <>
      <div>
        <h1>Mostly Legal Fantasy Football</h1>
        <img class="image" src="/ogp.jpg" alt="League photo"></img>
        <p class="subheader">
          capital H Hard, capital D Data, capital A analysis
        </p>
        <p class="top-space">Introducing...the top 36 players on average points for any position, any year,
          plotted on a chart with each players' standard deviation for points</p>
      </div>
      <div >
        <FetchStDevVAvg supabase={supabase} />
      </div>
    </>
  )
}

export default App
