import React from 'react';
import { Settings as SettingsIcon, Bell, Moon, Shield } from 'lucide-react';
import { Card } from '@/components/common/Card';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 lg:pb-10 max-w-2xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl lg:text-3xl text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-gold-highlight" />
          <span>Settings</span>
        </h1>
        <p className="text-sm text-casino-muted">
          Manage your notifications, audio effects, and privacy.
        </p>
      </div>

      <Card variant="default" className="divide-y divide-white/5">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gold-highlight" />
            <div>
              <p className="text-sm font-semibold text-white">Push Notifications</p>
              <p className="text-xs text-casino-muted">Alerts when predictions close or outcomes are finalized</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            ENABLED
          </span>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-gold-highlight" />
            <div>
              <p className="text-sm font-semibold text-white">Casino Dark Theme</p>
              <p className="text-xs text-casino-muted">Obsidian Gold & Deep Velvet</p>
            </div>
          </div>
          <span className="text-xs font-mono text-gold-highlight bg-gold/10 px-2.5 py-1 rounded-full">
            ACTIVE
          </span>
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-gold-highlight" />
            <div>
              <p className="text-sm font-semibold text-white">Classroom Privacy</p>
              <p className="text-xs text-casino-muted">Personal email address is hidden from other classmates</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
            PROTECTED
          </span>
        </div>
      </Card>
    </div>
  );
};

