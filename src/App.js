import React, { useState } from 'react';
//import { useId } from 'react';
import './App.css';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [fetchedData, setFetchedData] = useState(null);

  /*
  const [testData, setTestData] = useState(null);
  const [firstInput, secondInput] = useId('');
*/
  
  const sendDataToFlask = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_player_id', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        //mode: "no-cors",
        body: JSON.stringify({ player_id: inputValue }),
      });
      const data = await response.json();
      setFetchedData(data.data);
      console.log("load")
      console.log(response)
      console.log(response.body)
//      console.log(response.body.player_id)
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
/*
  const reqres = async () => {
    try {
      const response = await fetch('https://reqres.in/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testreqres: inputValue})
      });
      const data2 = await response.json();
      setTestData(data2.data);
      console.log(data2)
    } catch (error) {
      console.error('error fetching data: ', error)
    }
  };
*/
  return (
    <>
      <div>
        <p>capital H Hard capital D Data</p>
        <p>capital A Analysis</p>
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
  );
}

export default App;

/*
<div>
        <p>testreqres</p>
      </div>
      <div>
        <input
          name="secondInput"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={reqres}>Submit</button>
      </div>
*/
//      {/* Display the fetched test data */}
/*      {fetchedData && (
        <div>
          <h2>Fetched Data:</h2>
          <pre>{JSON.stringify(testData, null, 2)}</pre>
        </div>
      )}
*/