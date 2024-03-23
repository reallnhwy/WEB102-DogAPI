import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentImg, setCurrentImg] = useState('');
  const [label, setLabel] = useState('');
  const [lifelabel, setLifeLabel] = useState('');
  const [banlist, setBanlist] = useState([]);

  useEffect(() => {
    callAPI();
  }, []);

  const callAPI = async () => {
    try {
      const response = await fetch('https://api.thedogapi.com/v1/images/search?limit=1&api_key=live_bLLYI128wqFk7dR2vzbf2QMTFkLW0zh2gKlBxvi7mPXZ0QbH9LIY4nvdDbNvScnX&include_breeds=true');
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      const data = await response.json();
      if (validateData(data, banlist)) {
        setCurrentImg(data[0].url);
        setLabel(data[0].breeds[0].name);
        setLifeLabel(data[0].breeds[0].life_span);
      } else {
        console.log('No breeds found or breed is already in the ban list, fetching again...');
        // Fetch image again recursively
        await callAPI();
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const validateData = (data, banlist) => {
    return (
      data.length > 0 &&
      data[0].breeds.length > 0 &&
      !banlist.includes(data[0].breeds[0].name) &&
      !banlist.includes(data[0].breeds[0].life_span)
    );
  };

  const handleImg = () => {
    callAPI();
    console.log(banlist);
  };

  const handleBan = (breedName) => {
    if(!banlist.includes(breedName)){
      setBanlist([...banlist, breedName]);
    }
  };

  return (
    <div className='App'>
      <div className='container'>
        <img src={currentImg} alt="Random Dog"/>
      </div>
      <div>
      <button onClick={() => handleBan(label)}>{label}</button>
      <button onClick={() => handleBan(lifelabel)}>{lifelabel}</button>
      <button onClick={handleImg}>Random</button>
      </div>
      
      <div className='banList'>
        <h3>Ban List</h3>
        {banlist.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
