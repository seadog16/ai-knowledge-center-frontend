import {defineConfig} from "umi";

export default defineConfig({
    routes: [
        {path: "/", component: "Chat", name: "对话助理"},
        {path: "/knowledge", component: "Knowledge", name: "知识库"},
    ],
    layout: {},
    plugins: [
        '@umijs/plugins/dist/antd',
        '@umijs/plugins/dist/access',
        '@umijs/plugins/dist/initial-state',
        '@umijs/plugins/dist/layout',
        '@umijs/plugins/dist/request',
        '@umijs/plugins/dist/model',
    ],
    npmClient: 'pnpm',
    cssLoaderModules: {
        // 配置驼峰式使用
        exportLocalsConvention: 'camelCase'
    },
    proxy: {
        "/api": {
            "target": "http://localhost:8080",
            "changeOrigin": true,
        }
    },
    request: {}
});
