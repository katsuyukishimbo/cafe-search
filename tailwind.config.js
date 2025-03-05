/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        congestion: {
          empty: "#22c55e", // 空いている: 緑
          light: "#84cc16", // やや混雑: 黄緑
          medium: "#facc15", // 混雑: 黄色
          high: "#f97316", // やや混んでいる: オレンジ
          extreme: "#ef4444", // 非常に混雑: 赤
          unknown: "#94a3b8", // データなし: グレー
        },
      },
    },
  },
  plugins: [],
};
