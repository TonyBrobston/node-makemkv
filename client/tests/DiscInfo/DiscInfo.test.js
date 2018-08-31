import React from 'react';
import renderer from 'react-test-renderer';

import DiscInfo from '../../src/DiscInfo/DiscInfo';

test('DiscInfo renders correctly', () => {
    const tree = renderer.create(
        <DiscInfo />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
