import React from 'react';
import { render } from '@testing-library/react';
import Loading from './loading';

describe('<Loading />', () => {
  it('should render with the correct text', () => {
    const { getByText } = render(<Loading />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('should render with the correct CSS classes and attributes', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="flex items-center justify-center mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8"
      >
        <div
          class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-gray-900 dark:text-white align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        />
        <span
          class="pl-2"
        >
          Loading...
        </span>
      </div>
    `);
  });
});
