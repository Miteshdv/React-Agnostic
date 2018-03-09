import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class ReactChildRenderer extends React.Component {

    constructor(props) {
        super()
        this.state = {renderProps:props}
    }

    setComponentState(updatedState) {

        this.setState(prevState => ({
            renderProps: {
                ...prevState.renderProps,
                ...updatedState
            }
        }))
		
	}

    render() {
        return (
            this.props.render(this.state.renderProps)
        )
    }
}