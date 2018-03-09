import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ValueStore } from '../../host/redux/list.store';
import { removeLast } from '../../host/redux/list.action';
import { Injector } from '@angular/core';
import { Model } from '../../../domain/model';

export default class ReactChildComponent extends React.Component{
	constructor(props) {
		super()
		this.state = { 
			'title': props.title,             
			'elements': props.store.store.getState() }
		}   
	
	componentDidMount() {
		let model  = this.props.injector.get( Model );
		console.log( 'Using Angular 2 injector in React body, model.uuid: ' + model.uuid );
		this.props.store.store.subscribe(() => {
			 this.setState({                 
				'elements' : this.props.store.store.getState()
			 });      
		});
	}

	click = () => {
		this.props.store.dispatch( removeLast() );
		this.props.callBacks.updateNotify()
	}

	componentWillReceiveProps(nextProps) {
		this.setState({title:nextProps.title})
	}

	render() {
		var elements = this.state.elements;
		var styles = { 'paddingTop': '20px' };
		return(
		   <div>
			<label>{this.state.title + ' Current state elements: ' +  elements.length}</label>
			<div style={styles}>
				<button onClick={this.click}>Remove Last</button>
			</div>
			<ul>
				{elements.map(function(listValue, i){
					return <li key={i}>{listValue}</li>;
				})}
			</ul>            
		   </div>
		);
	}
}




