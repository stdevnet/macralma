import { cookieStorage, createStorage } from "@wagmi/core";

import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

import { sepolia } from "@reown/appkit/networks";

const projectIdEnv = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!projectIdEnv) {
  throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID no está definido");
}

export const projectId: string = projectIdEnv;

export const networks = [sepolia] as [typeof sepolia];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),

  ssr: true,

  projectId,

  networks,
});

export const config = wagmiAdapter.wagmiConfig;
