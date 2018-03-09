import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ReactChildRenderer from './child/reactchild'

const ReactInitializer = (function(Component,containerId){
    let component = null  
    
    const setState = (newState) => {     
        
        component.setComponentState(newState)
    }

    const getState = () => {
        getCompRef().state
    }

    var renderComponent = (props,moduleRef,resolve) => {         
        component =  ReactDOM.render(
        <ReactChildRenderer {...props}
         render = {(renderProps) => <Component {...renderProps}/>}
        />, 
        document.getElementById(containerId),() =>{
            resolve?resolve(moduleRef):props.callBacks.componentLoaded?props.callBacks.componentLoaded.apply():null
        });
    }

    var renderAsyncComponent = (props,moduleRef) => {
        return new Promise((resolve,reject) => {
            renderComponent(props,moduleRef,resolve)
        })
    }

    const unmountComponent  = () => {
        var reactElContainer = document.getElementById(containerId);
        ReactDOM.unmountComponentAtNode(reactElContainer);
    }

    const getCompRef = () => component
     

    return {
        renderComponent:renderComponent, 
        unmountComponent:unmountComponent,
        renderAsyncComponent:renderAsyncComponent,    
        setState:setState,
        getState:getState
    }
});

export default class ReactRenderer {
    static  create(props) {
        const {Component,containerId,...compProps} = {...props}        
        var componentModule = Object.create(ReactInitializer(Component,containerId))
        if(compProps.props.async) {
            return componentModule.renderAsyncComponent(compProps.props,componentModule)
        } else {
            componentModule.renderComponent(compProps.props,componentModule)
            return componentModule
        }
        
    }
}

