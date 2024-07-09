import { LogSnag } from "@logsnag/node";

export const logsnag = new LogSnag({
  token: process.env.NEXT_PUBLIC_LOGSNAG!,
  project: "paber-ai",
});

export const sendError = async (feature: any, desc: any) => {
  await logsnag.track({
    channel: "bugs",
    event: `New Error: "${feature} Error"`,
    icon: "🐞",
    description: desc,
    notify: true,
    tags: {
      feature,
    },
  });

  await logsnag.insight.increment({
    title: "Bugs, Errors & Craches",
    value: 1,
    icon: "🐞",
  });
};
