import "@/assets/main.css";
import Head from "@/app/head";
import { Toaster } from "react-hot-toast";
import createClient from "@/supabase/server";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme";
import { AuthProvider } from "@/supabase/auth/provider";

export const revalidate = 0;

const APP_NAME = "Paber AI";
const APP_DEFAULT_TITLE = "Paber AI";
const APP_TITLE_TEMPLATE = "Paber AI - %s";
const APP_DESCRIPTION = "Make your own Academic Research Paper using AI ✨";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  metadataBase: new URL("https://paberai.com"),
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token || null;

  return (
    <html>
      <body>
        <Head title="Paber AI" />

        <AuthProvider accessToken={accessToken}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            <Toaster
              containerStyle={{
                left: "10px",
                right: "10px",
              }}
              toastOptions={{
                style: {
                  borderRadius: "12px",
                  minWidth: "fit-content",
                  boxShadow:
                    "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--toast-shadow)",
                },
              }}
            />

            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
