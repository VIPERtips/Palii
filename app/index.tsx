import AnimatedSplash from "@/components/AnimatedSplash"
import { useAuth } from "@clerk/clerk-expo"
import { Redirect } from "expo-router"
import { useState } from "react"

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth()
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />
  }

  if (!isLoaded) {
    // While Clerk is loading, keep a fallback loader (rarely shown)
    return <AnimatedSplash onFinish={() => setShowSplash(false)} />
  }

  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)/home" />
  }

  return <Redirect href="/(auth)/welcome" />
}
