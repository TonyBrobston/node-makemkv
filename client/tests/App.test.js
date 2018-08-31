import React from 'react';
import {shallow} from 'enzyme';
import {Container, Row} from 'reactstrap';

import App from '../src/App';
import Header from '../src/Header';

describe('<App />', () => {
    let renderedContainer,
        renderedHeader,
        renderedRow;

    const cacheChildren = () => {
        renderedHeader = renderedContainer.childAt(0);
        renderedRow = renderedContainer.childAt(1);
    };

    const render = () => {
        renderedContainer = shallow(<App />);
        cacheChildren();
    };

    beforeEach(() => {
        render();
    });

    it('should have a Container component with the correct attributes', () => {
        expect(renderedContainer.type()).toBe(Container);
        expect(renderedContainer.props().className).toBe('App');
        expect(renderedContainer.props().fluid).toBeTruthy();
    });

    it('should have a Header component', () => {
        expect(renderedHeader.type()).toBe(Header);
    });

    it('should have a Row component', () => {
        expect(renderedRow.type()).toBe(Row);
    });
});
