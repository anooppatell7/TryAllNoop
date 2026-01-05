import React from 'react';

export enum ToolType {
  MOCK_DATA = 'MOCK_DATA',
  REGEX_BUILDER = 'REGEX_BUILDER',
  CODE_SIMPLIFIER = 'CODE_SIMPLIFIER'
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export interface GeneratedResult {
  content: string;
  metadata?: string;
  error?: string;
}

export interface MockDataRequest {
  topic: string;
  format: 'JSON' | 'CSV' | 'SQL';
  count: number;
  complexity: 'Simple' | 'Complex';
}