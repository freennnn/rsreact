import React from "react";
import './ErrorButton.css'

export class ErrorButton extends React.Component<{ children: React.ReactNode }> {
  state = { shouldProduceErrorInRender: false}

  onButtonClick= () => {
    this.setState ({ shouldProduceErrorInRender: !this.state.shouldProduceErrorInRender})
  }

  render() {
    if (this.state.shouldProduceErrorInRender) {
      throw new Error('I just wanted some github repos and all they gave me was an Error!')
    }
    return (
      <button type='button' onClick={this.onButtonClick} className='error-button'>
        {this.props.children}
      </button>
    )
  }

}