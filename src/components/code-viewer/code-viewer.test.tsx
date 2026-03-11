import React from 'react';
import { render } from '@testing-library/react';
import { ICodeViewer } from './code-viewer';

describe('ICodeViewer', () => {
  it('renders host', () => {
    const { container } = render(
      <ICodeViewer
        code="const x = 1;"
        language="typescript"
        highlighter="none"
      />
    );

    expect(container.querySelector('i-code-viewer')).toBeTruthy();
  });
});
