import { useState } from 'react';

function FetchPlayerInfo({ supabase, onDataFetched }) {
    const [inputValue, setInputValue] = useState('');

    const getPlayerInfo = async () => {
        try {
            const { data, error } = await supabase
                .from('player_info')
                .select()
                .eq('player_id', inputValue);
                if (error) {
                console.log('Error fetching data:', error);
                return;
            }
            // Pass the fetched data back to the parent component (App.js)
            onDataFetched(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <>
            <p>player info test</p>
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

export default FetchPlayerInfo;