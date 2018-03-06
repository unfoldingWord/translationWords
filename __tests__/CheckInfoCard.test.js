/* eslint-env jest */
import React from 'react';
import CheckInfoCard from '../src/components/CheckInfoCard';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import renderer from 'react-test-renderer';

describe('CheckInfoCard component Tests', () => {
  it('check CheckInfoCard', () => {
    let props = {
      translate:k=>k,
      file: 'this is a test of the check info card component. this is a test of the check info card component. this is a test of the check info card component. this is a test of the check info card component. this is a test of the check info card component. this is a test of the check info card component. ',
      title: 'title'
    };
    const component = renderer.create(
      <MuiThemeProvider>
        <CheckInfoCard {...props} />
      </MuiThemeProvider>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
