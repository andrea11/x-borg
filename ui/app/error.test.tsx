import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ErrorComponent from './error';

describe('<Error />', () => {
  it('should display error message', () => {
    const error = new Error('test error message');
    const resetMock = jest.fn();
    const { getByText } = render(<ErrorComponent error={error} reset={resetMock} />);
    expect(getByText('Something went wrong loading the page')).toBeInTheDocument();
  });

  it('should call reset function on button click', () => {
    const error = new Error('test error message');
    const resetMock = jest.fn();
    const { getByText } = render(<ErrorComponent error={error} reset={resetMock} />);
    const button = getByText('Try again');
    fireEvent.click(button);
    expect(resetMock).toHaveBeenCalledTimes(1);
  });
});
