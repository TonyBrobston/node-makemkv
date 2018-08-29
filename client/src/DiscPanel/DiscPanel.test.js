import React from 'react';
import renderer from 'react-test-renderer';

import DiscPanel from './DiscPanel';

test('DiscPanel renders correctly', () => {
    const tree = renderer.create(
        <DiscPanel />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
