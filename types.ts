import React from 'react';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Stat {
  label: string;
  value: string;
  suffix?: string;
}

export interface PersonaData {
  title: string;
  description: string;
  painPoint: string;
  solution: string;
}

export enum PlatformMode {
  WEB = 'WEB',
  DESKTOP = 'DESKTOP'
}