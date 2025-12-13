'use client'

import MaintenancePopup from './MaintenancePopup'
import { maintenanceConfig } from '@/config/maintenance'

export default function MaintenancePopupWrapper() {
  // Check if maintenance popup should be shown (via config or environment variable)
  const showMaintenancePopup = 
    maintenanceConfig.showPopup || 
    process.env.NEXT_PUBLIC_SHOW_MAINTENANCE_POPUP === 'true'
  
  if (!showMaintenancePopup) return null
  
  return <MaintenancePopup />
}

