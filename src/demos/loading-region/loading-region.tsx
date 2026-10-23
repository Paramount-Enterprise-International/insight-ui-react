import { useState } from 'react';
import {
  IButton,
  IGrid,
  IGridColumn,
  IGridDataSource,
  ILoadingRegion,
  ISection,
  ISectionBody,
  ISectionHeader,
} from '../../components';
export function LoadingRegionDemo() {
  const [loading, setLoading] = useState(false);
  const [data] = useState(
    () =>
      new IGridDataSource(
        Array.from({ length: 12 }, (_, index) => ({
          name: 'Record ' + (index + 1),
        })),
        { paginator: { pageSize: 10 } }
      )
  );
  return (
    <div className="flex flex-col gap-lg p-lg">
      <h1>Loading Region</h1>
      <IButton onClick={() => setLoading(!loading)}>Toggle Refresh</IButton>
      <ISection>
        <ISectionHeader>Retained grid</ISectionHeader>
        <ISectionBody>
          <ILoadingRegion loading={loading}>
            <IGrid dataSource={data}>
              <IGridColumn fieldName="name" title="Name" />
            </IGrid>
          </ILoadingRegion>
        </ISectionBody>
      </ISection>
      <ISection>
        <ISectionHeader>Nested form regions</ISectionHeader>
        <ISectionBody>
          <ILoadingRegion loading={loading}>
            <ILoadingRegion>
              <label>
                Unsaved form value{' '}
                <input defaultValue="Edit and toggle refresh" />
              </label>
            </ILoadingRegion>
          </ILoadingRegion>
        </ISectionBody>
      </ISection>
      <ISection>
        <ISectionHeader>Mixed content</ISectionHeader>
        <ISectionBody>
          <ILoadingRegion loading={loading}>
            <p>Content retains its normal padding.</p>
            <label>
              Another value <input defaultValue="Editable" />
            </label>
          </ILoadingRegion>
        </ISectionBody>
      </ISection>
    </div>
  );
}
