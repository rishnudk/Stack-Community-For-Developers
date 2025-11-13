// import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
// import { panelRouter } from "trpc-panel";
// import { appRouter } from '@api/trpc/appRouter';
// import { createContext } from '@api/context';

// const panel = panelRouter({
//   router: appRouter,
//   url: "/api/trpc"
// });

// export async function GET(req: Request) {
//   return fetchRequestHandler({
//     req,
//     router: panel,
//     createContext,
//     endpoint: '/api/trpc/panel'
//   });
// }

// export async function POST(req: Request) {
//   return fetchRequestHandler({
//     req,
//     router: panel,
//     createContext,
//     endpoint: '/api/trpc/panel'
//   });
// }
