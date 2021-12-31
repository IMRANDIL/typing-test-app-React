import { useState, useEffect } from "react";
import randomWords from 'random-words';





const NumberOfWords = 200;
const seconds = 60;



function App() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(seconds);
  const [input, setInput] = useState([]);
  const [currentIndex, setCurentIndex] = useState(0);

  useEffect(() => {
    setWords(generateWords())
  }, []);


  function generateWords() {
    return new Array(NumberOfWords).fill(null).map(() => {
      return randomWords()
    })
  }


  function startAction(prevCount) {
    const intervalCount = setInterval(() => {
      setCountDown((prevCount) => {
        if (prevCount === 0) {
          clearInterval(intervalCount);
          setCountDown(countDown)
        }
        return prevCount - 1
      })
    }, 1000);

  }


  function listenChar({ keyCode }) {
    //space bar
    if (keyCode === 32) {

      checkMatch();
      setInput('')
      setCurentIndex(currentIndex + 1)
    }
  }


  function checkMatch() {
    const wordToCompare = words[currentIndex];
    const doesItMatch = wordToCompare === input.trim();
    console.log(doesItMatch);
  }






  return (
    <div className="App">

      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>{countDown}</h2>
        </div>
      </div>


      <div className="control is-expanded section">
        <input type="text" className="input" onKeyDown={listenChar} value={input} onChange={(e) => setInput(e.target.value)} />
      </div>
      <div className="section">
        <button className="button is-info is-fullwidth" onClick={startAction}>
          Start Typing
        </button>
      </div>



      <div className="section">
        <div className="card">
          <div className="card-content">
            <div className="content">
              {words.map((word, index) => (

                <span key={index}>
                  <span>
                    {word.split('').map((char, idx) => (
                      <span key={idx}>{char}</span>
                    ))}
                  </span>

                  <span> </span>
                </span>


              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="columns">
          <div className="column">
            <p className="is-size-5">
              Words Per Minute:
            </p>
            <p className="has-text-primary is-size-1">{32}</p>
          </div>
          <div className="column"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
