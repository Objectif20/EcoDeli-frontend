"use client"

import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import type { RootState } from "@/redux/store"
import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { MoreVertical, Camera, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Type pour les utilisateurs bloqués
interface BlockedUser {
  id: string
  name: string
  avatar: string
}

const ProfileSettings: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user)

  const isProvider = user?.profile.includes("PROVIDER")
  const isClient = user?.profile.includes("CLIENT")
  const isMerchant = user?.profile.includes("MERCHANT")
  const isDeliveryman = user?.profile.includes("DELIVERYMAN")

  // État pour l'image de profil
  const [profileImage, setProfileImage] = useState<string | null>(user?.avatar || null)

  // État pour les utilisateurs bloqués (exemple de données)
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    { id: "1", name: "Nom prénom", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "2", name: "Nom prénom", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "3", name: "Nom prénom", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "4", name: "Nom prénom", avatar: "/placeholder.svg?height=40&width=40" },
  ])

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Paramètres", "Profil"],
        links: ["/office/dashboard"],
      }),
    )
  }, [dispatch])

  // Fonction pour mettre à jour l'image de profil
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
        // Ici vous pourriez ajouter une logique pour envoyer l'image au serveur
      }
      reader.readAsDataURL(file)
    }
  }

  // Fonction pour supprimer l'image de profil
  const removeProfileImage = () => {
    setProfileImage(null)
    // Ici vous pourriez ajouter une logique pour supprimer l'image sur le serveur
  }

  // Fonction pour débloquer un utilisateur
  const unblockUser = (userId: string) => {
    setBlockedUsers(blockedUsers.filter((user) => user.id !== userId))
    // Ici vous pourriez ajouter une logique pour débloquer l'utilisateur sur le serveur
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Profil</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        {/* Menu de navigation existant - ne pas modifier */}
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings">Paramètres généraux</Link>
          <Link to="/office/profile" className="font-semibold text-primary active-link">
            Profil
          </Link>
          <Link to="/office/privacy">Confidentialité</Link>
          <Link to="/office/contact-details">Coordonnées</Link>
          {(isMerchant || isClient) && <Link to="/office/subscriptions">Abonnements</Link>}
          {(isProvider || isDeliveryman) && <Link to="/office/billing-settings">Facturations</Link>}
          <Link to="/office/reports">Signalements</Link>
        </nav>

        {/* Contenu principal */}
        <div className="grid gap-6">
          <div>
            <h2 className="text-xl font-medium mb-2">Profil</h2>
            <p className="text-sm text-muted-foreground mb-4">Modifier votre profil</p>

            {/* Section de l'image de profil */}
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-background">
                  <AvatarImage src={profileImage || "/placeholder.svg?height=96&width=96"} alt="Photo de profil" />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>

                {/* Bouton pour télécharger une nouvelle image */}
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {/* Bouton pour supprimer l'image */}
              {profileImage && (
                <Button variant="ghost" size="icon" onClick={removeProfileImage} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Separator className="my-6" />

            {/* Liste des utilisateurs bloqués */}
            <div>
              <h2 className="text-lg font-medium mb-4">Liste des utilisateurs que vous avez bloqués</h2>

              <div className="space-y-4">
                {blockedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-default">{user.name}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => unblockUser(user.id)}>
                          Débloquer l'utilisateur
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}

                {blockedUsers.length === 0 && (
                  <p className="text-sm text-muted-foreground">Vous n'avez bloqué aucun utilisateur.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
