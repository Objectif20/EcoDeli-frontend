"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { IntroDisclosure } from "@/components/ui/intro-disclosure"

const steps = [
  {
    title: "Lorem Ipsum Dolor",
    short_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    full_description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc eu nisl.",
    media: {
      type: "image" as const,
      src: "/feature-3.png",
      alt: "Lorem ipsum image",
    },
  },
  {
    title: "Sed Do Eiusmod",
    short_description: "Sed do eiusmod tempor incididunt ut labore et dolore.",
    full_description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    media: {
      type: "image" as const,
      src: "/feature-2.png",
      alt: "Lorem ipsum customization",
    },
    action: {
      label: "View Lorem Ipsum",
      href: "/docs/lorem-ipsum",
    },
  },
  {
    title: "Duis Aute Irure",
    short_description: "Duis aute irure dolor in reprehenderit in voluptate.",
    full_description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    media: {
      type: "image" as const,
      src: "/feature-1.png",
      alt: "Lorem ipsum responsive design",
    },
  },
  {
    title: "Excepteur Sint",
    short_description: "Excepteur sint occaecat cupidatat non proident.",
    full_description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    action: {
      label: "View Lorem Ipsum Components",
      href: "/docs/lorem-ipsum-components",
    },
  },
]

export function IntroDisclosureDemo() {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)



  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize() // Check the initial window size
    window.addEventListener("resize", handleResize)

    setOpen(true) // Open the intro on component mount

    return () => window.removeEventListener("resize", handleResize)
  }, [])


  return (
    <div>
        <IntroDisclosure
          open={open}
          setOpen={setOpen}
          steps={steps}
          featureId={isMobile ? "intro-demo-mobile" : "intro-demo"}
          onComplete={() => toast.success("Tour completed")}
          onSkip={() => toast.info("Tour skipped")}
          forceVariant={isMobile ? "mobile" : undefined}
        />
    </div>
  )
}
