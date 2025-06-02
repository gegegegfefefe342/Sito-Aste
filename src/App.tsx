
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AuctionProvider } from "./context/AuctionContext";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import NotFound from "./pages/NotFound";
import { checkCookiesEnabled, checkJavaScriptEnabled } from "./utils/browserCheck";
import { useState, useEffect } from "react";
import "./styles/global.css";

const queryClient = new QueryClient();

const App = () => {
  const [cookiesEnabled, setCookiesEnabled] = useState(true);
  const [jsEnabled, setJsEnabled] = useState(true);

  useEffect(() => {
    setCookiesEnabled(checkCookiesEnabled());
    setJsEnabled(checkJavaScriptEnabled());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AuctionProvider>
              <div className="min-h-screen bg-gray-50">
                {!cookiesEnabled && (
                  <div className="bg-red-600 text-white text-center py-2 px-4">
                    Per favore abilita i cookie: il sito potrebbe non funzionare correttamente.
                  </div>
                )}
                {!jsEnabled && (
                  <div className="bg-red-600 text-white text-center py-2 px-4">
                    Per favore abilita JavaScript per utilizzare tutte le funzionalità del sito.
                  </div>
                )}
                
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </div>
            </AuctionProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
