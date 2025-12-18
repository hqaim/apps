import React from 'react';
import { ToolId, ToolDefinition } from './types';
import { 
  LayoutDashboard, 
  PenTool, 
  Calendar, 
  Layout, 
  Video, 
  Type, 
  Share2, 
  Image as ImageIcon 
} from 'lucide-react';

export const TOOLS: ToolDefinition[] = [
  {
    id: ToolId.PIXEL_GEN,
    name: 'Pixel Gen',
    description: 'Photorealistic AI Image Generator & Art Studio.',
    icon: <ImageIcon className="w-5 h-5" />,
    color: 'text-pink-400'
  },
  {
    id: ToolId.LOGO_FORGE,
    name: 'Logo Forge',
    description: 'Professional AI Logo Generator & Brand Identity Kit.',
    icon: <PenTool className="w-5 h-5" />,
    color: 'text-emerald-400'
  },
  {
    id: ToolId.SITE_ARCHITECT,
    name: 'Site Architect',
    description: 'Instant AI Website Builder & Landing Page Generator.',
    icon: <Layout className="w-5 h-5" />,
    color: 'text-blue-400'
  },
  {
    id: ToolId.COPY_PRO,
    name: 'Copy Pro',
    description: 'AI Copywriter for High-Converting Ads & Email Marketing.',
    icon: <Type className="w-5 h-5" />,
    color: 'text-yellow-400'
  },
  {
    id: ToolId.SOCIAL_VIRAL,
    name: 'Social Viral',
    description: 'Viral Content Generator for Instagram, LinkedIn & X.',
    icon: <Share2 className="w-5 h-5" />,
    color: 'text-purple-400'
  },
  {
    id: ToolId.EVENT_HORIZON,
    name: 'Event Horizon',
    description: 'AI Flyer Maker & Event Banner Designer for Print/Web.',
    icon: <Calendar className="w-5 h-5" />,
    color: 'text-orange-400'
  }
];

export const APP_NAME = "HQAIM Apps";