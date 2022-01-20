import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-less/semantic.less';
import { Router } from './components/Router/Router';

ReactDOM.render(
	<React.StrictMode>
        <Router />
	</React.StrictMode>,
	document.getElementById('root')
);

