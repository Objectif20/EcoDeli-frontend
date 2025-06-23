import i18n, { InitOptions } from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import axiosInstance from "@/api/axiosInstance"

const mergeTranslations = (apiObj: any, fallbackObj: any, path: string = ""): any => {
  console.log(`🔍 Merge à ${path || "racine"}`)
  
  if (typeof apiObj !== "object" || apiObj === null) {
    if (typeof apiObj === "string" && apiObj.trim() !== "") {
      console.log(`✅ API valide à ${path}: "${apiObj}"`)
      return apiObj
    }
    if (typeof fallbackObj === "string" && fallbackObj.trim() !== "") {
      console.log(`🔄 Fallback utilisé à ${path}: "${fallbackObj}"`)
      return fallbackObj
    }
    console.log(`❌ Aucune valeur valide à ${path}`)
    return ""
  }

  if (typeof fallbackObj !== "object" || fallbackObj === null) {
    console.log(`⚠️ Fallback non-objet à ${path}, utilisation API`)
    return apiObj
  }

  const result: any = {}
  const allKeys = new Set([...Object.keys(apiObj), ...Object.keys(fallbackObj)])
  
  console.log(`📋 Clés trouvées à ${path}:`, Array.from(allKeys))

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key
    const apiVal = apiObj[key]
    const fallbackVal = fallbackObj[key]

    if (typeof apiVal === "string" || typeof fallbackVal === "string") {
      if (typeof apiVal === "string" && apiVal.trim() !== "") {
        console.log(`✅ String API gardée à ${currentPath}: "${apiVal}"`)
        result[key] = apiVal
      } else if (typeof fallbackVal === "string" && fallbackVal.trim() !== "") {
        console.log(`🔄 String fallback utilisée à ${currentPath}: "${fallbackVal}"`)
        result[key] = fallbackVal
      } else {
        console.log(`❌ String vide à ${currentPath}`)
        result[key] = ""
      }
    } else {
      result[key] = mergeTranslations(apiVal, fallbackVal, currentPath)
    }
  }

  return result
}

export const loadTranslations = async (lng: string) => {
  try {
    console.log(`🚀 Chargement des traductions pour: ${lng}`)
    
    const [apiResRaw, fallbackResRaw] = await Promise.all([
      axiosInstance.get(`/client/languages/${lng}`).then((res) => {
        console.log("📡 Réponse API reçue:", res.data)
        return res.data
      }),
      fetch("/locales/fr.json")
        .then(async (res) => {
          if (!res.ok) {
            console.warn("Fichier de fallback introuvable :", res.status)
            return {}
          }
          const data = await res.json()
          console.log("📁 Fichier fallback chargé:", data)
          return data
        })
        .catch((err) => {
          console.warn("Erreur lors du chargement du fichier de fallback :", err)
          return {}
        }),
    ])

    const apiRes = typeof apiResRaw === "object" && apiResRaw !== null ? apiResRaw : {}
    const fallbackRes = typeof fallbackResRaw === "object" && fallbackResRaw !== null ? fallbackResRaw : {}

    console.log("🔧 Début du merge récursif...")
    const merged = mergeTranslations(apiRes, fallbackRes)
    
    console.log("✨ Résultat final du merge:", merged)
    return merged

  } catch (error) {
    console.error("❌ Erreur chargement des traductions :", error)

    try {
      console.log("🔄 Tentative de fallback complet...")
      const fallbackRes = await fetch("/locales/fr.json")
      if (fallbackRes.ok) {
        const data = await fallbackRes.json()
        console.log("✅ Fallback complet chargé:", data)
        return data
      }
    } catch (err) {
      console.warn("❌ Fallback également échoué :", err)
    }

    return {}
  }
}

export const initI18n = async (lng: string) => {
  const translations = await loadTranslations(lng)

  const options: InitOptions = {
    lng,
    fallbackLng: "fr",
    debug: false,
    interpolation: { escapeValue: false },
    resources: {
      [lng]: { translation: translations },
    },
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator"],
      caches: ["localStorage", "cookie"],
      cookieOptions: {
        path: "/",
        sameSite: "strict",
        expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
      },
    },
    initImmediate: false,
  }

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init(options)

  return i18n
}

export default i18n