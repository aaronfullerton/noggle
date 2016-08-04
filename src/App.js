import React, { Component } from 'react';
import moment from 'moment';
import math from 'mathjs'
import _ from 'lodash'

let tries = 1;

let generateNumbers = (lower = 1, upper = 20) => {

  let numbers = math.random([16], lower, upper);

  numbers = numbers.map( (num) => {
    return math.round(num);
  });

  return numbers;
}

class Counter extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      counter: 3 * 60 * 1000,
    };

    this.interval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.setState({
      counter: this.state.counter + this.props.increment
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {

    let duration = moment.duration(this.state.counter);
    let minutes = duration.minutes();
    let seconds = duration.seconds();

    return (
      <h1 className="timer">
        Time left {minutes}:{seconds}
      </h1>
    );
  }
}

class Grid extends Component {
  constructor(props) {
    super(props);

    let grid = _.chunk(generateNumbers(), 4);

    this.state = {
      grid: grid
    }

    this.generateRow = this.generateRow.bind(this);
    this.generateGrid = this.generateGrid.bind(this);
    this.handleGridClick = this.handleGridClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick(e) {
    e.preventDefault();

    let lower = parseInt(this.refs.lowerRange.value, 10);
    let upper = parseInt(this.refs.upperRange.value, 10);
    let limit = parseInt(this.refs.uniqueNumbers.value, 10);

    let generateUniqueNumbers = (limit, lower, upper) => {

      tries = 1;
      let numbers = generateNumbers(lower, upper);
      let grid = [];
  
      while(_.uniq(numbers).length <= limit) {
        tries++;
        numbers = generateNumbers(lower, upper);

        grid = _.chunk(numbers, 4);

        this.setState({
          grid: grid
        })
      }
      
      return grid
    }

    let grid = generateUniqueNumbers(limit, lower, upper)

    this.setState({
      grid: grid
    });

  }

  handleGridClick() {

  }

  generateRow(row) {
    let numbers = '';
    let n = 0;

    row.forEach( (num) => {
      n++;
        numbers += '<h2 class="box' + n + '">' + num + '</h2>'
    });

    return numbers;
  }

  generateGrid() {
      let numbers = '';
      let n = 0;
      this.state.grid.forEach( (row) => {
          console.log(row);
          n++
          numbers += '<div class="row row' + n + '">' + this.generateRow(row) + '</div>'
      })

      let html = {
        __html: numbers
      }

      return (
        <div className="grid" dangerouslySetInnerHTML={html} />
      )
  }

  render() {
    return (
      <div>
        { this.generateGrid() }

        <div className="center">
          <p>
            Generate numbers between 
              <input type="number" ref="lowerRange" defaultValue={1} /> 
              &amp;
              <input type="number" ref="upperRange" defaultValue={20} /> <br />
              with a minimum of
              <input type="number" ref="uniqueNumbers" defaultValue={15} />
              unique numbers
          </p>
          <button onClick={this.handleButtonClick}> Generate new grid </button>
          <h4> Making this took {tries} tries </h4>
        </div>
      </div>
    )
  }
}

export class App extends Component {
  render() {
    return (
      <div>
        <Grid />
        
      </div>
    );
  }
}