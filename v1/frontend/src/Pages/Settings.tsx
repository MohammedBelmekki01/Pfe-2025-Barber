import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle"; // Assumes you have this component

function Settings() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <Card className="w-full max-w-lg rounded-3xl shadow-2xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg relative overflow-visible">
        {/* Floating Icon */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-yellow-400 dark:to-orange-400 rounded-full p-4 shadow-lg flex items-center justify-center">
          {theme === "dark" ? (
            <Moon className="w-8 h-8 text-white transition-all duration-300" />
          ) : (
            <Sun className="w-8 h-8 text-white transition-all duration-300" />
          )}
        </div>
        <CardHeader className="pt-12 pb-4 text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
            Paramètres du compte
          </CardTitle>
          <CardDescription className="mt-2 text-base">
            Personnalisez votre expérience et vos préférences d&apos;affichage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-slate-100 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl px-6 py-5 shadow-inner">
            <div>
              <div className="font-semibold text-lg">Mode d&apos;affichage</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Basculez entre le mode clair et sombre.
              </div>
            </div>
            <ModeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Settings;