import { useState } from 'react';

function FetchStDevVAvg({ supabase, onDataFetched }) {
    const [fetchedData, setFetchedData] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const getPlayerInfo = async () => {
        try {
            const { data, error } = await supabase
                .from('player_info')
                .select()
                .eq('player_id', inputValue);
                setFetchedData(data);
                if (error) {
                console.log('Error fetching data:', error);
                return;
            }
            setFetchedData(data);
            // Pass the fetched data back to the parent component (App.js)
            onDataFetched(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <>
            {/* input and button */}
            <input
                name="firstInput"
                type="text"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                }}
            />
            <button onClick={getPlayerInfo}>Submit</button>
        </>
    );
}

export default FetchStDevVAvg;