import React from 'react';
import { Page, Text, Document } from '@react-pdf/renderer';

// Absolute bare minimum - NO STYLES AT ALL
export const MinimalTemplate = ({ data }: any) => (
    <Document>
        <Page size="A4">
            <Text>Media Kit Test</Text>
            <Text>Name: Test</Text>
            <Text>Email: test@test.com</Text>
        </Page>
    </Document>
);
