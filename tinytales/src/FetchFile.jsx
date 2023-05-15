import React, { useState } from "react";
import axios from "axios";
import "./FetchFile.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  LabelList,
} from "recharts";

function FetchFile() {
  const [wordFrequencies, setWordFrequencies] = useState({});

  const calculateWordFrequencies = async (link) => {
    const response = await axios.get(link);
    const text = response.data.toLowerCase();
    const words = text.split(/\s+/);
    const frequencies = {};

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (frequencies[word] === undefined) {
        frequencies[word] = 1;
      } else {
        frequencies[word]++;
      }
    }

    const sortedFrequencies = Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    const sortedObject = Object.fromEntries(sortedFrequencies);
    setWordFrequencies(sortedObject);
  };

  let words = [];
  let freq = [];
  let barDataArray = [];

  Object.keys(wordFrequencies).forEach((key) => {
    words.push(key);
    const value = wordFrequencies[key];
    freq.push(value);
    const newData = { letter: key, frequency: value };
    barDataArray.push(newData);
  });

  function handleExportClick() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += words + "\n";
    csvContent += freq + "\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function reset() {
    freq.length = 0;
    setWordFrequencies({});
  }

  return (
    <div>
      <div className="main-div">
        
        <div className="para">
          {freq.length === 0 && <p>Click the Submit Button!</p>}
        </div>
        <div className="graph">
          {barDataArray.length > 0 && (
            <div className="bar">
              <ResponsiveContainer width="80%" aspect={3}>
                <BarChart data={barDataArray} width={400} height={400}>
                  <XAxis dataKey="letter">
                    <Label
                      value="20 Most Occurring Letters"
                      offset={-2}
                      position="insideBottom"
                    />
                  </XAxis>
                  <YAxis dataKey="frequency">
                    <Label
                      value="Frequency Of Letters"
                      angle={-90}
                      position="left"
                      offset={-1}
                      textAnchor="middle"
                    />
                  </YAxis>
                  <Tooltip />
                  <Bar dataKey="frequency" fill="purple">
                    <LabelList dataKey="frequency" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="buttons">
          {freq.length > 0 && (
            <button className="reset" onClick={reset}>
              Reset
            </button>
          )}

          {freq.length === 0 && (
            <button
              onClick={() =>
                calculateWordFrequencies(
                  "https://www.terriblytinytales.com/test.txt"
                )
              }
              className="submit"
            >
              Submit
            </button>
          )}

          {freq.length > 0 && (
            <button onClick={handleExportClick} className="export">
              Export
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FetchFile;