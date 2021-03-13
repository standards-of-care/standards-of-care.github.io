import logo from './logo.svg';
import React from 'react'
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedFile: null
    }
  }

  onChangeHandler=event=>{
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  render() {
    return (
      <input type="file" name="file" onChange={this.onChangeHandler}/>
    )
  }
}

export default App;
