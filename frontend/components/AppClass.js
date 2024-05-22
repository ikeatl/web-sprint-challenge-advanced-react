
// ❗ OPTIONAL, not required to pass the sprint
// ❗ OPTIONAL, not required to pass the sprint
// ❗ OPTIONAL, not required to pass the sprint
import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const initialCoordinates = {
  x: 2,
  y: 2
}

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
  coordinates: initialCoordinates,
}

export default class AppClass extends React.Component {
  constructor() {
    super()
    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
      coordinates: initialCoordinates

    }
  }

  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = (this.state.index % 3) + 1
    const y = (Math.floor(this.state.index / 3)) + 1;
    this.setState({ coordinates: { x, y } })
    return { x, y }
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.

    const { x, y } = this.getXY();
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState(initialState)

  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move = (direction) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.

    if (direction === "up") {
      // Update index and calculate new coordinates for "B"
      if (this.state.index > 2) {
        this.setState(prevState => ({
          steps: prevState.steps + 1,
          index: prevState.index - 3
        }), () => {
          this.getXY();
        });
      } else {
        this.setState({
          message: "You can't go up"
        });
      }
    } else if (direction === "down") {
      if (this.state.index < 6) {
        this.setState(prevState => ({
          steps: prevState.steps + 1,
          index: prevState.index + 3
        }), () => {
          this.getXY();
        });
      } else {
        this.setState({
          message: "You can't go down"
        });
      }
    } else if (direction === "left") {
      if (this.state.index % 3 !== 0) {
        this.setState(prevState => ({
          steps: prevState.steps + 1,
          index: prevState.index - 1
        }), () => {
          this.getXY();
        });
      } else {
        this.setState({
          message: "You can't go left"
        });
      }
    } else if (direction === "right") {
      if ((this.state.index + 1) % 3 !== 0) {
        this.setState(prevState => ({
          steps: prevState.steps + 1,
          index: prevState.index + 1
        }), () => {
          this.getXY();
        });
      } else {
        this.setState({
          message: "You can't go right"
        });
      }
    }

  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({
      email: (evt.target.value)
    })
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    const url = "http://localhost:9000/api/result"
    evt.preventDefault()
    axios.post(url, { email: this.state.email, steps: this.state.steps, x: this.state.coordinates.x, y: this.state.coordinates.y })
      .then(res => {
        this.setState({
          message: (res.data.message)
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          message: (err.response.data.message)
        })
      })
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <p>(This component is not required to pass the sprint)</p>
        <div className="info">
          <h3 id="coordinates">{`Coordinates(${this.state.coordinates.x}, ${this.state.coordinates.y})`}</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move('left')}>LEFT</button>
          <button id="up" onClick={() => this.move("up")}>UP</button>
          <button id="right" onClick={() => this.move("right")}>RIGHT</button>
          <button id="down" onClick={() => this.move("down")}>DOWN</button>
          <button id="reset" onClick={() => this.reset()}>reset</button>
        </div>
        <form onChange={this.onChange} onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email"></input>
          <input id="submit" data-testid="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
