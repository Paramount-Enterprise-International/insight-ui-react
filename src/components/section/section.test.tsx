import { fireEvent, render, screen } from '@testing-library/react';
import { ISection, ISectionHeader, ISectionTab, ISectionTabs } from './section';

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

describe('ISectionTabs', () => {
  function renderTabs(props: Partial<React.ComponentProps<typeof ISectionTabs>> = {}) {
    return render(
      <ISectionTabs {...props}>
        <ISectionTab title="First">First content</ISectionTab>
        <ISectionTab title="Second">Second content</ISectionTab>
      </ISectionTabs>
    );
  }

  it('selects a tab and emits its index', () => {
    const onSelectedIndexChange = vi.fn();
    renderTabs({ onSelectedIndexChange });

    fireEvent.click(screen.getByRole('tab', { name: 'Second' }));

    expect(onSelectedIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByText('Second content')).toBeVisible();
  });

  it('supports keyboard tab selection', () => {
    const onSelectedIndexChange = vi.fn();
    renderTabs({ onSelectedIndexChange });

    fireEvent.keyDown(screen.getByRole('tab', { name: 'First' }), {
      key: 'ArrowRight',
    });

    expect(onSelectedIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveFocus();
  });

  it('applies sticky and bar variant modifiers', () => {
    const { container } = renderTabs({
      sticky: true,
      stickyTopOffset: '-8px',
      styleVariant: 'bar',
    });

    expect(container.querySelector('i-section-tabs')).toHaveClass(
      'i-section-tabs--bar'
    );
    expect(container.querySelector('.i-section-tabs-headers')).toHaveClass(
      'i-section-tabs-headers--sticky'
    );
    expect(container.querySelector('.i-section-tabs-headers')).toHaveStyle(
      '--i-section-tabs-sticky-top: -8px'
    );
  });

  it('renders scroll controls only when scrollable mode is enabled', () => {
    const { container } = renderTabs({ scrollable: true, chevronSize: 'sm' });

    expect(screen.getByRole('button', { name: 'Scroll tabs left' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Scroll tabs right' })).toBeInTheDocument();
    expect(container.querySelector('.i-section-tabs-scroll')).toHaveClass(
      'i-section-tabs-scroll--scrollable'
    );
  });
});
