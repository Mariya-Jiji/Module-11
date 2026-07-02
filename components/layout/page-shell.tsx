'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dropdown } from '@/components/ui/dropdown';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';

export function PageShell() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  return (
    <main className="min-h-screen bg-[#0B0B0C] px-6 py-16 text-white sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-full border border-[#1C1C1F] bg-[#111113]/80 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500" />
            <div>
              <p className="text-sm font-semibold">The AI Signal</p>
              <p className="text-xs text-[#A1A1AA]">Minimal product experience</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
            Open modal
          </Button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card
            title="Premium design system"
            description="A dark, minimal palette and reusable UI primitives for high-end product experiences."
            className="bg-[#111113]"
          >
            <div className="flex flex-wrap gap-3">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Input label="Email" placeholder="name@company.com" />
              <Dropdown
                label="Theme"
                items={[{ label: 'Dark', value: 'dark' }, { label: 'Light', value: 'light' }]}
                value={theme}
                onChange={setTheme}
              />
            </div>
          </Card>

          <Card title="Team" description="A polished profile and stat block for product surfaces." className="bg-[#111113]">
            <div className="flex items-center gap-4">
              <Avatar name="Ava Chen" size="lg" />
              <div>
                <p className="font-semibold text-white">Ava Chen</p>
                <p className="text-sm text-[#A1A1AA]">Design Lead</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-[#1C1C1F] bg-[#0B0B0C] p-4">
              <div className="flex items-center justify-between text-sm text-[#A1A1AA]">
                <span>Weekly focus</span>
                <span className="font-semibold text-white">12 tasks</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[#1C1C1F]">
                <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" />
              </div>
            </div>
          </Card>
        </section>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create workspace"
        description="A premium modal for onboarding, settings, or key actions."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Continue</Button>
          </>
        }
      >
        <Input label="Workspace name" placeholder="Northstar" />
        <Input label="Owner" placeholder="Ava Chen" />
      </Modal>
    </main>
  );
}
