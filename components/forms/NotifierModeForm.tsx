'use client'

import { useState, useTransition } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { toast } from 'sonner'

export interface NotifierCompany {
  id: string
  name: string
  tier: number | string
  intl_policy: string
  pollable: boolean
  hires_new_grads: string
}

export interface NotifierSettingsValues {
  mode: 'v1' | 'v2'
  gateMode: 'strict_allowlist' | 'wide_net'
  strictRemoteOnly: boolean
  homeLocations: string[]
  freshnessDays: number
  enabledCompanyIds: string[]
}

type Props = {
  initial: NotifierSettingsValues
  companies: NotifierCompany[]
}

const NotifierModeForm = ({ initial, companies }: Props) => {
  const [values, setValues] = useState<NotifierSettingsValues>(initial)
  const [isPending, startTransition] = useTransition()

  const save = (patch: Partial<NotifierSettingsValues>) => {
    const next = { ...values, ...patch }
    const prev = values
    setValues(next)
    startTransition(async () => {
      try {
        const res = await fetch('/api/settings/notifier', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        toast.success('Notifier settings updated')
      } catch {
        setValues(prev)
        toast.error('Failed to update notifier settings')
      }
    })
  }

  const toggleCompany = (id: string) => {
    const has = values.enabledCompanyIds.includes(id)
    const nextIds = has
      ? values.enabledCompanyIds.filter(x => x !== id)
      : [...values.enabledCompanyIds, id]
    save({ enabledCompanyIds: nextIds })
  }

  const pollable = companies.filter(c => c.pollable)

  return (
    <div className="flex flex-col gap-6">
      <RadioGroup
        value={values.mode}
        onValueChange={(mode: 'v1' | 'v2') => save({ mode })}
        disabled={isPending}
        className="flex flex-col gap-3"
      >
        <div className="flex items-start space-x-3">
          <RadioGroupItem value="v1" id="mode-v1" className="mt-1" />
          <div>
            <Label htmlFor="mode-v1" className="text-md text-dark500_light800 font-semibold">
              v1 — General Remote · 24h digest
            </Label>
            <p className="text-sm text-light-500">
              Broad remote-job feeds, batched daily email. Passive discovery.
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <RadioGroupItem value="v2" id="mode-v2" className="mt-1" />
          <div>
            <Label htmlFor="mode-v2" className="text-md text-dark500_light800 font-semibold">
              v2 — Intl-Remote Targeted · Real-time
            </Label>
            <p className="text-sm text-light-500">
              Hourly polling of intl-remote-friendly companies + SimplifyJobs new-grad
              feed, with immediate per-role alerts. Be first to apply.
            </p>
          </div>
        </div>
      </RadioGroup>

      {values.mode === 'v2' && (
        <div className="flex flex-col gap-5 rounded-lg border border-light-700 p-4 dark:border-dark-400">
          <div className="flex flex-col gap-2">
            <Label className="text-md text-dark500_light800 font-semibold">Company gate</Label>
            <RadioGroup
              value={values.gateMode}
              onValueChange={(gateMode: 'strict_allowlist' | 'wide_net') => save({ gateMode })}
              disabled={isPending}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wide_net" id="gate-wide" />
                <Label htmlFor="gate-wide" className="text-dark500_light800">
                  Wide net — any qualifying new-grad SWE role (recommended)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="strict_allowlist" id="gate-strict" />
                <Label htmlFor="gate-strict" className="text-dark500_light800">
                  Strict allowlist — only confirmed travel-policy companies
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="strict-remote"
                checked={values.strictRemoteOnly}
                disabled={isPending}
                onCheckedChange={(strictRemoteOnly: boolean) => save({ strictRemoteOnly })}
              />
              <Label htmlFor="strict-remote" className="text-dark500_light800">
                Restrict by location (remote + home regions only)
              </Label>
            </div>
            {values.strictRemoteOnly && (
              <div className="ml-9 flex flex-col gap-1">
                <Label htmlFor="home-locations" className="text-sm text-light-500">
                  Also allow office roles in these locations (comma-separated). Leave blank
                  for remote-only.
                </Label>
                <Input
                  id="home-locations"
                  defaultValue={values.homeLocations.join(', ')}
                  disabled={isPending}
                  placeholder="Los Angeles, Orange County, Irvine"
                  onBlur={e => {
                    const next = e.target.value
                      .split(',')
                      .map(s => s.trim())
                      .filter(Boolean)
                    if (next.join('|') !== values.homeLocations.join('|')) {
                      save({ homeLocations: next })
                    }
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Label htmlFor="freshness" className="text-dark500_light800">
              Ignore postings older than
            </Label>
            <Input
              id="freshness"
              type="number"
              min={1}
              max={30}
              defaultValue={values.freshnessDays}
              disabled={isPending}
              className="w-20"
              onBlur={e => {
                const n = Number(e.target.value)
                if (n >= 1 && n <= 30 && n !== values.freshnessDays) {
                  save({ freshnessDays: n })
                }
              }}
            />
            <span className="text-dark500_light800">days</span>
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="companies" className="border-none">
              <AccordionTrigger className="text-dark500_light800">
                Target companies ({values.enabledCompanyIds.filter(id => pollable.some(c => c.id === id)).length}/{pollable.length} polled directly)
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {pollable.map(c => (
                    <div key={c.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`co-${c.id}`}
                        checked={values.enabledCompanyIds.includes(c.id)}
                        disabled={isPending}
                        onCheckedChange={() => toggleCompany(c.id)}
                        className="mt-0.5"
                      />
                      <Label htmlFor={`co-${c.id}`} className="text-sm text-dark500_light800">
                        {c.name}
                        <span className="ml-1 text-xs text-light-500">
                          {c.intl_policy}
                          {c.hires_new_grads === 'rare' ? ' · rarely hires new grads' : ''}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => save({ enabledCompanyIds: pollable.map(c => c.id) })}
                  >
                    Select all
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => save({ enabledCompanyIds: [] })}
                  >
                    Clear
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <p className="text-xs text-light-500">
            Policy day-counts are self-reported employer policies — always verify with the
            recruiter. Companies without a public job-board API (Google, Meta, Amazon, Apple,
            Uber, Atlassian, Shopify…) are still covered through the SimplifyJobs new-grad feed.
          </p>
        </div>
      )}
    </div>
  )
}

export default NotifierModeForm
