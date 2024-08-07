"use client";

import { logsnag } from "@/lib/logs";
import supabase from "@/supabase/browser";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const EVENTS = {
  PASSWORD_RECOVERY: "PASSWORD_RECOVERY",
  SIGNED_OUT: "SIGNED_OUT",
  USER_UPDATED: "USER_UPDATED",
};

export const VIEWS = {
  SIGN_IN: "sign_in",
  SIGN_UP: "sign_up",
  FORGOTTEN_PASSWORD: "forgotten_password",
  MAGIC_LINK: "magic_link",
  UPDATE_PASSWORD: "update_password",
};

export const AuthContext = createContext({});

export const AuthProvider = (props: any) => {
  const [initial, setInitial] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser]: any = useState(null);
  const [view, setView] = useState(VIEWS.SIGN_IN);
  const router = useRouter();
  const { accessToken, ...rest } = props;

  useEffect(() => {
    const getActiveSession = async () => {
      const {
        data: { session: activeSession },
      }: any = await supabase.auth.getSession();

      setSession(activeSession);
      setUser(activeSession?.user ?? null);
      setInitial(false);
    };

    getActiveSession();

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event, currentSession: any) => {
      if (currentSession?.access_token !== accessToken) {
        router.refresh();
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      switch (event) {
        case EVENTS.PASSWORD_RECOVERY:
          setView(VIEWS.UPDATE_PASSWORD);

          break;

        case EVENTS.SIGNED_OUT:
        case EVENTS.USER_UPDATED:
          setView(VIEWS.SIGN_IN);

          break;

        default:
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const value = useMemo(() => {
    return {
      initial,
      session,
      user,
      view,
      setView,
      signOut: async () => {
        supabase.auth.signOut();

        await logsnag.track({
          channel: "users",
          event: `User Sign-out: "${user?.user_metadata.name}"`,
          user_id: user?.id,
          icon: "👋",
          notify: true,
          tags: {
            email: user?.email,
          },
        });

        router.push("/");
      },
    };
  }, [initial, session, user, view]);

  return <AuthContext.Provider value={value} {...rest} />;
};

export const useAuth = (): any => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
