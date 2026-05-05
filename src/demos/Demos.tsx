// import React from 'react';
import { Link } from 'react-router-dom';
import { ISection, ISectionBody } from '../components';
// void React;

export function Demos() {
  return (
    <ISection>
      <ISectionBody>
        <h1>Demos</h1>
        <p>
          This is a simple page rendered via <strong>IRouter</strong>.
        </p>
        <Link to="components">Go To Components</Link>
      </ISectionBody>
    </ISection>
  );
}
