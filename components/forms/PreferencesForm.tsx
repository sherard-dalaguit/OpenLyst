'use client'

import { useState, useTransition } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { api } from '@/lib/api'
import {toast} from "sonner";

type Props = {
  userId: string
  initialCategories: string[]
  initialFrequency: 'daily'|'weekly'
  allCategories: { value: string; label: string }[]
}

export default function PreferencesForm({
  userId,
  initialCategories,
  initialFrequency,
  allCategories
}: Props) {
  const [categories, setCategories] = useState<string[]>(initialCategories)
  const [frequency, setFrequency] = useState(initialFrequency)
  const [isPending, startTransition]= useTransition()

  const save = (newCats: string[], newFreq: 'daily'|'weekly') => {
    startTransition(async () => {
      try {
        await api.settings.updatePreferences(userId, newCats, newFreq)
        toast.success("Email Preferences Successfully Saved")
      } catch {
        toast.error("Failed to save email preferences. Please try again.")
      }
    })
  }

  const onToggleCategory = (cat: string) => {
    const next = categories.includes(cat)
      ? categories.filter(c => c !== cat)
      : [...categories, cat]
    setCategories(next)
    save(next, frequency)
  }

  const onChangeFrequency = (val: 'daily'|'weekly') => {
    setFrequency(val)
    save(categories, val)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="h2-semibold mb-2">Job Categories</h3>
        <div className="grid grid-cols-2 gap-3">
          {allCategories.map(({ value, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Checkbox
                id={label}
                checked={categories.includes(label)}
                disabled={isPending}
                onCheckedChange={() => onToggleCategory(label)}
								className="background-light900_dark300 border-light-400"
              />
              <Label htmlFor={label} className="text-md text-dark500_light800">{label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="h2-semibold mb-2">Frequency</h3>
        <RadioGroup
          value={frequency}
          onValueChange={(v) => onChangeFrequency(v as 'daily'|'weekly')}
          disabled={isPending}
        >
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="daily" id="freq-daily" className="background-light900_dark300" />
              <Label htmlFor="freq-daily" className="text-md text-dark500_light800">Daily</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="weekly" id="freq-weekly" className="background-light900_dark300" />
              <Label htmlFor="freq-weekly" className="text-md text-dark500_light800">Weekly</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
