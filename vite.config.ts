import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: true,
		port: 5173,
		proxy: {
			"/api": {
				target: "http://127.0.0.1:3002",
				changeOrigin: true,
				secure: false,
				ws: true,
				// rewrite: (path) => path.replace(/^\/api/, ""),
				configure: (proxy, _options) => {
					proxy.on("error", (err, _req, _res) => {
						console.log("proxy error", err);
					});
					proxy.on("proxyReq", (_proxyReq, req, _res) => {
						console.log(
							"Sending Request to the Target:",
							req.method,
							req.url
						);
					});
					proxy.on("proxyRes", (proxyRes, req, _res) => {
						console.log(
							"Received Response from the Target:",
							proxyRes.statusCode,
							req.url
						);
					});
				},
			},
			"/auth": {
				target: "http://127.0.0.1:4002",
				changeOrigin: true,
				secure: false,
				ws: true,
				configure: (proxy, _options) => {
					proxy.on("error", (err, _req, _res) => {
						console.log("proxy error", err);
					});
					proxy.on("proxyReq", (_proxyReq, req, _res) => {
						console.log(
							"Sending Request to the Target:",
							req.method,
							req.url
						);
					});
					proxy.on("proxyRes", (proxyRes, req, _res) => {
						console.log(
							"Received Response from the Target:",
							proxyRes.statusCode,
							req.url
						);
					});
				},
			},
		},
	},
});
