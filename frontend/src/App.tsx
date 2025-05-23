
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EventListPage from "./pages/EventListPage";
import EventFormPage from "./pages/EventFormPage";
import EventDetailPage from "./pages/EventDetailPage";
import ParticipantListPage from "./pages/ParticipantListPage";
import ParticipantFormPage from "./pages/ParticipantFormPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<EventListPage />} />
              <Route path="/events" element={<EventListPage />} />
              <Route path="/events/create" element={<EventFormPage />} />
              <Route path="/events/edit/:id" element={<EventFormPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/participants" element={<ParticipantListPage />} />
              <Route path="/participants/create" element={<ParticipantFormPage />} />
              <Route path="/participants/edit/:id" element={<ParticipantFormPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
