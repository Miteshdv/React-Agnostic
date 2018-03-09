import { Component, OnInit, Injector } from '@angular/core';
import ReactChildComponent from '../react/child/child';
import ReactRenderer from '../react/ReactRenderer';
import { ValueStore } from './redux/list.store';
import { add, remove } from './redux/list.action';
import { Model } from '../../domain/model';

@Component({
	selector: 'host-component',
	templateUrl: 'app/components/host/host.component.html',
	styleUrls: ['app/components/host/host.component.css'],
	providers: [
		Model
	]
})

export class HostComponent implements OnInit { 
	
	public store: ValueStore;

	public val: string = 'green';
	
	public R1;
	
	public R2;

	constructor( public model: Model, public injector: Injector ) {
		this.initStore();		
		console.log('Resolved model instance: ' + model.uuid);	
	}

	public initStore() {
		this.store = new ValueStore( this.model.colors );
		this.store.store.subscribe(() => {
			console.log('on state change (angular 2 host): ' + this.store.store.getState().length);
		});
	}

	public ngOnInit() {
		
		this.createReactComponent()
	
	}

	public async createReactComponent() {
		this.R1 = await ReactRenderer.create({ Component:ReactChildComponent,
			containerId:'react-component-container',
			props:{title:this.model.componentTitle,store: this.store, injector:this.injector ,
				   callBacks:{updateNotify:this.updateNotifyR1.bind(this)},
				   async:true}});
	
	   console.log('React Component 1 Loaded')

	   this.R2 = ReactRenderer.create({ Component:ReactChildComponent,
			containerId:'react-component-container-2',
			props:{title:this.model.componentTitle,store: this.store, injector:this.injector ,
				   callBacks:{updateNotify:this.updateNotifyR2.bind(this),
							  componentLoaded:this.componentR2Loaded()}}});
	}

	componentR2Loaded() {
		console.log('React Component 2 Loaded')
	}

	updateNotifyR1() {
		
		this.R1.setState({title:"Test React Component 1 SetState"})
		
	}

	updateNotifyR2() {
		
		this.R2.setState({title:"Test React Component 2 SetState"})
		
	}

	public onAdd() {
		this.store.dispatch( add( this.val ) );
	}

	public onRemove() {
		this.store.dispatch( remove ( this.val ) );
	}
}
