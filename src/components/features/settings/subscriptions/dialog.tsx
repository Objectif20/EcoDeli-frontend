import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plan, RegisterApi } from "@/api/register.api"

interface SubscriptionDialogProps {
  children: React.ReactNode
  onPlanChange?: (planId: number) => void
}

export function SubscriptionDialog({ children, onPlanChange }: SubscriptionDialogProps) {
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchPlans = async () => {
        try {
            const response = RegisterApi.getPlan()
            const mockPlans: Plan[] = await response
            setPlans(mockPlans)
        }
        catch (error) {
            console.error("Error fetching plans:", error)
        }
    }

    fetchPlans()
  }, [])

  const handlePlanChange = (planId: string) => {
    const plan = plans.find((p) => p.plan_id === Number.parseInt(planId))
    setSelectedPlan(plan || null)
  }

  const handleConfirm = () => {
    if (selectedPlan && onPlanChange) {
      onPlanChange(selectedPlan.plan_id)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Changer de formule</DialogTitle>
          <DialogDescription>Trouver l'abonnement qui vous correspond</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select onValueChange={handlePlanChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choisissez un plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.plan_id} value={plan.plan_id.toString()}>
                    {plan.name} - {plan.price}€
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPlan && (
            <div className="bg-muted p-3 rounded-md">
              <h4 className="font-medium mb-2">
                {selectedPlan.name}
              </h4>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span>Prix :</span>
                  <span className="font-medium">
                    {selectedPlan.price}€ / mois
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Réduction sur les petits colis :</span>
                  <span className="font-medium">{selectedPlan.shipping_discount}%</span>
                </li>
                <li className="flex justify-between">
                  <span>Réduction permanentes :</span>
                  <span className="font-medium">{selectedPlan.permanent_discount}%</span>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedPlan}>
            Changer d'abonnement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
