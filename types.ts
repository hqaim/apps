import React from 'react';

export enum ToolId {
  DASHBOARD = 'dashboard',
  LOGO_FORGE = 'logo_forge',
  EVENT_HORIZON = 'event_horizon',
  SITE_ARCHITECT = 'site_architect',
  COPY_PRO = 'copy_pro',
  SOCIAL_VIRAL = 'social_viral',
  PIXEL_GEN = 'pixel_gen'
}

export interface ToolDefinition {
  id: ToolId;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export interface GeneratedContent {
  id: string;
  type: ToolId;
  content: string; // Could be URL, text, or SVG code
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  isPro: boolean;
}