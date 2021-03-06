import { useState, useEffect, useRef } from "react";
import randomWords from 'random-words';





const NumberOfWords = 200;
const seconds = 60;



function App() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(seconds);
  const [input, setInput] = useState([]);
  const [currentIndex, setCurentIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [currentChar, setCurrentChar] = useState([]);
  const [inCorrect, setInCorrect] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [status, setStatus] = useState('waiting');

  const textInput = useRef(null);


  useEffect(() => {
    setWords(generateWords())
  }, []);


  useEffect(() => {
    if (status === 'started') {
      textInput.current.focus()
    }
  }, [status, textInput])



  function generateWords() {
    return new Array(NumberOfWords).fill(null).map(() => {
      return randomWords()
    })
  }


  function startAction(prevCount) {
    if (status === 'finished') {
      setWords(generateWords());
      setCurentIndex(0);
      setCorrect(0);
      setInCorrect(0);
      setCurrentCharIndex(-1);
      setCurrentChar([])
    }

    if (status !== 'started') {
      setStatus('started');
      const intervalCount = setInterval(() => {
        setCountDown((prevCount) => {
          if (prevCount === 0) {
            clearInterval(intervalCount);
            setCountDown(countDown);
            setStatus('finished');
            setInput([])

          }
          return prevCount - 1
        })
      }, 1000);
    }




  }


  function listenChar({ keyCode, key }) {
    //space bar
    if (keyCode === 32) {

      checkMatch();
      setInput('')
      setCurentIndex(currentIndex + 1);
      setCurrentCharIndex(-1);
      //backspace
    } else if (keyCode === 8) {
      setCurrentCharIndex(currentCharIndex - 1);
      setCurrentChar([]);
    }

    else {
      setCurrentCharIndex(currentCharIndex + 1);
      setCurrentChar(key)
    }
  }


  function checkMatch() {
    const wordToCompare = words[currentIndex];
    const doesItMatch = wordToCompare === input.trim();
    if (doesItMatch) {
      setCorrect(correct + 1)
    }

    else {
      setInCorrect(inCorrect + 1)
    }
  }


  function getCharClass(wordIdx, charIdx, char) {
    if (wordIdx === currentIndex && charIdx === currentCharIndex && currentChar && status !== 'finished') {
      if (char === currentChar) {
        return 'has-background-success'
      } else {
        return 'has-background-danger'
      }
    } else if (wordIdx === currentIndex && currentCharIndex >= words[currentIndex].length) {
      return 'has-background-danger'
    }

    else {
      return [];
    }
  }



  return (
    <div className="App">

      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>{countDown}</h2>
        </div>
      </div>


      <div className="control is-expanded section">
        <input ref={textInput} disabled={status !== 'started'} type="text" className="input" onKeyDown={listenChar} value={input} onChange={(e) => setInput(e.target.value)} />
      </div>
      <div className="section">
        <button className="button is-info is-fullwidth" onClick={startAction}>
          Start Typing
        </button>
      </div>

      {status === 'started' && (

        <div className="section" >
          <div className="card" style={{ color: "white", background: 'black' }}>
            <div className="card-content">
              <div className="content">
                {words.map((word, index) => (

                  <span key={index}>
                    <span>
                      {word.split('').map((char, idx) => (
                        <span className={getCharClass(index, idx, char)} key={idx}>{char}</span>
                      ))}
                    </span>

                    <span> </span>
                  </span>


                ))}
              </div>
            </div>
          </div>
        </div>


      )}

      {status === 'finished' && (


        <div className="section">
          <div className="columns">
            <div className="column has-text-centered">
              <p className="is-size-5">
                Words Per Minute:
              </p>
              <p className="has-text-primary is-size-1">{correct}</p>
            </div>
            <div className="column has-text-centered">
              <div className="is-size-5">
                Accuracy:
              </div>
              <p className="has-text-info is-size-1">{Math.round((correct / (correct + inCorrect)) * 100)}%</p>
            </div>
          </div>
        </div>



      )}

    </div>
  );
}

export default App;
