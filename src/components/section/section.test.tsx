import { render } from '@testing-library/react';
import { ISection, ISectionHeader } from './section';

describe('ISection', () => {
  it('renders section shell', () => {
    const { container } = render(
      <ISection>
        <ISectionHeader>Title</ISectionHeader>
      </ISection>
    );

    expect(container.querySelector('i-section')).toBeTruthy();
    expect(container.querySelector('i-section-header h4')).toHaveTextContent('Title');
  });
});
