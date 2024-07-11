"use client";

import { queryClient } from "@/tools/qc";
import Auth from "@/supabase/auth/container";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAuth, VIEWS } from "@/supabase/auth/provider";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";

const App = () => {
  const { initial, user, view } = useAuth();

  if (initial) {
    return (
      <div className="flex items-center place-content-center place-items-center fixed inset-0">
        <ReloadIcon className="fill-black animate-spin justify-center" />
      </div>
    );
  }

  if (view === VIEWS.UPDATE_PASSWORD) {
    return <Auth view={view} />;
  } else if (user) {
    return (
      <QueryClientProvider client={queryClient}>
        {/* <Paber user={user} /> */}
        <></>
      </QueryClientProvider>
    );
  }

  return <Auth view={view} />;
};

export default App;
