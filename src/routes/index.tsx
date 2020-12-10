import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import Route from './Route';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

const Routes: React.FC = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" component={SignIn} exact />
            <Route path="/signup" component={SignUp} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password" component={ResetPassword} />

            <Route path="/dashboard" component={Dashboard} isPrivate />
        </Switch>
    </BrowserRouter>
);

export default Routes;
