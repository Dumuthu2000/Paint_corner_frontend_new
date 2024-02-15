// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import dotenv from 'dotenv';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   define:{
//     'process.env.URL':JSON.stringify(process.env.URL)
//   }
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
});
