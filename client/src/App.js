import React, {Component} from 'react';
import {
    Col,
    Container,
    Row
} from 'reactstrap';

import logo from './logo.svg';
import Header from './Header';
import DiscPanel from './DiscPanel';
import {
    subscribeToDriveInfo
} from './api.js';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            driveInfo: {}
        };
        subscribeToDriveInfo(this.handleDriveInfo, this);
    }

    handleDriveInfo(driveInfo) {
        console.log('Got Drive Info');
        console.debug(driveInfo);
        this.setState({
            driveInfo
        });
    }

    render() {
        return (
            <Container
                className="App"
                fluid
            >
                <Header />
                <Row>
                    {Object.keys(this.state.driveInfo).map((driveId) => {
                        const driveInfo = this.state.driveInfo[driveId];

                        return <Col
                            md="6"
                            xs="12"
                               >
                            <DiscPanel
                                discName={driveInfo.discName}
                                driveId={driveId}
                                driveState={driveInfo.driveState}
                            />
                               </Col>;
                    })}
                </Row>
            </Container>
        );
    }
}

export default App;
