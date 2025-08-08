'use client'

import { useState, useTransition } from 'react'
import { Switch } from '@/components/ui/switch'
import {api} from "@/lib/api";
import {toast} from "sonner";

type Props = {
  userId: string
  initial: boolean
}

const ReceiveAlertsSwitch = ({ userId, initial }: Props) => {
  const [enabled, setEnabled] = useState(initial)
  const [isPending, startTransition] = useTransition()

  const toggle = () => {
    const next = !enabled
    setEnabled(next)

    startTransition(async () => {
			try {
				await api.settings.updateAlerts(userId, next)
				toast.success(`Email Alerts Successfully ${next ? 'Enabled' : 'Disabled'}`)
			} catch (error) {
				setEnabled(!next)
				toast.error("Failed to update email alerts")
			}
    })
  }

  return (
    <Switch
      id="receive-alerts"
      checked={enabled}
      disabled={isPending}
      onCheckedChange={toggle}
      className="body-medium rounded-lg capitalize shadow-none bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
    />
  )
}

export default ReceiveAlertsSwitch;
