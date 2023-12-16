import { useState } from 'react';
import Plotly from 'plotly.js-dist';

/* parameters for the function:
    - games with 1 or more off_snp >=10
    - chart only shows players of 1 position
    - top 36 players shown
*/

// calculates average given an array of numbers
function calculateMean(numbers) {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / numbers.length;
    return Math.round((mean + Number.EPSILON) * 100) / 100
  }

// calculates stdev given an array of numbers
function calculateStandardDeviation(numbers) {
    const mean = calculateMean(numbers);
    const squaredDifferences = numbers.map((num) => Math.pow(num - mean, 2));
    const variance = calculateMean(squaredDifferences);
    const standardDeviation = Math.sqrt(variance);
    return Math.round((standardDeviation + Number.EPSILON) * 100) / 100
  }

function FetchStDevVAvg({ supabase }) {
    const [inputPosition, setInputPosition] = useState('');
    const [inputSeason, setInputSeason] = useState('');

    const getStats = async () => {
        try {
            // get player stats
            const { data: playerStats, error: playerStatsError } = await supabase
                .from('player_stats')
                .select('player_id, points')
                .eq('season', inputSeason)
                .gte('off_snp', 1);
                
                if (playerStatsError) {
                    console.log('Error fetching playerStats:', playerStatsError);
                    return;
                }
            
            // get player info (link name to id)
            const { data: playerInfo, error: playerInfoError } = await supabase
                .from('player_info')
                .select('player_id, first_name, last_name')
                .eq('position', inputPosition);

                if (playerInfoError) {
                    console.log('Error fetching playerInfo:', playerInfoError);
                    return;
                }
            
            // filter out to include only playerstats whose playerid is in playerinfo
            const filteredStats = playerStats.filter(stat =>
                playerInfo.some(info => info.player_id === stat.player_id)
              );

            // put all the players points for the year into an array
            const pointsMap = {};
            filteredStats.forEach(({ player_id, points }) => {
                if (!pointsMap[player_id]) {
                    pointsMap[player_id] = [];
                }
                pointsMap[player_id].push(points);
            });
                  
            // calculate average & standard deviation
            const playerStatistics = {};
            for (const playerId in pointsMap) {
                const pointsArray = pointsMap[playerId];
                
                const average = calculateMean(pointsArray)
                const standardDeviation = calculateStandardDeviation(pointsArray)

                playerStatistics[playerId] = {
                    average,
                    standardDeviation
                };
            }

            const playerStatsArray = Object.entries(playerStatistics).map(([player_id, stats]) => ({
                player_id,
                average: stats.average,
                standardDeviation: stats.standardDeviation
              }));
              
            // Sort the players by average points in descending order
            playerStatsArray.sort((a, b) => b.average - a.average);
            
            // Get the top 36 players
            const topPlayers = playerStatsArray.slice(0, 36).map((player, index) => ({
                ...player,
                index: index + 1 // Adding 1 to start the index from 1 instead of 0
            }));
              
            console.log(topPlayers[0], topPlayers[2]);

            const topPlayersWithFullname = topPlayers.map(player => {
                const playerName = playerInfo.find(info => info.player_id === player.player_id);
                const { first_name, last_name } = playerName || {};
                
                return {
                  ...player,
                  fullname: `${first_name} ${last_name}`
                };
              });
              
            console.log("data for chart: ", topPlayersWithFullname);

            // plotly plot
            const renderPlot = (data) => {
                const traceData = data.map(player => ({
                    x: [player.average],
                    y: [player.standardDeviation],
                    mode: 'markers+text',
                    type: 'scatter',
                    name: `${player.index}: ${player.fullname}`,
                    text: [player.index],
                    textposition: 'top center',
                    textfont: {
                        family: 'Raleway, sans-serif',
                        size: 6
                    },
                    marker: { size: 6 }
                }));
                
                const layout = {
                    width: 340,
                    margin: {
                        t: 40,
                        b: 40,
                        l: 40,
                        r: 40
                    },
                    paper_bgcolor: "#C4DCED",
                    title: {
                        text: 'StDev v Avg'
                    },
                    xaxis: {
                        title: {
                            text: 'Average',
                            font: {
                                size: 8
                            }
                        },
                        tickfont: {
                            size: 8
                        },
                        range: [Math.min(...data.map(player => player.average)) - 1, Math.max(...data.map(player => player.average)) + 1]                        
                    },
                    yaxis: {
                        title: {
                            text: 'Standard Deviation',
                            font: {
                                size: 8
                            }
                        },
                        tickfont: {
                            size: 8
                        },
                        range: [Math.min(...data.map(player => player.standardDeviation)) - 1, Math.max(...data.map(player => player.standardDeviation)) + 1]
                    },
                    legend: {
                        orientation: 'h',
                        y: -0.2,
                        x: 0.5,
                        xanchor: 'center',
                        yanchor: 'top',
                        font: {
                            family: 'Arial, sans-serif',
                            size: 8,
                            color: 'grey'
                        }
                    }
                };
                
                Plotly.newPlot('myDiv', traceData, layout,{displayModeBar: false});
            };

            // rendering plot
            renderPlot(topPlayersWithFullname)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <>
            <p>input season</p>
            <select 
                class = "dropdown"
                name="inputSeason"
                type="number"
                value={inputSeason}
                onChange={(e) => {
                    setInputSeason(e.target.value);
                }}>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
                <option value="2016">2016</option>
                <option value="2015">2015</option>
                <option value="2014">2014</option>
                <option value="2013">2013</option>
                <option value="2012">2012</option>
                <option value="2011">2011</option>
                <option value="2010">2010</option>
            </select>
            <p>input position</p>
            <select 
            class = "dropdown"
                name="inputPosition"
                type="text"
                value={inputPosition}
                onChange={(e) => {
                    setInputPosition(e.target.value);
                }}>
                <option value="WR">WR</option>
                <option value="RB">RB</option>
                <option value="QB">QB</option>
                <option value="TE">TE</option>
            </select>
            <div>
                <button class = "chart" onClick={getStats}>Submit Season + Position</button>
            </div>
            <div id="myDiv" class="chart"/>
        </>
    );
}

export default FetchStDevVAvg;