import React, { useState } from 'react'
import axios from 'axios'
// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 5 // the index the "B" is at
export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)
  //console.log('index;', index)
  function getXY(idx) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const width = 3 // width of the grid
    const x = (idx - 1) % width + 1;
    const y = Math.floor((idx - 1) / width) + 1;
    //console.log('x;', x)
    //console.log('y;', y)
    return { x, y }
  }
  function getXYMessage(idx) {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = getXY(idx);
    return `Coordinates (${x}, ${y})`
  }
  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }
  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const { x, y } = getXY(index);
    let nextIndex = index;
    switch (direction) {
      case 'left':
        if (x > 1 && x <= 3) {
          nextIndex -= 1
        } else {
          setMessage("You can't go left")
        }
        break;
      case 'up':
        if (y > 1 && y <= 3) {
          nextIndex -= 3
        } else {
          setMessage("You can't go up")
        }
        break;
      case 'right':
        if (x < 3 && x > 0) {
          nextIndex += 1
        } else {
          setMessage("You can't go right")
        }
        break;
      case 'down':
        if (y < 3 && y > 0) {
          nextIndex += 3
        } else {
          setMessage("You can't go down")
        }
        break;
      default:
        break;
    }
    return nextIndex
  }
  function move(direction) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const nextIndex = getNextIndex(direction)
    //setMessage('')
    if (nextIndex !== index) {
      setIndex(nextIndex)
      setSteps(steps + 1)
    }
  }
  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value)
  }
  const URL = 'http://localhost:9000/api/result'
  const { x, y } = getXY(index)
  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    axios.post(URL, { email, steps, x, y })
      .then(res => {
        setMessage(res.data.message)
        setEmail('')
      })
      .catch(err => setMessage(err.response.data.message))
  }
  // jest.mock('axios', () => ({
  //     post: jest.fn(() => Promise.resolve({data:{message: 'lady win #31'}
  //   })),
  //    }))
  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage(index)}</h3>
        <h3 id="steps">You moved {steps == 1 ? `${steps} time` : `${steps} times`}</h3>
      </div>
      <div id="grid">
        {
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move('left')}>LEFT</button>
        <button id="up" onClick={() => move('up')}>UP</button>
        <button id="right" onClick={() => move('right')}>RIGHT</button>
        <button id="down" onClick={() => move('down')}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" onChange={onChange} value={email}></input>
        <input id="submit" data-testid="submit" type="submit"></input>
      </form>
    </div>
  )
}