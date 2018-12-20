import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { PrivateRoute } from '../_components';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import QuotaManagement from '../QuotaPage';

class App extends React.Component {
    render() {
        return (
            <div className="jumbotron">
                <div className="container">
                    <div className="col">
                        <Router>
                            <div>
                                <PrivateRoute exact path="/" component={QuotaManagement} />
                                <Route path="/login" component={LoginPage} />
                                <PrivateRoute exact path="/quota" component={QuotaManagement} />
                            </div>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}

export { App }; 