import type React from "react"
import { DownloadIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const subscriptionHistory = [
  { id: 1, month: "Février 2025", status: "Validée" },
  { id: 2, month: "Janvier 2025", status: "Validée" },
  { id: 3, month: "Décembre 2024", status: "Validée" },
  { id: 4, month: "Novembre 2024", status: "Validée" },
  { id: 5, month: "Octobre 2024", status: "Validée" },
  { id: 6, month: "Septembre 2024", status: "Validée" },
  { id: 7, month: "Août 2024", status: "Validée" },
  { id: 8, month: "Juillet 2024", status: "Validée" },
  { id: 9, month: "Juin 2024", status: "Validée" },
  { id: 10, month: "Mai 2024", status: "Validée" },
]

export const SubscriptionTable: React.FC = () => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Mois</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Facture</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptionHistory.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.month}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-100 text-green-700 hover:bg-green-100">
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                  Télécharger <DownloadIcon className="ml-2 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

