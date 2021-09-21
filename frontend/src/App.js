
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { withWebChat } from '@watson-conversation/watson-assistant-web-chat-react';

import Product from './responseTypes/Product';
import './App.css';

function App({ createWebChatInstance }) {
  // Track all the custom response events in state. We can then iterate over each of them to display content.
  const [customResponseEvents, setCustomResponseEvents] = useState([]);

  useEffect(() => {
    let loaded = true;
    let instance;
    if (createWebChatInstance) {
      createWebChatInstance({
        integrationID: "b4ca0e70-ad01-48b2-89ae-cbfafa3b4b8e", // The ID of this integration.
        region: "us-south", // The region your integration is hosted in.
        serviceInstanceID: "692e741b-731e-49a9-bf84-4b5b19162321", // The ID of your service instance.
        onLoad: createdWebChatInstance => {
          if (loaded) {
            instance = createdWebChatInstance;
            instance.on({ type: 'customResponse', handler: customResponseHandler });
            instance.render();
          }
        },
      });
    }
    
    return function cleanup() {
      loaded = false;
      if (instance) {
        instance.off({ type: 'customResponse', handler: customResponseHandler });
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createWebChatInstance]);

  function customResponseHandler(event) {
    setCustomResponseEvents(oldArray => [...oldArray, event]);
  }

  return (
    <div className="App">
      {customResponseEvents.map(function mapEvent(event, index) {
        return (
          <CustomResponseComponentPortal key={index} hostElement={event.data.element}>
            <ResponsePicker message={event.data.message} />
          </CustomResponseComponentPortal>
        );
      })}
    </div>
  );
}

function ResponsePicker({ message }) {
  switch(message.user_defined.template_name) {
    case 'product':
      return <Product message={message} />;
    default:
      return null; 
  }
}

/**
 * This is the component that will attach a React portal to the given host element. The host element is the element
 * provided by the chat widget where your custom response will be displayed in the DOM. This portal will attached
 * any React children passed to it under this component so you can render the response using your own React
 * application. Those children will be rendered under the given element where it lives in the DOM.
 */
function CustomResponseComponentPortal({ hostElement, children }) {
  return ReactDOM.createPortal(children, hostElement);
}

export default withWebChat(App);
